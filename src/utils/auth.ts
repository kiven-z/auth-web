import Cookies from 'js-cookie';
import { useUserStoreHook } from '@/store/modules/user';
import { isString, storageLocal } from '@pureadmin/utils';

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** `accessToken`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string;
  /** 用户 ID（与后端 Long 字符串化一致） */
  userId?: string;
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}

/**
 * 将后端返回的过期时间转为毫秒时间戳（兼容 yyyy/MM/dd HH:mm:ss）。
 */
export function toExpiresTimestamp(expires: string | number | Date | undefined): number {
  if (expires === undefined || expires === null) return 0;
  if (typeof expires === 'number') return expires;
  if (expires instanceof Date) return expires.getTime();
  const normalized = String(expires).replace(/\//g, '-');
  const t = new Date(normalized).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** 写入会话所需的字段（登录或刷新后）；SSO 等场景可缺省 refreshToken/expires，由默认值补齐 */
export type SessionTokenPayload = {
  accessToken: string;
  refreshToken?: string;
  expires?: string | number | Date;
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  userId?: string;
};

export const userKey = 'user-info';
export const TokenKey = 'authorized-token';

/**
 * 从 localStorage 读取已缓存的用户展示信息（单一读取入口，供 Pinia 初始化等使用）。
 */
export function readUserProfileFromStorage(): Partial<DataInfo<number>> {
  const raw = storageLocal().getItem<DataInfo<number>>(userKey);
  return raw ?? {};
}
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = 'multiple-tabs';

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey) ? JSON.parse(Cookies.get(TokenKey)) : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将用户信息、`refreshToken`、`expires` 等放在 key 为 `user-info` 的 localStorage 里
 */
export function setToken(data: SessionTokenPayload) {
  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken ?? '';
  const { isRemembered, loginDay } = useUserStoreHook();
  const expiresSource = data.expires !== undefined && data.expires !== null ? data.expires : Date.now() + 8 * 3600000;
  const expires = toExpiresTimestamp(expiresSource);
  const cookieString = JSON.stringify({ accessToken, expires, refreshToken });

  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000,
      })
    : Cookies.set(TokenKey, cookieString);

  Cookies.set(
    multipleTabsKey,
    'true',
    isRemembered
      ? {
          expires: loginDay,
        }
      : {}
  );

  function setUserKey(payload: {
    avatar: string;
    username: string;
    nickname: string;
    roles: Array<string>;
    permissions: Array<string>;
    userId?: string;
  }) {
    useUserStoreHook().SET_AVATAR(payload.avatar);
    useUserStoreHook().SET_USERNAME(payload.username);
    useUserStoreHook().SET_NICKNAME(payload.nickname);
    useUserStoreHook().SET_ROLES(payload.roles);
    useUserStoreHook().SET_PERMS(payload.permissions);
    if (payload.userId !== undefined) {
      useUserStoreHook().SET_USER_ID(payload.userId);
    }
    storageLocal().setItem(userKey, {
      refreshToken,
      expires,
      avatar: payload.avatar,
      username: payload.username,
      nickname: payload.nickname,
      roles: payload.roles,
      permissions: payload.permissions,
      userId: payload.userId,
    });
  }

  if (data.username && data.roles) {
    setUserKey({
      avatar: data?.avatar ?? '',
      username: data.username,
      nickname: data?.nickname ?? '',
      roles: data.roles,
      permissions: data?.permissions ?? [],
      userId: data.userId,
    });
  } else {
    const prev = storageLocal().getItem<DataInfo<number>>(userKey);
    setUserKey({
      avatar: prev?.avatar ?? '',
      username: prev?.username ?? '',
      nickname: prev?.nickname ?? '',
      roles: prev?.roles ?? [],
      permissions: prev?.permissions ?? [],
      userId: prev?.userId,
    });
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = '*:*:*';
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  return isString(value);
};

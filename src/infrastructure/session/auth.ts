import { multipleTabsKey, userKey } from '@/config/auth-config';
import { useUserStoreHook } from '@/store/modules/user';
import { storageLocal } from '@pureadmin/utils';
import Cookies from 'js-cookie';

export interface DataInfo<T> {
  /** token */
  accessToken?: string;
  /** `accessToken`的过期时间（时间戳） */
  expires?: T;
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

/** 写入会话所需的字段（登录或刷新后）；SSO 等场景可缺省 expires，由默认值补齐 */
export type SessionTokenPayload = {
  accessToken: string;
  expires?: string | number | Date;
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  userId?: string;
};

/**
 * 从 localStorage 读取已缓存的用户展示信息（单一读取入口，供 Pinia 初始化等使用）。
 */
export function readUserProfileFromStorage(): Partial<DataInfo<number>> {
  const raw = storageLocal().getItem<DataInfo<number>>(userKey);
  return raw ?? {};
}

/** 内存中的 accessToken（页面刷新后清空） */
let memoryAccessToken = '';

/** 获取`token` */
export function getToken(): DataInfo<number> {
  const profile = storageLocal().getItem<DataInfo<number>>(userKey);
  return {
    ...(profile ?? {}),
    accessToken: memoryAccessToken,
  };
}

/** 是否存在内存态 accessToken */
export function hasAccessToken(): boolean {
  return memoryAccessToken.length > 0;
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）与`expires`（`accessToken`过期时间）
 * `accessToken` 仅保存在内存中；用户资料与过期时间保存在 key 为 `user-info` 的 localStorage 里
 */
export function setToken(data: SessionTokenPayload) {
  memoryAccessToken = data.accessToken;
  const { isRemembered, loginDay } = useUserStoreHook();
  const expiresSource = data.expires !== undefined && data.expires !== null ? data.expires : Date.now() + 8 * 3600000;
  const expires = toExpiresTimestamp(expiresSource);

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
  memoryAccessToken = '';
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};

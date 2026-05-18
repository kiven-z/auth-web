import { refreshTokenApi, type UserLoginResponse } from '@/api/auth';
import { multipleTabsKey, userKey } from '@/config/auth-config';
import { getAccessTokenStore } from '@/infrastructure/session/accessTokenReadWriter';
import { useUserStoreHook } from '@/store/modules/user';
import { storageLocal } from '@pureadmin/utils';
import Cookies from 'js-cookie';

export interface DataInfo<T> {
  // token
  accessToken?: string;
  // `accessToken`的过期时间（时间戳）
  expires?: T;
  // 用户 ID（与后端 Long 字符串化一致）
  userId?: string;
  // 头像
  avatar?: string;
  // 用户名
  username?: string;
  // 昵称
  nickname?: string;
  // 当前登录用户的角色
  roles?: Array<string>;
  // 当前登录用户的按钮级别权限
  permissions?: Array<string>;
}

/**
 * 将后端返回的过期时间转为毫秒时间戳（兼容 yyyy/MM/dd HH:mm:ss）。
 */
function toExpiresTimestamp(expires: string | number | Date | undefined): number {
  if (expires === undefined || expires === null) return 0;
  if (typeof expires === 'number') return expires;
  if (expires instanceof Date) return expires.getTime();
  const normalized = String(expires).replace(/\//g, '-');
  const t = new Date(normalized).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/**
 * 写入会话所需的字段（登录或刷新后）；SSO 等场景可缺省 expires，由默认值补齐
 */
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
 * 将登录响应映射为 {@link setToken} 所需载荷（后端 `id` → 会话 `userId`）。
 */
export function mapLoginResponseToSession(res: UserLoginResponse): SessionTokenPayload {
  return {
    accessToken: res.accessToken,
    expires: res.expires,
    avatar: res.avatar,
    username: res.username,
    nickname: res.nickname ?? '',
    roles: res.roles ?? [],
    permissions: res.permissions ?? [],
    userId: res.id,
  };
}

/**
 * 执行登录请求并建立本地会话（供各登录表单复用）。
 */
export async function establishSessionFromLogin(
  fetchLogin: () => Promise<UserLoginResponse>
): Promise<UserLoginResponse> {
  const body = await fetchLogin();
  setToken(mapLoginResponseToSession(body));
  return body;
}

/**
 * 刷新 accessToken；成功时合并写入会话（仅 Token 字段时保留本地用户信息）。
 */
export async function refreshAccessToken() {
  const body = await refreshTokenApi();
  setToken({
    accessToken: body.accessToken,
    expires: body.expires,
  });
  return body;
}

/**
 * 从 localStorage 读取已缓存的用户展示信息（单一读取入口，供 Pinia 初始化等使用）。
 */
export function readUserProfileFromStorage(): Partial<DataInfo<number>> {
  const raw = storageLocal().getItem<DataInfo<number>>(userKey);
  return raw ?? {};
}

/**
 * 获取 token
 * @returns token
 */
export function getToken(): DataInfo<number> {
  const profile = storageLocal().getItem<DataInfo<number>>(userKey);
  const accessToken = getAccessTokenStore().get();
  return {
    ...(profile ?? {}),
    accessToken,
  };
}

/**
 * 是否存在可用 accessToken（开发环境由 DevLocalStorageAccessTokenStore 提供持久化）
 * @returns 是否存在可用 accessToken
 */
export function hasAccessToken(): boolean {
  return getAccessTokenStore().has();
}

/**
 * 设置 token 以及一些必要信息并采用无感刷新 token 方案
 * 无感刷新：后端返回 accessToken（访问接口使用的 token）与 expires（accessToken 过期时间）
 * accessToken 的存放介质由 `getAccessTokenStore()` 按环境决定（生产内存 / 开发 localStorage）。
 * 用户资料与过期时间保存在 key 为 userKey 的 localStorage 里
 */
export function setToken(data: SessionTokenPayload) {
  const { isRemembered, loginDay } = useUserStoreHook();
  const expiresSource = data.expires !== undefined && data.expires !== null ? data.expires : Date.now() + 8 * 3600000;
  const expires = toExpiresTimestamp(expiresSource);

  getAccessTokenStore().set({
    accessToken: data.accessToken,
    expires,
  });

  // 设置多标签页标志
  Cookies.set(multipleTabsKey, 'true', isRemembered ? { expires: loginDay } : {});

  /**
   * 设置用户键
   * @param payload 用户键
   */
  function setUserKey(payload: {
    avatar: string;
    username: string;
    nickname: string;
    roles: Array<string>;
    permissions: Array<string>;
    userId?: string;
  }) {
    // 设置头像
    useUserStoreHook().SET_AVATAR(payload.avatar);
    // 设置用户名
    useUserStoreHook().SET_USERNAME(payload.username);
    // 设置昵称
    useUserStoreHook().SET_NICKNAME(payload.nickname);
    // 设置角色
    useUserStoreHook().SET_ROLES(payload.roles);
    // 设置权限
    useUserStoreHook().SET_PERMS(payload.permissions);
    // 设置用户 ID
    if (payload.userId !== undefined) {
      useUserStoreHook().SET_USER_ID(payload.userId);
    }
    // 设置用户键
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
  // 如果用户名和角色存在，则设置用户键
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
    // 获取之前用户键
    const prev = storageLocal().getItem<DataInfo<number>>(userKey);
    // 设置用户键
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

/**
 * 删除`token`以及key值为`user-info`的localStorage信息
 */
export function removeToken() {
  getAccessTokenStore().clear();
  // 删除多标签页标志
  Cookies.remove(multipleTabsKey);
  // 删除用户键
  storageLocal().removeItem(userKey);
}

/**
 * 格式化token（jwt格式）
 * @param token token
 * @returns 格式化后的token
 */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};

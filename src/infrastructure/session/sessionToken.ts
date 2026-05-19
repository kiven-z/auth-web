import { multipleTabsKey } from '@/config/auth-config';
import { getAccessTokenStore } from '@/infrastructure/session/accessTokenReadWriter';
import Cookies from 'js-cookie';
import { clearSessionPreferences, readSessionPreferences } from './sessionPreferences';
import { resolveSessionExpires } from './sessionTime';
import type { DataInfo, SessionTokenPayload, UserProfileSnapshot } from './types';
import {
  clearUserProfileFromStorage,
  readStoredUserProfileEntry,
  readUserProfileFromStorage,
  writeUserProfileToStorage,
} from './userProfileStorage';
import { syncUserProfileToStore } from './userProfileSync';

/**
 * 是否存在可用 accessToken（开发环境由 DevLocalStorageAccessTokenStore 提供持久化）
 * @returns 是否存在可用 accessToken
 */
export function hasAccessToken(): boolean {
  return getAccessTokenStore().has();
}

/**
 * 获取 token
 * @returns 用户信息
 */
export function getToken(): DataInfo<number> {
  const profile = readUserProfileFromStorage();
  const accessToken = getAccessTokenStore().get();
  return {
    ...profile,
    accessToken,
  };
}

/**
 * 设置 token 以及一些必要信息并采用无感刷新 token 方案
 * 无感刷新：后端返回 accessToken（访问接口使用的 token）与 expires（accessToken 过期时间）
 * accessToken 的存放介质由 `getAccessTokenStore()` 按环境决定（生产内存 / 开发 localStorage）。
 * 用户资料与过期时间保存在 key 为 userKey 的 localStorage 里
 * @param data 会话所需载荷
 */
export function setToken(data: SessionTokenPayload): void {
  const { isRemembered, loginDay } = readSessionPreferences();
  const expires = resolveSessionExpires(data.expires);

  getAccessTokenStore().set({
    accessToken: data.accessToken,
    expires,
  });

  setMultipleTabsCookie(isRemembered, loginDay);

  const profile = resolveProfileForSetToken(data);
  syncUserProfileToStore(profile);
  writeUserProfileToStorage(profile, expires);
}

/**
 * 删除`token`以及key值为`user-info`的localStorage信息
 */
export function removeToken(): void {
  getAccessTokenStore().clear();
  Cookies.remove(multipleTabsKey);
  clearUserProfileFromStorage();
  clearSessionPreferences();
}

/**
 * 设置多标签页 Cookie 标志。
 * @param isRemembered 是否记住登录
 * @param loginDay 记住登录天数
 */
function setMultipleTabsCookie(isRemembered: boolean, loginDay: number): void {
  Cookies.set(multipleTabsKey, 'true', isRemembered ? { expires: loginDay } : {});
}

/**
 * 根据 setToken 载荷解析待写入的用户资料（完整登录用 data，仅刷新 token 时合并历史资料）。
 * @param data 会话所需载荷
 * @returns 用户资料快照
 */
function resolveProfileForSetToken(data: SessionTokenPayload): UserProfileSnapshot {
  if (data.username && data.roles) {
    return {
      avatar: data.avatar ?? '',
      username: data.username,
      nickname: data.nickname ?? '',
      roles: data.roles,
      permissions: data.permissions ?? [],
      userId: data.userId,
    };
  }
  const previous = readStoredUserProfileEntry();
  return {
    avatar: previous?.avatar ?? '',
    username: previous?.username ?? '',
    nickname: previous?.nickname ?? '',
    roles: previous?.roles ?? [],
    permissions: previous?.permissions ?? [],
    userId: previous?.userId,
  };
}

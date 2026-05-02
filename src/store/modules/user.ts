import { defineStore } from 'pinia';
import { resetRouter, router, routerArrays, store, type userType } from '../utils';
import { loginByUsernameApi, logoutApi, refreshTokenApi, type UserLoginResponse } from '@/api/user';
import { useMultiTagsStoreHook } from './multiTags';
import { readUserProfileFromStorage, removeToken, setToken } from '@/utils/auth';

export const useUserStore = defineStore('pure-user', {
  state: (): userType => {
    const u = readUserProfileFromStorage();
    return {
      avatar: u.avatar ?? '',
      username: u.username ?? '',
      nickname: u.nickname ?? '',
      userId: u.userId ?? '',
      roles: u.roles ?? [],
      permissions: u.permissions ?? [],
      isRemembered: false,
      loginDay: 7,
    };
  },
  actions: {
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    SET_USER_ID(userId: string) {
      this.userId = userId;
    },
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /**
     * 用户名密码登录；成功时写入会话（Result 已由 HTTP 拦截器解包为 UserLoginResponse）。
     */
    async loginByUsername(data: { username: string; password: string }) {
      const body = await loginByUsernameApi(data);
      setToken(this.mapLoginResponseToSession(body));
      return body;
    },
    mapLoginResponseToSession(res: UserLoginResponse) {
      return {
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expires: res.expires,
        avatar: res.avatar,
        username: res.username,
        nickname: res.nickname ?? '',
        roles: res.roles ?? [],
        permissions: res.permissions ?? [],
        userId: res.id != null ? String(res.id) : undefined,
      };
    },
    /**
     * 调用退出接口后清理本地并跳转登录。
     */
    async logoutAndClear() {
      await logoutApi().catch(() => {
        /* 无效 Token 时后端仍返回成功；网络错误也允许继续清理本地 */
      });
      this.username = '';
      this.userId = '';
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login');
    },
    /** 兼容旧调用名：仅本地清理（不请求后端） */
    logOut() {
      this.username = '';
      this.userId = '';
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login');
    },
    /**
     * 刷新 accessToken；成功写入会话（仅 Token 字段时合并本地用户信息）。
     */
    async handRefreshToken(data: { refreshToken: string }) {
      const body = await refreshTokenApi(data);
      setToken({
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        expires: body.expires,
      });
      return body;
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}

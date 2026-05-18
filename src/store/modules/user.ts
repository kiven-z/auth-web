import { logoutApi } from '@/api/auth';
import { readUserProfileFromStorage, removeToken } from '@/infrastructure/session';
import { routerArrays } from '@/layout/types';
import { resetRouter, router } from '@/router';
import { store } from '@/store';
import { defineStore } from 'pinia';
import type { userType } from '../types';
import { useMultiTagsStoreHook } from './multiTags';

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

    /**
     * 清理本地用户态、Token、标签与动态路由，并跳转登录页。
     */
    async clearLocalSession() {
      this.avatar = '';
      this.username = '';
      this.nickname = '';
      this.userId = '';
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      await router.push('/login');
    },

    /**
     * 调用退出接口后清理本地并跳转登录。
     */
    async logoutAndClear() {
      await logoutApi().catch(() => {
        // 无效 Token 时后端仍返回成功；网络错误也允许继续清理本地
      });
      await this.clearLocalSession();
    },

    /**
     * 仅本地清理（不请求后端），用于 Token 失效等场景
     */
    async logOut() {
      await this.clearLocalSession();
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}

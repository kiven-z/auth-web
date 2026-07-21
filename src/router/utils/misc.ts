import type { menuType } from '@/layout/types';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useTimeoutFn } from '@vueuse/core';
import { createWebHashHistory, createWebHistory, type RouterHistory } from 'vue-router';
import { router } from '../index';

/**
 * 动态路由注册完成后，再添加全屏404（页面不存在）页面，避免刷新动态路由页面时误跳转到404页面
 */
function addPathMatch() {
  if (!router.hasRoute('pathMatch')) {
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'PageNotFound',
      component: () => import('@/views/home/error/404.vue'),
      meta: {
        title: 'menus.purePageNotFound',
        showLink: false,
      },
    });
  }
}

/**
 * 处理缓存路由（添加、删除、刷新）
 * @param name 路由名称
 * @param mode 模式
 */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case 'add':
      usePermissionStore().cacheOperate({
        mode: 'add',
        name,
      });
      break;
    case 'delete':
      usePermissionStore().cacheOperate({
        mode: 'delete',
        name,
      });
      break;
    case 'refresh':
      usePermissionStore().cacheOperate({
        mode: 'refresh',
        name,
      });
      break;
    default:
      usePermissionStore().cacheOperate({
        mode: 'delete',
        name,
      });
      useTimeoutFn(() => {
        usePermissionStore().cacheOperate({
          mode: 'add',
          name,
        });
      }, 100);
  }
}

/**
 * 处理顶部菜单
 * @param route 路由
 * @returns 顶部菜单
 */
function handleTopMenu(route) {
  if (route?.children && route.children.length > 1) {
    if (route.redirect) {
      return route.children.filter((cur) => cur.path === route.redirect)[0];
    } else {
      return route.children[0];
    }
  } else {
    return route;
  }
}

/**
 * 获取所有菜单中的第一个菜单（顶级菜单）
 * @param tag 是否添加到标签页
 * @returns 顶级菜单
 */
function getTopMenu(tag = false): menuType | undefined {
  const wholeMenus = usePermissionStore().wholeMenus;
  if (!wholeMenus?.length) return undefined;
  const topMenu = handleTopMenu(wholeMenus[0]?.children[0]);
  if (!topMenu) return undefined;
  tag && useMultiTagsStore().handleTags('push', topMenu);
  return topMenu;
}

/**
 * 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html
 * @param routerHistory 路由历史模式
 * @returns 路由历史模式
 */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(',');
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === 'hash') {
      return createWebHashHistory('');
    } else if (leftMode === 'h5') {
      return createWebHistory('');
    }
  } // has param
  else if (historyMode.length === 2) {
    if (leftMode === 'hash') {
      return createWebHashHistory(rightMode);
    } else if (leftMode === 'h5') {
      return createWebHistory(rightMode);
    }
  }
}

export { addPathMatch, getHistoryMode, getTopMenu, handleAliveRoute, handleTopMenu };

import { type DataInfo, removeToken } from '@/infrastructure/session';
import { isOneOfArray } from '@/router/utils/auth';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { findRouteByPath } from '@/router/utils/route-tree';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { usePermissionStoreHook } from '@/store/modules/permission';
import { isAllEmpty, isUrl, openLink, storageLocal } from '@pureadmin/utils';
import Cookies from 'js-cookie';
import type { Router } from 'vue-router';
import { multipleTabsKey, userKey } from '@/config/auth-config';

/** 路由白名单 */
const whiteList = ['/login'];

const { VITE_HIDE_HOME } = import.meta.env;

/**
 * 登录态与权限守卫：校验登录状态、角色鉴权、刷新时动态路由初始化。
 */
export function createAuthGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    const externalLink = isUrl(to?.name as string);

    /** 已登录时阻止重复跳转白名单页面 */
    function toCorrectRoute() {
      whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
    }

    if (Cookies.get(multipleTabsKey) && userInfo) {
      // 无权限跳转403页面
      if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
        next({ path: '/error/403' });
        return;
      }

      // 开启隐藏首页后手动输入 welcome 跳转 404
      if (VITE_HIDE_HOME === 'true' && to.fullPath === '/welcome') {
        next({ path: '/error/404' });
        return;
      }

      if (_from?.name) {
        if (externalLink) {
          openLink(to?.name as string);
          return;
        }
        toCorrectRoute();
      } else {
        // 刷新时动态路由初始化
        if (usePermissionStoreHook().wholeMenus.length === 0 && to.path !== '/login') {
          initRouter().then(async (routerInstance: Router) => {
            if (!useMultiTagsStoreHook().getMultiTagsCache) {
              const { path } = to;
              const route = findRouteByPath(path, routerInstance.options.routes[0].children);
              getTopMenu(true);

              if (route && route.meta?.title) {
                if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                  const { path, name, meta } = route.children[0];
                  useMultiTagsStoreHook().handleTags('push', { path, name, meta });
                } else {
                  const { path, name, meta } = route;
                  useMultiTagsStoreHook().handleTags('push', { path, name, meta });
                }
              }
            }

            if (isAllEmpty(to.name)) await routerInstance.push(to.fullPath);
          });
        }
        toCorrectRoute();
      }
    } else {
      if (to.path !== '/login') {
        if (whiteList.indexOf(to.path) !== -1) {
          next();
        } else {
          removeToken();
          next({ path: '/login' });
        }
      } else {
        next();
      }
    }
  });
}

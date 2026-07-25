import { ApiConflictError } from '@/core/http/apiError';
import { ensureAuthenticatedSession } from '@/core/session/sessionBootstrap';
import { isLoggedIn } from '@/core/session/sessionAuth';
import { removeToken } from '@/core/session/sessionToken';
import { readUserProfileFromStorage } from '@/core/session/userProfileStorage';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { findRouteByPath } from '@/router/utils/route-tree';
import { isOneOfArray } from '@/auth/permission';
import { errorMessage } from '@/services/feedback/message';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { isUrl, openLink } from '@pureadmin/utils';
import isEmpty from 'lodash/isEmpty';
import type { Router } from 'vue-router';

/** 路由白名单 */
const whiteList = ['/login'];

const { VITE_HIDE_HOME } = import.meta.env;

/**
 * 登录态与权限守卫：校验登录状态、角色鉴权、刷新时动态路由初始化
 * accessToken 恢复与偏好/资料 hydrate 由 {@link ensureAuthenticatedSession} 统一处理
 * @param router 路由
 */
export function createAuthGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    const userInfo = readUserProfileFromStorage();
    const externalLink = isUrl(to?.name as string);

    /**
     * 已登录时阻止重复跳转白名单页面
     */
    function toCorrectRoute() {
      whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
    }

    if (isLoggedIn()) {
      if (to.path !== '/login') {
        const ready = await ensureAuthenticatedSession();
        if (!ready) {
          removeToken();
          next({ path: '/login' });
          return;
        }
      }

      // publicAccess 菜单对所有登录用户放行；空 roles 仍走 isOneOfArray（不可见/不可进）
      if (to.meta?.publicAccess !== true && to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
        next({ path: '/error/403' });
        return;
      }

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
        if (usePermissionStore().wholeMenus.length === 0 && to.path !== '/login') {
          initRouter()
            .then(async (routerInstance: Router) => {
              if (!useMultiTagsStore().getMultiTagsCache) {
                pushInitialTagFromRoute(to.path, routerInstance);
              }

              if (isEmpty(to.name)) await routerInstance.push(to.fullPath);
            })
            .catch((error: unknown) => {
              if (error instanceof ApiConflictError) {
                return;
              }
              errorMessage(error);
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

/**
 * 冷启动时按目标 path 写入首个标签；路由树未就绪时早退，避免 children[0] 空引用
 * @param path 目标路径
 * @param routerInstance 初始化后的路由实例
 */
function pushInitialTagFromRoute(path: string, routerInstance: Router): void {
  const rootChildren = routerInstance.options.routes[0]?.children;
  if (!rootChildren?.length) {
    getTopMenu(true);
    return;
  }

  const route = findRouteByPath(path, rootChildren);
  getTopMenu(true);

  if (!route?.meta?.title) {
    return;
  }

  const tagRoute = isEmpty(route.parentId) && route.meta?.backstage ? route.children?.[0] : route;
  if (!tagRoute) {
    return;
  }

  const { path: tagPath, name, meta } = tagRoute;
  useMultiTagsStore().handleTags('push', { path: tagPath, name, meta });
}

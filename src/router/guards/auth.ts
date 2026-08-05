import { hasAuth, isOneOfArray } from '@/auth/permission';
import { ApiConflictError } from '@/core/http/apiError';
import { isLoggedIn } from '@/core/session/sessionAuth';
import { ensureAuthenticatedSession } from '@/core/session/sessionBootstrap';
import { removeToken } from '@/core/session/token/sessionToken';
import { readUserProfileFromStorage } from '@/core/session/profile/userProfileStorage';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { findRouteByPath } from '@/router/utils/route-tree';
import { errorMessage } from '@/services/feedback/message';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { isUrl, openLink } from '@/shared/utils/url/url';
import isEmpty from 'lodash/isEmpty';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';

/** 未登录可访问路径 */
const whiteList = ['/login'];

const { VITE_HIDE_HOME } = import.meta.env;

/**
 * 登录态与权限守卫：校验登录、会话就绪、角色鉴权、权限码、冷启动动态路由
 * @param router 路由
 */
export function createAuthGuard(router: Router): void {
  router.beforeEach(async (to, from, next) => {
    if (!isLoggedIn()) {
      passGuest(to, next);
      return;
    }

    if (to.path !== '/login') {
      const ready = await ensureAuthenticatedSession();
      if (!ready) {
        removeToken();
        next({ path: '/login' });
        return;
      }
    }

    if (isBlockedByRoles(to) || isBlockedByAuths(to)) {
      next({ path: '/error/403' });
      return;
    }

    if (VITE_HIDE_HOME === 'true' && to.fullPath === '/welcome') {
      next({ path: '/error/404' });
      return;
    }

    if (from?.name) {
      if (isUrl(to?.name as string)) {
        openLink(to.name as string);
        return;
      }
      passAuthenticated(to, from, next);
      return;
    }

    if (needsDynamicRouteInit(to)) {
      const ok = await initDynamicRoutesForColdStart(to);
      if (!ok) {
        next(false);
        return;
      }
      next({ path: to.fullPath, query: to.query, hash: to.hash, replace: true });
      return;
    }

    passAuthenticated(to, from, next);
  });
}

/**
 * 未登录：白名单放行，否则清会话去登录
 */
function passGuest(to: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.path === '/login' || whiteList.includes(to.path)) {
    next();
    return;
  }
  removeToken();
  next({ path: '/login' });
}

/**
 * 已登录：禁止再进白名单页，否则放行
 */
function passAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (whiteList.includes(to.fullPath)) {
    next(from.fullPath);
    return;
  }
  next();
}

/**
 * 目标路由是否因角色不足被拦截（publicAccess 对所有登录用户放行）
 */
function isBlockedByRoles(to: RouteLocationNormalized): boolean {
  if (to.meta?.publicAccess === true || !to.meta?.roles) {
    return false;
  }
  const userInfo = readUserProfileFromStorage();
  return !isOneOfArray(to.meta.roles, userInfo?.roles);
}

/**
 * 目标路由是否因权限码不足被拦截（meta.auths 未配置则不校验）
 */
function isBlockedByAuths(to: RouteLocationNormalized): boolean {
  const auths = to.meta?.auths;
  if (auths == null || (Array.isArray(auths) && auths.length === 0)) {
    return false;
  }
  return !hasAuth(auths);
}

/**
 * 冷启动且菜单尚未组装时需要拉取并注册动态路由
 */
function needsDynamicRouteInit(to: RouteLocationNormalized): boolean {
  const permissionStore = usePermissionStore();
  return permissionStore.wholeMenus.length === 0 && to.path !== '/login';
}

/**
 * 冷启动初始化动态路由与首个标签；冲突类错误返回 false 以中止导航
 * @param to 目标路由
 * @returns 是否成功完成初始化
 */
async function initDynamicRoutesForColdStart(to: RouteLocationNormalized): Promise<boolean> {
  try {
    const routerInstance = (await initRouter()) as Router;
    if (!useMultiTagsStore().getMultiTagsCache) {
      pushInitialTagFromRoute(to.path, routerInstance);
    }
    return true;
  } catch (error: unknown) {
    if (error instanceof ApiConflictError) {
      return false;
    }
    errorMessage(error);
    return false;
  }
}

/**
 * 冷启动时按目标 path 写入首个标签；路由树未就绪时早退
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

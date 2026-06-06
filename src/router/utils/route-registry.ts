import { getConfig } from '@/config';
import { loadAsyncRoutes } from './async-routes-loader';
import { routerArrays } from '@/layout/types';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { usePermissionStoreHook } from '@/store/modules/permission';
import { cloneDeep, storageLocal } from '@pureadmin/utils';
import type { RouteRecordRaw } from 'vue-router';
import { router } from '../index';
import { addAsyncRoutes } from './async-routes';
import { ascending } from './menu-sort';
import { addPathMatch } from './misc';
import { formatFlatteningRoutes } from './route-tree';
import { ASYNC_ROUTES_STORAGE_KEY } from '@/config/http-config';

/**
 * 处理动态路由（后端返回的路由）
 * @param routeList 路由列表
 */
function handleAsyncRoutes(routeList) {
  if (routeList.length === 0) {
    usePermissionStoreHook().handleWholeMenus(routeList);
  } else {
    const formattedRoutes = formatFlatteningRoutes(addAsyncRoutes(routeList));
    // 将所有动态路由逐个注册到根路由中
    formattedRoutes.forEach((v: RouteRecordRaw) => {
      // 防止重复添加路由
      if (router.options.routes[0].children.findIndex((value) => value.path === v.path) !== -1) {
        return;
      }
      // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
      router.options.routes[0].children.push(v);
      if (!router.hasRoute(v?.name)) router.addRoute(v);
    });
    // 所有路由添加完成后统一排序
    ascending(router.options.routes[0].children);
    // 同步路由表：保持 router.options.routes[0].children 与 path="/" 的 children 一致
    const flattenRouters = router.getRoutes().find((n) => n.path === '/');
    if (flattenRouters) {
      flattenRouters.children = router.options.routes[0].children;
      router.addRoute(flattenRouters);
    }
    usePermissionStoreHook().handleWholeMenus(routeList);
  }
  if (!useMultiTagsStoreHook().getMultiTagsCache) {
    useMultiTagsStoreHook().handleTags('equal', [
      ...routerArrays,
      ...usePermissionStoreHook().flatteningRoutes.filter((v) => v?.meta?.fixedTag),
    ]);
  }
  addPathMatch();
}

/**
 * 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）
 * @returns 路由
 */
function initRouter() {
  if (getConfig()?.CachingAsyncRoutes) {
    // 开启动态路由缓存本地localStorage
    const asyncRouteList = storageLocal().getItem(ASYNC_ROUTES_STORAGE_KEY) as Array<unknown> | null;
    if (asyncRouteList && asyncRouteList?.length > 0) {
      return new Promise((resolve) => {
        handleAsyncRoutes(asyncRouteList);
        resolve(router);
      });
    } else {
      return new Promise(async (resolve) => {
        const response = await loadAsyncRoutes();
        handleAsyncRoutes(cloneDeep(response));
        if (response.length > 0) {
          storageLocal().setItem(ASYNC_ROUTES_STORAGE_KEY, response);
        }
        resolve(router);
      });
    }
  } else {
    return new Promise(async (resolve) => {
      const response = await loadAsyncRoutes();
      handleAsyncRoutes(cloneDeep(response));
      resolve(router);
    });
  }
}

export { handleAsyncRoutes, initRouter };

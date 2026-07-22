import { buildHierarchyTree } from '@/shared/utils/tree';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { cloneDeep } from '@pureadmin/utils';
import { createRouter, type RouteComponent, type Router, type RouteRecordRaw } from 'vue-router';
import remainingRouter from './modules/remaining';
import { ascending } from './utils/menu-sort';
import { getHistoryMode } from './utils/misc';
import { formatFlatteningRoutes, formatTwoStageRoutes } from './utils/route-tree';

import { createAuthGuard } from './guards/auth';
import { createKeepAliveGuard } from './guards/keepalive';
import { createProgressGuard, resetLoadedPaths } from './guards/progress';
import { createTitleGuard } from './guards/title';

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(['./modules/**/*.ts', '!./modules/**/remaining.ts'], {
  eager: true,
});

// 原始静态路由（未做任何处理）
const routes = [];

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/**
 * 导出处理后的静态路由（三级及以上的路由全部拍成二级）
 * @returns 处理后的静态路由
 */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
);

// 初始的静态路由，用于退出登录时重置路由
const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(constantRoutes);

// 用于渲染菜单，保持原始层级
export const constantMenus: Array<RouteComponent> = ascending(routes.flat(Infinity)).concat(...remainingRouter);

/**
 * 不参与菜单的路由
 * @param v 路由
 * @returns 路由路径
 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v].path;
});

/**
 * 创建路由实例
 * @returns 路由实例
 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as Array<RouteRecordRaw>)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

// 注册所有路由守卫
createProgressGuard(router);
createTitleGuard(router);
createKeepAliveGuard(router);
createAuthGuard(router);

/**
 * 重置路由
 * @returns 路由实例
 */
export function resetRouter() {
  router.clearRoutes();
  for (const route of initConstantRoutes.concat(...(remainingRouter as Array<RouteRecordRaw>))) {
    router.addRoute(route);
  }
  router.options.routes = formatTwoStageRoutes(
    formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
  );
  usePermissionStore().clearAllCachePage();
  resetLoadedPaths();
}

export default router;

import { http } from '@/infrastructure/http-core';

/**
 * 获取异步路由
 * @returns 异步路由
 */
export const getAsyncRoutes = () => {
  return http.request<Array<Record<string, void>>>('get', '/system/menu/web-routes');
};

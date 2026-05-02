import { http } from '@/utils/http';

/**
 * 获取异步路由
 * @returns 异步路由数据
 */
export const getAsyncRoutes = () => {
  return http.request<Array<Record<string, unknown>>>('get', 'get-async-routes');
};

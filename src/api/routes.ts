import { http } from '@/utils/http';

/** 动态路由接口路径（与 system / 网关约定一致时仅改此常量） */
export const ASYNC_ROUTES_API_PATH = 'get-async-routes';

export const getAsyncRoutes = () => {
  return http.request<Array<Record<string, void>>>('get', ASYNC_ROUTES_API_PATH);
};

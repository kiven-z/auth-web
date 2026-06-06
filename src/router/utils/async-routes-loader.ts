import { getAsyncRoutes } from '@/api/system/routes';
import { transformI18n } from '@/plugins/i18n';
import { message } from '@/shared/messaging/message';
import Axios from 'axios';

/** 动态路由降级提示 i18n 键 */
export const ASYNC_ROUTES_DEGRADED_I18N_KEY = 'tips.asyncRoutesDegraded';

/**
 * 判断是否为业务层抛出的 API 错误（鉴权、权限冲突等不可降级）。
 * @param error 捕获的异常
 * @returns 是否为 API 业务错误
 */
function isApiBusinessLayerError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.name === 'ApiBusinessError' || error.name === 'ApiConflictError';
}

/**
 * 判断动态路由请求失败是否可降级为空菜单（网络故障或服务端不可用）。
 * @param error 捕获的异常
 * @returns 是否可降级
 */
export function isRecoverableAsyncRoutesError(error: unknown): boolean {
  if (isApiBusinessLayerError(error)) {
    return false;
  }
  const status = Axios.isAxiosError(error) ? error.response?.status : undefined;
  if (!status) {
    return true;
  }
  return status >= 500;
}

/**
 * 拉取后端动态路由；网络/5xx 失败时降级为空数组并提示用户。
 * @returns 动态路由列表
 */
export async function loadAsyncRoutes(): Promise<Array<unknown>> {
  try {
    const response = await getAsyncRoutes();
    return Array.isArray(response) ? response : [];
  } catch (error) {
    if (!isRecoverableAsyncRoutesError(error)) {
      throw error;
    }
    message(transformI18n(ASYNC_ROUTES_DEGRADED_I18N_KEY), {
      type: 'warning',
      duration: 4000,
      grouping: true,
    });
    return [];
  }
}

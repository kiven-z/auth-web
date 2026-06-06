import { getAsyncRoutes } from '@/api/system/routes';
import { ApiBusinessError, ApiConflictError } from '@/infrastructure/http-core';
import { transformI18n } from '@/plugins/i18n';
import { message } from '@/ui/feedback/message';
import Axios from 'axios';

/**
 * 网络故障或 5xx 时可降级为空菜单；业务/鉴权错误仍向上抛出。
 * @param error 捕获的异常
 */
function canDegradeToEmptyRoutes(error: unknown): boolean {
  if (error instanceof ApiBusinessError || error instanceof ApiConflictError) {
    return false;
  }
  const status = Axios.isAxiosError(error) ? error.response?.status : undefined;
  return !status || status >= 500;
}

/**
 * 拉取后端动态路由；网络/5xx 失败时降级为空数组并提示用户。
 * @returns 动态路由列表
 */
export async function fetchAsyncRoutes(): Promise<unknown[]> {
  try {
    const data = await getAsyncRoutes();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (!canDegradeToEmptyRoutes(error)) {
      throw error;
    }

    message(transformI18n('tips.asyncRoutesDegraded'), { type: 'warning', duration: 4000, grouping: true });
    return [];
  }
}

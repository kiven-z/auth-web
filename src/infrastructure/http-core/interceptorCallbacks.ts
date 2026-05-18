import type { AuthHttpRequestConfig, AuthHttpResponse } from './types.d';

/**
 * 执行单次请求的 beforeResponseCallback（若已配置）。
 * @param response 响应
 * @returns 是否已执行回调
 */
export function runBeforeResponseCallback(response: AuthHttpResponse): boolean {
  const callback = response.config.beforeResponseCallback;
  if (typeof callback !== 'function') {
    return false;
  }
  callback(response);
  return true;
}

/**
 * 执行单次请求的 beforeRequestCallback（若已配置）。
 * @param config 请求配置
 * @returns 是否已执行回调
 */
export function runBeforeRequestCallback(config: AuthHttpRequestConfig): boolean {
  if (typeof config.beforeRequestCallback !== 'function') {
    return false;
  }
  config.beforeRequestCallback(config);
  return true;
}

import type { AuthRecoveryRule } from '@/infrastructure/auth-flow/recovery/types';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

/**
 * 请求方法
 * @param method 方法
 * @returns 请求方法
 */
export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>;

/**
 * 鉴权 HTTP 错误
 * @param isCancelRequest 是否取消请求
 */
export interface AuthHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

/**
 * 鉴权 HTTP 响应
 * @param config 请求配置
 */
export interface AuthHttpResponse extends AxiosResponse {
  config: AuthHttpRequestConfig;
}

/**
 * 鉴权 HTTP 请求配置
 * @param beforeRequestCallback 请求前回调
 * @param beforeResponseCallback 响应前回调
 * @param _authRecoveryRetryCount 鉴权恢复已重放次数，防止刷新重放死循环
 * @param authRecoveryRules 覆盖默认鉴权恢复规则（可选）
 */
export interface AuthHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: AuthHttpRequestConfig) => void;
  beforeResponseCallback?: (response: AuthHttpResponse) => void;
  // 鉴权恢复已重放次数，防止刷新重放死循环
  _authRecoveryRetryCount?: number;
  // 覆盖默认鉴权恢复规则（可选）
  authRecoveryRules?: readonly AuthRecoveryRule[];
}

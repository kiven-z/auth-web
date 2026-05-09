import type { AuthRecoveryRule } from '@/infrastructure/auth-flow/recovery';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>;

export interface AuthHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface AuthHttpResponse extends AxiosResponse {
  config: AuthHttpRequestConfig;
}

export interface AuthHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: AuthHttpRequestConfig) => void;
  beforeResponseCallback?: (response: AuthHttpResponse) => void;
  /** 鉴权恢复已重放次数，防止刷新重放死循环 */
  _authRecoveryRetryCount?: number;
  /** 覆盖默认鉴权恢复规则（可选） */
  authRecoveryRules?: readonly AuthRecoveryRule[];
}

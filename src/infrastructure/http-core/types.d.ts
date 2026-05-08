import type { AuthRecoveryRule } from '@/infrastructure/auth-flow/recovery';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export type resultType = {
  accessToken?: string;
};

export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
  /** 鉴权恢复已重放次数，防止刷新重放死循环 */
  _authRecoveryRetryCount?: number;
  /** 覆盖默认鉴权恢复规则（可选） */
  authRecoveryRules?: readonly AuthRecoveryRule[];
}

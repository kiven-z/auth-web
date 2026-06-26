import { runSessionLogout } from '@/auth/config/auth/auth-session-effects';
import { API_SUCCESS_CODE, isNoAuthRequestPath } from '@/auth/config/http-config';
import { executeAuthRecovery } from '@/core/auth/recovery';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { isApiResultEnvelope } from '../apiResult';
import { rejectWithApiEnvelopeError } from '../errorAdapter';
import type { AuthHttpError, AuthHttpRequestConfig } from '../types';

/**
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
 * @param instance 实例
 */
export function attachResponseInterceptors(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => handleResponseSuccess(response),
    (error: AuthHttpError) => handleResponseError(instance, error) as unknown
  );
}

/**
 * 处理成功响应
 * @param response 响应
 * @returns 结果
 */
function handleResponseSuccess(response: AxiosResponse) {
  const config = response.config as AuthHttpRequestConfig;
  const raw = response.data;

  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    return raw;
  }

  if (isApiResultEnvelope(raw)) {
    if (raw.code !== API_SUCCESS_CODE) {
      return rejectWithApiEnvelopeError(raw, response.status);
    }
    return raw.data as unknown;
  }

  return raw;
}

/**
 * 处理错误响应
 * @param instance 实例
 * @param error 错误
 * @returns 结果
 */
async function handleResponseError(instance: AxiosInstance, error: AuthHttpError): Promise<unknown> {
  error.isCancelRequest = Axios.isCancel(error);
  const { response, config } = error;

  const status = response?.status;
  const requestConfig = config as AuthHttpRequestConfig | undefined;
  const isNoAuthPath = requestConfig ? isNoAuthRequestPath(requestConfig.url) : false;
  const envelope = response?.data && isApiResultEnvelope(response.data) ? response.data : undefined;
  const authEnvelopeErrorCode = envelope?.error ?? envelope?.subCode;

  const authRecoveryResult = await executeAuthRecovery({
    instance,
    requestConfig,
    context: {
      status,
      errorCode: authEnvelopeErrorCode,
      requestUrl: requestConfig?.url,
      isNoAuthPath,
      retryCount: requestConfig?._authRecoveryRetryCount ?? 0,
    },
  });

  if (authRecoveryResult.handled && authRecoveryResult.replayResult !== undefined) {
    return authRecoveryResult.replayResult;
  }
  if (authRecoveryResult.shouldLogout) {
    await runSessionLogout();
    throw authRecoveryResult.replayError ?? error;
  }
  if (envelope) {
    await rejectWithApiEnvelopeError(envelope, status ?? 0);
  }
  throw error;
}

import { API_SUCCESS_CODE, isNoAuthRequestPath } from '@/config/http-config';
import { executeAuthRecovery } from '@/infrastructure/auth-flow/recovery';
import { useUserStoreHook } from '@/store/modules/user';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { isApiResultEnvelope, type ApiResult } from '../apiResult';
import { rejectWithApiEnvelopeError } from '../errorAdapter';
import { runBeforeResponseCallback } from '../interceptorCallbacks';
import type { AuthHttpError, AuthHttpRequestConfig, AuthHttpResponse } from '../types.d';

/**
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
 * @param instance 实例
 */
export function attachResponseInterceptors(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => handleResponseSuccess(response) as unknown,
    (error: AuthHttpError) => handleResponseError(instance, error) as unknown
  );
}

/**
 * 处理成功响应
 * @param response 响应
 * @returns 结果
 */
function handleResponseSuccess(response: AxiosResponse): unknown {
  const config = response.config as AuthHttpRequestConfig;
  const pureResponse = response as AuthHttpResponse;
  const raw = response.data;

  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    runBeforeResponseCallback(pureResponse);
    return raw;
  }

  if (isApiResultEnvelope(raw)) {
    if (raw.code !== API_SUCCESS_CODE) {
      return rejectWithApiEnvelopeError(raw, response.status);
    }
    return unwrapEnvelopePayload(pureResponse, raw);
  }

  return passthroughRawBody(pureResponse);
}

/**
 * 解包 Result 信封并返回 data 载荷
 * @param response 响应
 * @param envelope 信封
 * @returns data 载荷
 */
function unwrapEnvelopePayload(response: AuthHttpResponse, envelope: ApiResult): unknown {
  const payload = envelope.data as unknown;
  const synthetic = {
    ...response,
    data: envelope,
  } as AuthHttpResponse;
  if (runBeforeResponseCallback(synthetic)) {
    return payload;
  }
  return payload;
}

/**
 * 透传非信封响应体
 * @param response 响应
 * @returns 响应体
 */
function passthroughRawBody(response: AuthHttpResponse): unknown {
  runBeforeResponseCallback(response);
  return response.data;
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
    rules: requestConfig?.authRecoveryRules,
  });

  if (authRecoveryResult.handled && authRecoveryResult.replayResult !== undefined) {
    return authRecoveryResult.replayResult;
  }
  if (authRecoveryResult.shouldLogout) {
    useUserStoreHook().logOut();
    throw authRecoveryResult.replayError ?? error;
  }
  if (envelope) {
    await rejectWithApiEnvelopeError(envelope, status ?? 0);
  }
  throw error;
}

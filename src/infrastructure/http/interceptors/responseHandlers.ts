import { API_SUCCESS_CODE, isNoAuthRequestPath } from '@/config/http-config';
import { executeAuthRecovery } from '@/infrastructure/auth-recovery';
import { dispatchAuthRecoveryEffects } from '@/infrastructure/auth-recovery/effects';
import { useUserStoreHook } from '@/store/modules/user';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { isApiResultEnvelope, type ApiResult } from '../apiResult';
import { rejectWithApiEnvelopeError } from '../apiResultErrors';
import type { PureHttpError, PureHttpRequestConfig, PureHttpResponse } from '../types.d';

type InitConfigGetter = () => PureHttpRequestConfig;

/**
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
 */
export function attachResponseInterceptors(instance: AxiosInstance, getInitConfig: InitConfigGetter): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => handleResponseSuccess(response, getInitConfig) as any,
    (error: PureHttpError) => handleResponseError(instance, error) as any
  );
}

function handleResponseSuccess(response: AxiosResponse, getInitConfig: InitConfigGetter): unknown {
  const config = response.config as PureHttpRequestConfig;
  const pureResponse = response as PureHttpResponse;
  const raw = response.data;

  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    if (typeof config.beforeResponseCallback === 'function') {
      config.beforeResponseCallback(response);
    }
    return raw;
  }

  if (isApiResultEnvelope(raw)) {
    if (raw.code !== API_SUCCESS_CODE) {
      return rejectWithApiEnvelopeError(raw, response.status);
    }
    return unwrapEnvelopePayload(pureResponse, raw, getInitConfig);
  }

  return passthroughRawBody(pureResponse, getInitConfig);
}

function unwrapEnvelopePayload(
  response: PureHttpResponse,
  envelope: ApiResult,
  getInitConfig: InitConfigGetter
): unknown {
  const payload = envelope.data as unknown;
  const synthetic = {
    ...response,
    data: envelope,
  } as PureHttpResponse;
  const globalCfg = getInitConfig();
  if (typeof response.config.beforeResponseCallback === 'function') {
    response.config.beforeResponseCallback(synthetic);
    return payload;
  }
  if (globalCfg.beforeResponseCallback) {
    globalCfg.beforeResponseCallback(synthetic);
    return payload;
  }
  return payload;
}

function passthroughRawBody(response: PureHttpResponse, getInitConfig: InitConfigGetter): unknown {
  const globalCfg = getInitConfig();
  const config = response.config;
  if (typeof config.beforeResponseCallback === 'function') {
    config.beforeResponseCallback(response);
    return response.data;
  }
  if (globalCfg.beforeResponseCallback) {
    globalCfg.beforeResponseCallback(response);
    return response.data;
  }
  return response.data;
}

async function handleResponseError(instance: AxiosInstance, error: PureHttpError): Promise<unknown> {
  error.isCancelRequest = Axios.isCancel(error);
  const { response, config } = error;

  const status = response?.status;
  const requestConfig = config as PureHttpRequestConfig | undefined;
  const isNoAuthPath = requestConfig ? isNoAuthRequestPath(requestConfig.url) : false;
  const envelope = response?.data && isApiResultEnvelope(response.data) ? response.data : undefined;
  const authEnvelopeErrorCode = envelope?.error ?? envelope?.subCode;
  const authRecoveryContext = {
    status,
    errorCode: authEnvelopeErrorCode,
    requestUrl: requestConfig?.url,
    isNoAuthPath,
    retryCount: requestConfig?._authRecoveryRetryCount ?? 0,
  };
  const authRecoveryResult = await executeAuthRecovery({
    instance,
    requestConfig,
    context: authRecoveryContext,
  });
  dispatchAuthRecoveryEffects({
    context: authRecoveryContext,
    recoveryResult: authRecoveryResult,
    envelope,
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

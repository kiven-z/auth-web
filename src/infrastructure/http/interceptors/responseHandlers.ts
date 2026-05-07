import { isNoAuthRequestPath } from '@/config/http-config';
import { formatToken, getToken } from '@/infrastructure/session/auth';
import { useUserStoreHook } from '@/store/modules/user';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type ApiResult, isApiResultEnvelope } from '../apiResult';
import { rejectWithApiEnvelopeError } from '../apiResultErrors';
import type { PureHttpError, PureHttpRequestConfig, PureHttpResponse } from '../types.d';

type InitConfigGetter = () => PureHttpRequestConfig;

/**
 * 响应拦截：Result 解包、业务错误与 401 刷新重试。
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
    if (raw.code !== 200) {
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

function handleResponseError(instance: AxiosInstance, error: PureHttpError): Promise<unknown> {
  error.isCancelRequest = Axios.isCancel(error);
  const { response, config } = error;

  // HTTP 401 优先尝试 refreshToken，避免被业务信封检查抢先拦截
  if (
    response?.status === 401 &&
    config &&
    !(config as PureHttpRequestConfig)._retry401 &&
    !isNoAuthRequestPath(config.url)
  ) {
    const tokenData = getToken();
    if (tokenData?.refreshToken) {
      const cfg = config as PureHttpRequestConfig;
      cfg._retry401 = true;
      return useUserStoreHook()
        .handRefreshToken({ refreshToken: tokenData.refreshToken })
        .then(() => {
          const next = getToken();
          if (!next?.accessToken) {
            useUserStoreHook().logOut();
            return Promise.reject(error);
          }
          if (!cfg.headers) cfg.headers = {};
          cfg.headers['Authorization'] = formatToken(next.accessToken);
          return instance.request(cfg);
        })
        .catch(() => {
          useUserStoreHook().logOut();
          return Promise.reject(error);
        });
    }
  }

  if (response?.data && isApiResultEnvelope(response.data)) {
    return rejectWithApiEnvelopeError(response.data, response.status ?? 0);
  }

  return Promise.reject(error);
}

import { API_SUCCESS_CODE, isNoAuthRequestPath } from '@/config/http-config';
import { executeAuthRecovery } from '@/infrastructure/auth-flow/recovery';
import { useUserStoreHook } from '@/store/modules/user';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type ApiResult, isApiResultEnvelope } from '../apiResult';
import { rejectWithApiEnvelopeError } from '../errorAdapter';
import type { AuthHttpError, AuthHttpRequestConfig, AuthHttpResponse } from '../types.d';

type InitConfigGetter = () => AuthHttpRequestConfig;

/**
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
 * @param instance 实例
 * @param getInitConfig 获取初始配置
 */
export function attachResponseInterceptors(instance: AxiosInstance, getInitConfig: InitConfigGetter): void {
  // 响应拦截
  instance.interceptors.response.use(
    // 处理成功响应
    (response: AxiosResponse) => handleResponseSuccess(response, getInitConfig) as any,
    // 处理错误响应
    (error: AuthHttpError) => handleResponseError(instance, error, getInitConfig) as any
  );
}

/**
 * 处理成功响应
 * @param response 响应
 * @param getInitConfig 获取初始配置
 * @returns 结果
 */
function handleResponseSuccess(response: AxiosResponse, getInitConfig: InitConfigGetter): unknown {
  // 获取配置
  const config = response.config as AuthHttpRequestConfig;
  // 获取纯响应
  const pureResponse = response as AuthHttpResponse;
  // 获取原始数据
  const raw = response.data;

  // 如果响应类型是 blob 或 arraybuffer，则不处理
  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    // 如果配置了 beforeResponseCallback，则执行
    if (typeof config.beforeResponseCallback === 'function') {
      config.beforeResponseCallback(response);
    }
    return raw;
  }

  // 如果响应是 ApiResultEnvelope，则解包
  if (isApiResultEnvelope(raw)) {
    // 如果响应码不是成功码，则拒绝
    if (raw.code !== API_SUCCESS_CODE) {
      return rejectWithApiEnvelopeError(raw, response.status);
    }
    // 解包响应
    return unwrapEnvelopePayload(pureResponse, raw, getInitConfig);
  }

  // 透传原始响应
  return passthroughRawBody(pureResponse, getInitConfig);
}

/**
 * 解包响应
 * @param response 响应
 * @param envelope 响应
 * @param getInitConfig 获取初始配置
 * @returns 结果
 */
function unwrapEnvelopePayload(
  response: AuthHttpResponse,
  envelope: ApiResult,
  getInitConfig: InitConfigGetter
): unknown {
  // 获取响应数据
  const payload = envelope.data as unknown;
  // 创建合成响应
  const synthetic = {
    ...response,
    data: envelope,
  } as AuthHttpResponse;
  // 获取全局配置
  const globalCfg = getInitConfig();
  // 如果配置了 beforeResponseCallback，则执行
  if (typeof response.config.beforeResponseCallback === 'function') {
    response.config.beforeResponseCallback(synthetic);
    return payload;
  }
  // 如果全局 beforeResponseCallback 存在，则执行
  if (globalCfg.beforeResponseCallback) {
    globalCfg.beforeResponseCallback(synthetic);
    return payload;
  }
  // 返回响应数据
  return payload;
}

/**
 * 透传原始响应
 * @param response 响应
 * @param getInitConfig 获取初始配置
 * @returns 结果
 */
function passthroughRawBody(response: AuthHttpResponse, getInitConfig: InitConfigGetter): unknown {
  // 获取全局配置
  const globalCfg = getInitConfig();
  const config = response.config;
  // 如果配置了 beforeResponseCallback，则执行
  if (typeof config.beforeResponseCallback === 'function') {
    config.beforeResponseCallback(response);
    return response.data;
  }
  // 如果全局 beforeResponseCallback 存在，则执行
  if (globalCfg.beforeResponseCallback) {
    globalCfg.beforeResponseCallback(response);
    return response.data;
  }
  // 返回响应数据
  return response.data;
}

/**
 * 处理错误响应
 * @param instance 实例
 * @param error 错误
 * @param getInitConfig 获取初始配置
 * @returns 结果
 */
async function handleResponseError(
  instance: AxiosInstance,
  error: AuthHttpError,
  getInitConfig: InitConfigGetter
): Promise<unknown> {
  // 设置取消请求标志
  error.isCancelRequest = Axios.isCancel(error);
  // 获取响应和配置
  const { response, config } = error;

  // 获取响应状态
  const status = response?.status;
  // 获取请求配置
  const requestConfig = config as AuthHttpRequestConfig | undefined;
  // 获取是否无权限路径
  const isNoAuthPath = requestConfig ? isNoAuthRequestPath(requestConfig.url) : false;
  // 获取响应数据
  const envelope = response?.data && isApiResultEnvelope(response.data) ? response.data : undefined;
  // 获取响应错误码
  const authEnvelopeErrorCode = envelope?.error ?? envelope?.subCode;
  // 创建鉴权恢复上下文
  const authRecoveryContext = {
    status,
    errorCode: authEnvelopeErrorCode,
    // 获取请求 URL
    requestUrl: requestConfig?.url,
    isNoAuthPath,
    // 获取重试次数
    retryCount: requestConfig?._authRecoveryRetryCount ?? 0,
  };
  // 获取鉴权恢复规则
  const authRecoveryRules = requestConfig?.authRecoveryRules ?? getInitConfig().authRecoveryRules;
  // 执行鉴权恢复
  const authRecoveryResult = await executeAuthRecovery({
    instance,
    requestConfig,
    context: authRecoveryContext,
    rules: authRecoveryRules,
  });
  // 如果鉴权恢复成功，则返回重放结果
  if (authRecoveryResult.handled && authRecoveryResult.replayResult !== undefined) {
    return authRecoveryResult.replayResult;
  }
  // 如果需要登出，则登出
  if (authRecoveryResult.shouldLogout) {
    useUserStoreHook().logOut();
    // 抛出重放错误
    throw authRecoveryResult.replayError ?? error;
  }
  // 如果响应是 ApiResultEnvelope，则拒绝
  if (envelope) {
    // 拒绝响应
    await rejectWithApiEnvelopeError(envelope, status ?? 0);
  }
  throw error;
}

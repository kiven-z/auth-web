import { http } from '@/infrastructure/http-core';
import { AUTH_API_PATHS } from './paths';
import type { EmailLoginRequest, RefreshTokenResponse, UserLoginResponse, UsernamePasswordLoginRequest } from './types';

export { AUTH_API_PATHS, AUTH_PUBLIC_API_PATH_SUFFIXES } from './paths';
export type { EmailLoginRequest, RefreshTokenResponse, UserLoginResponse, UsernamePasswordLoginRequest } from './types';

/**
 * 用户名密码登录
 * @param data 用户名密码登录请求
 * @returns 用户登录响应
 */
export const loginByUsernameApi = (data: UsernamePasswordLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_USERNAME, { data });
};

/**
 * 邮箱登录
 * @param data 邮箱登录请求
 * @returns 用户登录响应
 */
export const loginByEmailApi = (data: EmailLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_EMAIL, { data });
};

/**
 * 发送邮箱验证码
 * @param params 邮箱地址
 * @returns 发送结果
 */
export const sendEmailCodeApi = (params: { email: string }) => {
  return http.request<string>('post', AUTH_API_PATHS.EMAIL_SEND_CODE, { params });
};

/**
 * 刷新令牌
 * @returns 刷新令牌响应
 */
export const refreshTokenApi = () => {
  return http.request<RefreshTokenResponse>('post', AUTH_API_PATHS.REFRESH_TOKEN);
};

/**
 * 退出登录
 * @returns 退出登录响应
 */
export const logoutApi = () => {
  return http.request<void>('post', AUTH_API_PATHS.LOGOUT);
};

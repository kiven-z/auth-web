import { http } from '@/infrastructure/http-core';
import { AUTH_API_PATHS } from './paths';
import type {
  EmailLoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './types';

export { AUTH_API_PATHS, AUTH_PUBLIC_API_PATH_SUFFIXES } from './paths';
export type {
  EmailLoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './types';

export const loginByUsernameApi = (data: UsernamePasswordLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_USERNAME, { data });
};

export const loginByEmailApi = (data: EmailLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_EMAIL, { data });
};

export const refreshTokenApi = (data: RefreshTokenRequest) => {
  return http.request<RefreshTokenResponse>('post', AUTH_API_PATHS.REFRESH_TOKEN, { data });
};

export const logoutApi = () => {
  return http.request<void>('post', AUTH_API_PATHS.LOGOUT);
};

import { http } from '@/utils/http';

/**
 * 认证相关 URL 路径（相对 Axios baseURL `/api`，无首尾斜杠）。
 * 仅含常量，不引用 http，供 `http-config` 白名单引用，避免循环依赖。
 *
 * @see auth-server AuthController — `@RequestMapping("/api/auth")`
 */
export const AUTH_API_PATHS = {
  LOGIN_USERNAME: 'auth/login/username',
  LOGIN_EMAIL: 'auth/login/email',
  EMAIL_SEND_CODE: 'auth/login/email/send-code',
  REFRESH_TOKEN: 'auth/refresh-token',
  LOGOUT: 'auth/logout',
} as const;

/** 用户登录响应（对齐 auth-server UserLoginResponse） */
export interface UserLoginResponse {
  id?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
  accessToken: string;
  refreshToken: string;
  /** 后端 LocalDateTime，格式 yyyy/MM/dd HH:mm:ss */
  expires: string;
  readMeDay?: number;
}

/** 刷新令牌响应（对齐 RefreshTokenResponse） */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expires: string;
  readMeDay?: number;
}

export interface UsernamePasswordLoginRequest {
  username: string;
  password: string;
}

export interface EmailLoginRequest {
  email: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

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

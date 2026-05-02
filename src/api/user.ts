import { http } from '@/utils/http';

/**
 * 用户登录响应数据
 */
export interface UserLoginResponse {
  /** 用户 ID（JSON 可能为字符串） */
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

/**
 * 刷新令牌响应数据
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expires: string;
  readMeDay?: number;
}

/**
 * 用户名密码登录请求数据
 */
export interface UsernamePasswordLoginRequest {
  username: string;
  password: string;
}

/**
 * 邮箱验证码登录请求数据
 */
export interface EmailLoginRequest {
  email: string;
  code: string;
}

/**
 * 刷新令牌请求数据
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 用户名密码登录
 * @param data 用户名密码登录请求数据
 * @returns 用户登录响应数据
 */
export const loginByUsernameApi = (data: UsernamePasswordLoginRequest) => {
  return http.request<UserLoginResponse>('post', 'auth/login/username', { data });
};

/**
 * 邮箱验证码登录
 * @param data 邮箱验证码登录请求数据
 * @returns 用户登录响应数据
 */
export const loginByEmailApi = (data: EmailLoginRequest) => {
  return http.request<UserLoginResponse>('post', 'auth/login/email', {
    data,
  });
};

/**
 * 刷新访问令牌
 * @param data 刷新令牌请求数据
 * @returns 刷新令牌响应数据
 */
export const refreshTokenApi = (data: RefreshTokenRequest) => {
  return http.request<RefreshTokenResponse>('post', 'auth/refresh-token', {
    data,
  });
};

/**
 * 退出登录（需携带 Access Token，由拦截器附加）
 * @returns 退出登录响应数据
 */
export const logoutApi = () => {
  return http.request<void>('post', 'auth/logout');
};

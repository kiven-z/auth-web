/** 刷新令牌响应 */
export interface RefreshTokenResponse {
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
  /** 令牌过期时间，后端 LocalDateTime，格式 `yyyy/MM/dd HH:mm:ss` */
  expires: string;
  readMeDay?: number;
}

/** 用户登录响应 */
export interface UserLoginResponse extends RefreshTokenResponse {
  nickname?: string;
  avatar?: string;
}

/**
 * 用户名密码登录请求
 */
export interface UsernamePasswordLoginRequest {
  username: string;
  password: string;
  /** 是否记住登录（天数由后端 readMeDay 下发） */
  rememberMe?: boolean;
}

/**
 * 邮箱登录请求
 */
export interface EmailLoginRequest {
  email: string;
  code: string;
  rememberMe?: boolean;
}

/**
 * 短信登录请求
 */
export interface SmsLoginRequest {
  phone: string;
  code: string;
  rememberMe?: boolean;
}

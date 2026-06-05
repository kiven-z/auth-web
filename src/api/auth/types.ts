/** 用户登录响应（对齐 auth-server UserLoginResponse） */
export interface UserLoginResponse {
  id?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
  accessToken: string;
  /** 令牌过期时间，后端 LocalDateTime，格式 `yyyy/MM/dd HH:mm:ss` */
  expires: string;
  readMeDay?: number;
}

/**
 * 刷新令牌响应（对齐 RefreshTokenResponse）
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expires: string;
  readMeDay?: number;
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

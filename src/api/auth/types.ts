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

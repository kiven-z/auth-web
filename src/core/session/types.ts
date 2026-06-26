/** 会话数据（Pinia / 本地缓存读写） */
export interface DataInfo<T> {
  /** 访问令牌 */
  accessToken?: string;
  /** `accessToken` 过期时间（时间戳） */
  expires?: T;
  /** 用户 ID（与后端 Long 字符串化一致） */
  userId?: string;
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}

/**
 * 写入会话所需的字段（登录或刷新后）；SSO 等场景可缺省 expires，由默认值补齐
 */
export interface SessionTokenPayload {
  accessToken: string;
  /** `accessToken` 过期时间（时间戳） */
  expires?: string | number | Date;
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  /** 用户 ID（与后端 Long 字符串化一致） */
  userId?: string;
}

/** 用户资料快照（写入 localStorage 与同步 Pinia 时使用） */
export interface UserProfileSnapshot {
  avatar: string;
  username: string;
  nickname: string;
  roles: Array<string>;
  permissions: Array<string>;
  userId?: string;
}

/**
 * 登录方式枚举
 * 新增登录方式时在此处添加枚举值即可，
 */
export enum LoginMode {
  // 用户名密码
  UsernamePassword = 'username-password',
  // 邮箱
  Email = 'email',
  // 未来可追加：Mobile = 'mobile', QrCode = 'qrcode', etc.
}

/**
 * 登录方式的元数据描述，用于动态渲染切换按钮列表。
 */
export interface LoginModeMeta {
  // 枚举值
  mode: LoginMode;
  // 按钮显示的文案 key（i18n）
  labelKey: string;
}

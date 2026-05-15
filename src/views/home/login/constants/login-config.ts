import { LoginMode, type LoginModeMeta } from '@/views/home/login/constants/types';

/**
 * 登录方式切换按钮元数据
 * 新增登录方式时在此处追加条目即可
 */
export const loginModes: LoginModeMeta[] = [
  { mode: LoginMode.UsernamePassword, labelKey: 'login.authUsernamePasswordLogin' },
  { mode: LoginMode.Email, labelKey: 'login.authEmailLogin' },
  // 未来：
  // { mode: LoginMode.Mobile, labelKey: 'login.authMobileLogin' },
];

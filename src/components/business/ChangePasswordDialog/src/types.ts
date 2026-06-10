/** 修改密码弹窗模式 */
export type ChangePasswordMode = 'admin-reset' | 'self-change';

/** 管理员重置密码表单 */
export interface AdminResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

/** 当前用户修改密码表单 */
export interface SelfChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 修改密码弹窗表单联合类型 */
export type ChangePasswordFormState = AdminResetPasswordForm | SelfChangePasswordForm;

/** 修改密码弹窗面板 Props */
export interface ChangePasswordDialogPanelProps {
  /** 弹窗模式：管理员重置他人密码 / 当前用户自改 */
  mode: ChangePasswordMode;
}

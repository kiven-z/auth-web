/**
 * 登录表单组件 Props
 *
 * 所有登录子表单必须接收以下通用 props。
 */
export interface LoginFormProps {
  loading: boolean;
  disabled: boolean;
}

/**
 * 登录成功事件
 *
 * 表单组件内部完成登录请求（调 store.loginByXxx）后，emit 此事件通知父级做后续导航。
 * 父级不需要知道具体用哪种方式登录，只需要在成功时跳转页面。
 */
export interface LoginFormEmits {
  (e: 'login-success'): void;
}

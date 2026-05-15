/**
 * 登录表单组件需要实现的 Props
 *
 * 所有登录子表单必须接收以下通用 props，确保 `LoginContainer` 统一注入。
 */
export interface LoginFormProps {
  // 加载状态，由父级 LoginContainer 控制
  loading: boolean;
  // 按钮是否禁用，由父级控制
  disabled: boolean;
}

/**
 * 登录表单组件 emit 事件
 */
export interface LoginFormEmits {
  /** 表单验证通过后交由 LoginContainer 处理登录请求 */
  (e: 'login', formData: Record<string, unknown>): void;
}

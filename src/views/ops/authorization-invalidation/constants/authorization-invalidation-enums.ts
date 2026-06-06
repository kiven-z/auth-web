/**
 * 授权变更维度（与后端 AuthorizationChangeKind 一致）
 */
export const AUTHORIZATION_CHANGE_KINDS = [
  'ROLE',
  'PERMISSION',
  'POLICY',
  'GRANT',
  'USER_DEPT',
  'USER_POST',
  'USER_SCOPE',
] as const;

export type AuthorizationChangeKind = (typeof AUTHORIZATION_CHANGE_KINDS)[number];

/**
 * 处理中占位筛选选项
 */
export const PROCESSING_FILTER_OPTIONS = [true, false] as const;

/**
 * 处理状态 Tag 类型
 * @param processing 是否处理中占位
 * @returns Element Plus Tag 类型
 */
export function getProcessingTagType(processing: boolean | undefined | null): 'warning' | 'success' {
  return processing ? 'warning' : 'success';
}

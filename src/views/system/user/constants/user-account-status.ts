/** 用户账号状态码 */
export const USER_ACCOUNT_STATUS = {
  disabled: 0,
  normal: 1,
  locked: 2,
} as const;

/** 用户账号状态展示元数据 */
export const USER_ACCOUNT_STATUS_META = {
  1: { labelKey: 'users.accountStatus.normal', tagType: 'success' },
  2: { labelKey: 'users.accountStatus.locked', tagType: 'warning' },
  0: { labelKey: 'users.accountStatus.disabled', tagType: 'danger' },
} as const satisfies Record<number, { labelKey: string; tagType: 'success' | 'warning' | 'danger' }>;

const DEFAULT_USER_ACCOUNT_STATUS_META = USER_ACCOUNT_STATUS_META[0];

/**
 * 解析用户账号状态展示元数据
 * @param status 账号状态码
 * @returns 标签文案键与 Element Plus Tag 类型
 */
export function resolveUserAccountStatusMeta(status: number) {
  return USER_ACCOUNT_STATUS_META[status as keyof typeof USER_ACCOUNT_STATUS_META] ?? DEFAULT_USER_ACCOUNT_STATUS_META;
}

/** 用户列表状态筛选项 */
export const USER_STATUS_FILTER_OPTIONS = [
  { value: 1, labelKey: 'users.accountStatus.normal' },
  { value: 0, labelKey: 'users.accountStatus.disabled' },
  { value: 2, labelKey: 'users.accountStatus.locked' },
] as const;

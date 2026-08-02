/** 用户账号状态码 */
export const USER_ACCOUNT_STATUS = {
  disabled: 0,
  normal: 1,
  locked: 2,
} as const;

/** 用户性别码 */
export const USER_GENDER = {
  unknown: 0,
  male: 1,
  female: 2,
} as const;

/**
 * 用户管理左侧部门树「全部」虚拟节点 ID
 */
export const USER_DEPT_ALL_NODE_ID = '__ALL__';

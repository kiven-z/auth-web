import { ElTag } from 'element-plus';

type Translate = (key: string) => string;

/**
 * 用户账号状态（sys_user.status）
 * @param t 翻译函数
 * @param value 值
 * @returns 用户账号状态
 */
export function renderUserAccountStatus(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return <span>-</span>;
  }
  const type = value === 0 ? 'success' : value === 1 ? 'danger' : 'warning';
  const labelKey =
    value === 0
      ? 'users.accountStatus.normal'
      : value === 1
        ? 'users.accountStatus.disabled'
        : 'users.accountStatus.locked';
  return (
    <ElTag type={type} effect="plain">
      {t(labelKey)}
    </ElTag>
  );
}

/**
 * 用户性别（sys_user.gender）
 * @param t 翻译函数
 * @param value 值
 * @returns 用户性别
 */
export function renderUserGender(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return <span>{t('users.genderLabel.unknown')}</span>;
  }
  const labelKey =
    value === 1 ? 'users.genderLabel.male' : value === 2 ? 'users.genderLabel.female' : 'users.genderLabel.unknown';
  return <span>{t(labelKey)}</span>;
}

/**
 * user_dept / user_post 关联状态
 * @param t 翻译函数
 * @param value 值
 * @returns user_dept / user_post 关联状态
 */
export function renderRelationStatus(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return <span>-</span>;
  }
  // FIXME 修改为枚举
  const type = value === 1 ? 'success' : value === 2 ? 'warning' : 'info';
  const labelKey =
    value === 1
      ? 'users.relationStatus.normal'
      : value === 2
        ? 'users.relationStatus.partTime'
        : 'users.relationStatus.transferred';
  return (
    <ElTag type={type} effect="plain">
      {t(labelKey)}
    </ElTag>
  );
}

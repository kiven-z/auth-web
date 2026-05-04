import { ElTag } from 'element-plus';
import { h } from 'vue';

type Translate = (key: string) => string;

/**
 * 用户账号状态（sys_user.status）
 */
export function renderUserAccountStatus(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return h('span', '-');
  }
  const type = value === 0 ? 'success' : value === 1 ? 'danger' : 'warning';
  const labelKey =
    value === 0 ? 'users.accountStatus.normal' : value === 1 ? 'users.accountStatus.disabled' : 'users.accountStatus.locked';
  return h(ElTag, { type, size: 'small' }, () => t(labelKey));
}

/**
 * 用户性别（sys_user.gender）
 */
export function renderUserGender(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return h('span', t('users.genderLabel.unknown'));
  }
  const labelKey =
    value === 1 ? 'users.genderLabel.male' : value === 2 ? 'users.genderLabel.female' : 'users.genderLabel.unknown';
  return h('span', t(labelKey));
}

/**
 * user_dept / user_post 关联状态
 */
export function renderRelationStatus(t: Translate, value: number | undefined | null) {
  if (value === undefined || value === null) {
    return h('span', '-');
  }
  const type = value === 0 ? 'success' : value === 1 ? 'info' : 'warning';
  const labelKey =
    value === 0
      ? 'users.relationStatus.normal'
      : value === 1
        ? 'users.relationStatus.transferred'
        : 'users.relationStatus.partTime';
  return h(ElTag, { type, size: 'small' }, () => t(labelKey));
}

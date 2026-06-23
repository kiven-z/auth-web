import { ElCheckTag, ElTag } from 'element-plus';
import { useI18n } from 'vue-i18n';

const ACCOUNT_STATUS_META = {
  0: { labelKey: 'users.accountStatus.disabled', tagType: 'danger' },
  1: { labelKey: 'users.accountStatus.normal', tagType: 'success' },
  2: { labelKey: 'users.accountStatus.locked', tagType: 'warning' },
} as const satisfies Record<number, { labelKey: string; tagType: 'success' | 'warning' | 'danger' }>;

const RELATION_STATUS_META = {
  0: { labelKey: 'users.relationStatus.transferred', tagType: 'info' },
  1: { labelKey: 'users.relationStatus.normal', tagType: 'success' },
  2: { labelKey: 'users.relationStatus.partTime', tagType: 'warning' },
} as const satisfies Record<number, { labelKey: string; tagType: 'success' | 'warning' | 'info' }>;

/**
 * 用户档案相关字段展示（账号状态、性别、组织关联状态）
 * @returns 字段渲染函数
 */
function useUserProfileDisplay() {
  const { t } = useI18n();

  /**
   * 用户账号状态（sys_user.status）
   * @param value 状态码
   * @returns 账号状态标签
   */
  function renderUserAccountStatus(value: number | undefined | null) {
    if (value === undefined || value === null) {
      return <span>-</span>;
    }
    const meta = ACCOUNT_STATUS_META[value];
    return (
      <ElTag type={meta.tagType} effect="plain">
        {t(meta.labelKey)}
      </ElTag>
    );
  }

  /**
   * 用户性别（sys_user.gender）
   * @param value 性别码
   * @returns 性别文案
   */
  function renderUserGender(value: number | undefined | null) {
    if (value === undefined || value === null) {
      return <span>{t('users.genderLabel.unknown')}</span>;
    }
    const labelKey =
      value === 1 ? 'users.genderLabel.male' : value === 2 ? 'users.genderLabel.female' : 'users.genderLabel.unknown';
    return <span>{t(labelKey)}</span>;
  }

  /**
   * user_dept / user_post 关联状态
   * @param value 关联状态码
   * @returns 关联状态标签
   */
  function renderRelationStatus(value: number | undefined | null) {
    if (value === undefined || value === null) {
      return <span>-</span>;
    }
    const meta = RELATION_STATUS_META[value];
    return (
      <ElTag type={meta.tagType} effect="plain">
        {t(meta.labelKey)}
      </ElTag>
    );
  }

  /**
   * 用户-部门主部门标识
   * @param isPrimary 是否主部门
   * @returns 主部门标签
   */
  function renderIsPrimary(isPrimary: boolean) {
    return isPrimary ? (
      <ElCheckTag checked type="danger">
        {t('relation.primary')}
      </ElCheckTag>
    ) : (
      <ElCheckTag checked={false} type="info">
        {t('relation.nonPrimary')}
      </ElCheckTag>
    );
  }

  /**
   * 用户-岗位主岗位标识
   * @param isPrimary 是否主岗位
   * @returns 主岗位标签
   */
  function renderPostIsPrimary(isPrimary: boolean) {
    return isPrimary ? (
      <ElCheckTag checked type="danger">
        {t('post.enums.primary.yes')}
      </ElCheckTag>
    ) : (
      <ElCheckTag checked type="primary">
        {t('post.enums.primary.no')}
      </ElCheckTag>
    );
  }

  return {
    renderUserAccountStatus,
    renderUserGender,
    renderRelationStatus,
    renderIsPrimary,
    renderPostIsPrimary,
  };
}

export default useUserProfileDisplay;

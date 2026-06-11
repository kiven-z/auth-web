import { computed } from 'vue';
import { ElAvatar, ElCheckTag } from 'element-plus';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import { useI18n } from 'vue-i18n';

function useUserProfileColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus, renderUserGender, renderRelationStatus } = useUserProfileDisplay();

  /**
   * 用户列
   */
  const userColumns = computed(() => [
    { label: t('users.username'), prop: 'username', copy: true },
    { label: t('users.nickname'), prop: 'nickname', copy: true },
    { label: t('users.email'), prop: 'email', copy: true },
    { label: t('users.phone'), prop: 'phone', copy: true, span: 2 },
    {
      label: t('users.avatarURL'),
      prop: 'avatar',
      cellRenderer: ({ value }: { value: string }) => {
        return <ElAvatar src={value} size={40} />;
      },
    },
    {
      label: t('users.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: number }) => {
        return renderUserAccountStatus(value);
      },
    },
    {
      label: t('users.gender'),
      prop: 'gender',
      cellRenderer: ({ value }: { value: number }) => {
        return renderUserGender(value);
      },
    },
    { label: t('users.birthday'), prop: 'birthday', span: 2 },
    { label: t('users.introduction'), prop: 'introduction', span: 2 },
  ]);

  /**
   * 部门列
   */
  const deptColumns = computed(() => [
    { label: t('dept.deptName'), prop: 'deptName', copy: true },
    { label: t('dept.deptCode'), prop: 'deptCode', copy: true },
    {
      label: t('dept.isPrimaryDepartment'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean }) => {
        return value ? (
          <ElCheckTag checked type="danger">
            {t('dept.primaryDepartment')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked={false} type="info">
            {t('dept.nonPrimaryDepartment')}
          </ElCheckTag>
        );
      },
    },
    {
      label: t('users.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: number }) => {
        return renderRelationStatus(value);
      },
    },
  ]);

  /**
   * 岗位列
   */
  const postColumns = computed(() => [
    { label: t('post.postName'), prop: 'postName', copy: true },
    { label: t('post.postCode'), prop: 'postCode', copy: true },
    {
      label: t('post.isPrimaryPosition'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean | number }) => {
        const primary = value === true || value === 1;
        return primary ? (
          <ElCheckTag checked type="danger">
            {t('post.primaryPosition')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('post.secondaryPosition')}
          </ElCheckTag>
        );
      },
    },
    {
      label: t('users.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: number }) => {
        return renderRelationStatus(value);
      },
    },
  ]);

  return {
    userColumns,
    deptColumns,
    postColumns,
  };
}

export default useUserProfileColumns;

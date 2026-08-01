import type {
  DeptBoundUserReference,
  PostBoundUserReference,
  UserDeptReference,
  UserPostReference,
  UserReference,
} from '@/api/system/_shared/grant-table';
import type { UserDeptPageRow } from '@/api/system/user/user-dept';
import type { UserPostPageRow } from '@/api/system/user/user-post';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import { computed } from 'vue';
import { ElAvatar, ElCheckTag, ElTag } from 'element-plus';
import { useI18n } from 'vue-i18n';

interface RelationStatusRow {
  relationStatus?: number;
  status?: number | boolean;
}

/**
 * 从 Reference 或分页行解析组织关联状态
 * @param row 含 relationStatus 或关联 status 的行
 * @returns 关联状态码
 */
function resolveRelationStatus(row: RelationStatusRow): number | undefined {
  if (row.relationStatus !== undefined && row.relationStatus !== null) {
    return row.relationStatus;
  }
  if (typeof row.status === 'number') {
    return row.status;
  }
  return undefined;
}

/**
 * 用户档案与绑定关系表格/描述列
 * @returns 用户、部门、岗位相关列定义
 */
function useUserProfileColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus, renderUserGender, renderRelationStatus, renderIsPrimary, renderPostIsPrimary } =
    useUserProfileDisplay();

  const userColumns = computed(() => [
    { label: t('users.field.username'), prop: 'username', copy: true },
    { label: t('users.field.nickname'), prop: 'nickname', copy: true },
    { label: t('users.field.email'), prop: 'email', copy: true },
    { label: t('users.field.phone'), prop: 'phone', copy: true, span: 2 },
    {
      label: t('users.field.avatarURL'),
      prop: 'avatar',
      cellRenderer: ({ value }: { value: string }) => {
        return <ElAvatar src={value} size={40} />;
      },
    },
    {
      label: t('users.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: number }) => {
        return renderUserAccountStatus(value);
      },
    },
    {
      label: t('users.field.gender'),
      prop: 'gender',
      cellRenderer: ({ value }: { value: number }) => {
        return renderUserGender(value);
      },
    },
    { label: t('users.field.birthday'), prop: 'birthday', span: 2 },
    { label: t('users.field.introduction'), prop: 'introduction', span: 2 },
  ]);

  const deptColumns = computed(() => [
    { label: t('dept.field.deptName'), prop: 'deptName', copy: true },
    { label: t('dept.field.deptCode'), prop: 'deptCode', copy: true },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean }) => {
        return value ? (
          <ElCheckTag checked type="danger">
            {t('relation.primary')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked={false} type="info">
            {t('relation.nonPrimary')}
          </ElCheckTag>
        );
      },
    },
    {
      label: t('dept.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: boolean }) => {
        const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
        const labelKey = option?.labelKey ?? (value ? 'dept.enum.status.normal' : 'dept.enum.status.disabled');
        return (
          <ElTag type={value ? 'success' : 'danger'} effect="plain">
            {t(labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      cellRenderer: ({ value }: { value: number }) => {
        return renderRelationStatus(value);
      },
    },
  ]);

  const postColumns = computed(() => [
    { label: t('post.field.postName'), prop: 'postName', copy: true },
    { label: t('post.field.postCode'), prop: 'postCode', copy: true },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean | number }) => {
        const primary = value === true || value === 1;
        return primary ? (
          <ElCheckTag checked type="danger">
            {t('post.enums.primary.yes')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('post.enums.primary.no')}
          </ElCheckTag>
        );
      },
    },
    {
      label: t('post.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: boolean }) => {
        const option = POST_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
        const labelKey = option?.labelKey ?? (value ? 'post.enums.status.normal' : 'post.enums.status.disabled');
        return (
          <ElTag type={value ? 'success' : 'danger'} effect="plain">
            {t(labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      cellRenderer: ({ value }: { value: number }) => {
        return renderRelationStatus(value);
      },
    },
  ]);

  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('users.field.username'), prop: 'username', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('users.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: UserReference) => renderUserAccountStatus(row.status),
    },
  ]);

  const userRelationBindingColumns = computed<TableColumnList>(() => [
    ...userBindingColumns.value,
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: DeptBoundUserReference | PostBoundUserReference) => renderIsPrimary(row.isPrimary),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      formatter: (row: DeptBoundUserReference | PostBoundUserReference) =>
        renderRelationStatus(resolveRelationStatus(row)),
    },
  ]);

  const userDeptBindingColumns = computed<TableColumnList>(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: UserDeptReference | UserDeptPageRow) => renderIsPrimary(row.isPrimary),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      formatter: (row: UserDeptReference | UserDeptPageRow) => renderRelationStatus(resolveRelationStatus(row)),
    },
  ]);

  const userPostBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: UserPostReference | UserPostPageRow) => renderPostIsPrimary(row.isPrimary),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      formatter: (row: UserPostReference | UserPostPageRow) => renderRelationStatus(resolveRelationStatus(row)),
    },
  ]);

  return {
    userColumns,
    deptColumns,
    postColumns,
    userBindingColumns,
    userRelationBindingColumns,
    userDeptBindingColumns,
    userPostBindingColumns,
  };
}

export default useUserProfileColumns;

import type { UserDeptPageRow } from '@/api/system/user-dept';
import { selectUserinfo } from '@/components/business/UserProfile';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import { ElButton, ElCheckTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户部门关联抽屉表格列
 * @returns 表格列定义
 */
function useUserDeptAssignTableColumns() {
  const { t } = useI18n();
  const { renderRelationStatus } = useUserProfileDisplay();

  const columns = computed<TableColumnList>(() => [
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('dept.deptCode'), prop: 'deptCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('dept.deptName'), prop: 'deptName', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('dept.isPrimaryDepartment'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: UserDeptPageRow) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('dept.primaryDepartment')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('dept.secondaryDepartment')}
          </ElCheckTag>
        ),
    },
    {
      label: t('dept.relationStatus'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: UserDeptPageRow) => renderRelationStatus(row.status),
    },
    { label: t('users.remark'), prop: 'remark', minWidth: 160, showOverflowTooltip: true },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 170 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 170 },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: UserDeptPageRow) =>
        row.createUser && (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
            {row.createUsername}
          </ElButton>
        ),
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      minWidth: 120,
      formatter: (row: UserDeptPageRow) =>
        row.updateUser && (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
            {row.updateUsername}
          </ElButton>
        ),
    },
  ]);

  return { columns };
}

export default useUserDeptAssignTableColumns;

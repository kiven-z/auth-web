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
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: UserDeptPageRow) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('relation.primary')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('relation.secondary')}
          </ElCheckTag>
        ),
    },
    {
      label: t('relation.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: UserDeptPageRow) => renderRelationStatus(row.status),
    },
    { label: t('users.field.remark'), prop: 'remark', minWidth: 160, showOverflowTooltip: true },
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
    {
      label: t('table.actions'),
      fixed: 'right',
      slot: 'actions',
      minWidth: 130,
    },
  ]);

  return { columns };
}

export default useUserDeptAssignTableColumns;

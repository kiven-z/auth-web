import type { SysDeptBoundUserItem } from '@/api/system/dept';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/** user_dept.status：0 已调离，1 正常，2 兼职 */
const RELATION_STATUS_TAG: Record<number, { type: 'success' | 'info' | 'warning'; labelKey: string }> = {
  0: { type: 'info', labelKey: 'users.relationStatus.transferred' },
  1: { type: 'success', labelKey: 'users.relationStatus.normal' },
  2: { type: 'warning', labelKey: 'users.relationStatus.partTime' },
};

/** sys_user.status：0 禁用，1 正常，2 锁定 */
const USER_STATUS_TAG: Record<number, { type: 'success' | 'danger' | 'warning'; labelKey: string }> = {
  0: { type: 'danger', labelKey: 'users.accountStatus.disabled' },
  1: { type: 'success', labelKey: 'users.accountStatus.normal' },
  2: { type: 'warning', labelKey: 'users.accountStatus.locked' },
};

/**
 * 部门详情：关联用户表格列
 */
function useDeptBindingUserColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('users.username'), prop: 'username', minWidth: 110, showOverflowTooltip: true },
    { label: t('users.nickname'), prop: 'nickname', minWidth: 100, showOverflowTooltip: true },
    { label: t('dept.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('dept.isPrimaryDepartment'),
      prop: 'isPrimary',
      minWidth: 100,
      formatter: (row: SysDeptBoundUserItem) => (
        <ElTag type={row.isPrimary ? 'primary' : 'info'} effect="plain" size="small">
          {t(row.isPrimary ? 'dept.primaryDepartment' : 'dept.secondaryDepartment')}
        </ElTag>
      ),
    },
    {
      label: t('dept.relationStatus'),
      prop: 'relationStatus',
      minWidth: 90,
      formatter: (row: SysDeptBoundUserItem) => {
        const meta = RELATION_STATUS_TAG[row.relationStatus];
        if (!meta) {
          return <span>{String(row.relationStatus ?? '')}</span>;
        }
        return (
          <ElTag type={meta.type} effect="plain" size="small">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('dept.userAccountStatus'),
      prop: 'userStatus',
      minWidth: 90,
      formatter: (row: SysDeptBoundUserItem) => {
        const meta = USER_STATUS_TAG[row.userStatus];
        if (!meta) {
          return <span>{String(row.userStatus ?? '')}</span>;
        }
        return (
          <ElTag type={meta.type} effect="plain" size="small">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    { label: t('dept.position'), prop: 'position', minWidth: 100, showOverflowTooltip: true },
    { label: t('dept.joinTime'), prop: 'joinTime', minWidth: 160 },
  ]);

  return { columns };
}

export default useDeptBindingUserColumns;

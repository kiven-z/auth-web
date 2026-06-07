import type { SysUserPageRow } from '@/api/system/user';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格列
 * @returns 表格列定义
 */
function useUserTableColumns() {
  const { t } = useI18n();

  // FIXME 修改成switch 直接连接到函数中，考虑使用常量方式
  const resolveAccountStatusLabel = (status: number) => {
    if (status === 1) {
      return t('users.accountStatus.normal');
    }
    if (status === 2) {
      return t('users.accountStatus.locked');
    }
    return t('users.accountStatus.disabled');
  };

  // FIXME 修改成switch 直接连接到函数中，考虑使用常量方式
  const resolveAccountStatusType = (status: number): 'success' | 'warning' | 'danger' => {
    if (status === 1) {
      return 'success';
    }
    if (status === 2) {
      return 'warning';
    }
    return 'danger';
  };

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('users.username'), prop: 'username', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.phone'), prop: 'phone', minWidth: 130, showOverflowTooltip: true },
    { label: t('users.email'), prop: 'email', minWidth: 160, showOverflowTooltip: true },
    { label: t('dept.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('users.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysUserPageRow) => (
        <ElTag type={resolveAccountStatusType(row.status)} effect="plain">
          {resolveAccountStatusLabel(row.status)}
        </ElTag>
      ),
    },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 160 },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      minWidth: 160,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useUserTableColumns;

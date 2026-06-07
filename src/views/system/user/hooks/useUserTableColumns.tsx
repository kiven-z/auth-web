import type { SysUserPageRow } from '@/api/system/user';
import { resolveUserAccountStatusMeta } from '@/views/system/user/constants/user-account-status';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格列
 * @returns 表格列定义
 */
function useUserTableColumns() {
  const { t } = useI18n();

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
      formatter: (row: SysUserPageRow) => {
        const meta = resolveUserAccountStatusMeta(row.status);
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
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

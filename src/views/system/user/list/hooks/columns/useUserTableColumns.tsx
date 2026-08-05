import type { SysUserPageRow } from '@/api/system/user/user';
import { selectUserinfo, UserAvatar, useUserProfileDisplay } from '@/components/domain/user/UserProfile';
import { Perms } from '@/auth/permission';
import { SYS_USER_PERMS } from '@/views/system/user/constants/permissions';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格列
 * @returns 表格列定义
 */
function useUserTableColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus } = useUserProfileDisplay();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    {
      label: t('users.field.username'),
      prop: 'username',
      minWidth: 120,
      showOverflowTooltip: true,
      formatter: (row: SysUserPageRow) => (
        <Perms value={SYS_USER_PERMS.QUERY}>
          <ElButton link type="primary" onClick={() => selectUserinfo(row.id, row.username)}>
            {row.username}
          </ElButton>
        </Perms>
      ),
    },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('users.field.avatarURL'),
      prop: 'avatar',
      minWidth: 72,
      formatter: (row: SysUserPageRow) => (
        <UserAvatar avatar={row.avatar} name={row.nickname || row.username} size={32} />
      ),
    },
    { label: t('users.field.phone'), prop: 'phone', minWidth: 130, showOverflowTooltip: true },
    { label: t('users.field.email'), prop: 'email', minWidth: 160, showOverflowTooltip: true },
    { label: t('relation.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('users.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysUserPageRow) => renderUserAccountStatus(row.status),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      minWidth: 100,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useUserTableColumns;

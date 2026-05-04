import type { SysRolePageRow } from '@/api/system/role';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/** 打开用户档案（由页面注入，用于创建人/更新人下钻） */
export type RoleUserProfileOpener = (userId: string) => void;

/**
 * 角色表格列
 * @param options.openUserProfile 点击创建人/更新人时打开用户档案弹窗
 */
function useRoleTableColumns(options?: { openUserProfile?: RoleUserProfileOpener }) {
  const { t } = useI18n();
  const openUserProfile = options?.openUserProfile;

  /**
   * 格式化角色类型
   */
  function formatRoleType(roleType: number): string {
    const keyMap: Record<number, string> = {
      1: 'roles.roleTypeSystem',
      2: 'roles.roleTypeMenu',
      3: 'roles.roleTypeBusiness',
      4: 'roles.roleTypeCustom',
    };
    const key = keyMap[roleType];
    return key ? t(key) : String(roleType);
  }

  /**
   * 格式化状态
   */
  function formatStatus(status: number): string {
    return status === 0 ? t('roles.statusNormal') : t('roles.statusDisabled');
  }

  /**
   * 可点击用户名（有 userId 且提供 opener 时渲染为链接按钮）
   */
  function renderUserLinkCell(row: SysRolePageRow, userId: string | undefined, displayName: string | null | undefined) {
    const label = displayName && String(displayName).trim() !== '' ? String(displayName) : '-';
    if (!openUserProfile || !userId) {
      return <span>{label}</span>;
    }
    return (
      <ElButton type="primary" link onClick={() => openUserProfile(userId)}>
        {label}
      </ElButton>
    );
  }

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 130 },
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 140 },
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysRolePageRow) => {
        return (
          <ElTag type={row.status === 0 ? 'success' : 'danger'} effect="plain" size="small">
            {formatStatus(row.status)}
          </ElTag>
        );
      },
    },
    {
      label: t('roles.roleType'),
      prop: 'roleType',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => formatRoleType(row.roleType),
    },
    { label: t('roles.orderNum'), prop: 'orderNum', width: 100 },
    { label: t('roles.createTime'), prop: 'createTime', minWidth: 120 },
    { label: t('roles.updateTime'), prop: 'updateTime', minWidth: 120 },
    {
      label: t('roles.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => renderUserLinkCell(row, row.createUser, row.createUsername),
    },
    {
      label: t('roles.updateUsername'),
      prop: 'updateUsername',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => renderUserLinkCell(row, row.updateUser, row.updateUsername),
    },
    {
      label: t('roles.actions'),
      fixed: 'right' as const,
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useRoleTableColumns;

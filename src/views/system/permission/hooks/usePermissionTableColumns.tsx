import type { SysPermissionPageRow } from '@/api/system/permission';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限表格列
 */
function usePermissionTableColumns() {
  const { t } = useI18n();

  // 权限类型标签映射：0=按钮权限（primary），1=API 权限（success）
  const PERMISSION_TYPE_TAG_MAP: Record<number, { type: 'primary' | 'success'; labelKey: string }> = {
    0: { type: 'primary', labelKey: 'permissions.typeButton' },
    1: { type: 'success', labelKey: 'permissions.typeApi' },
  };

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 权限编码
    { label: t('permissions.permissionCode'), prop: 'permissionCode', minWidth: 150 },
    // 权限名称
    { label: t('permissions.permissionName'), prop: 'permissionName', minWidth: 150 },
    // 权限类型
    {
      label: t('permissions.permissionType'),
      prop: 'permissionType',
      minWidth: 120,
      formatter: (row: SysPermissionPageRow) => {
        const cfg = PERMISSION_TYPE_TAG_MAP[row.permissionType];
        if (!cfg) return '-';
        return (
          <ElTag type={cfg.type} effect="plain" size="small">
            {t(cfg.labelKey)}
          </ElTag>
        );
      },
    },
    // 状态
    {
      label: t('permissions.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysPermissionPageRow) => {
        return (
          <ElTag type={row.status ? 'success' : 'danger'} effect="plain" size="small">
            {row.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText')}
          </ElTag>
        );
      },
    },
    // 排序号
    { label: t('permissions.orderNum'), prop: 'orderNum', width: 100 },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 120 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 120 },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: SysPermissionPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      minWidth: 120,
      formatter: (row: SysPermissionPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      minWidth: 160,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default usePermissionTableColumns;

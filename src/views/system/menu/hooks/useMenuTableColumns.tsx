/**
 * 菜单管理表格列定义（表格视图与树形视图共用）
 */
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { transformI18n } from '@/plugins/i18n';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { ElTag, ElText } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

// 菜单类型标签样式映射
const MENU_TYPE_TAG_MAP: Record<number, { type: 'primary' | 'success' | 'warning'; labelKey: string }> = {
  0: { type: 'primary', labelKey: 'sysMenu.menuTypeMenu' },
  1: { type: 'warning', labelKey: 'sysMenu.menuTypeIframe' },
  2: { type: 'success', labelKey: 'sysMenu.menuTypeLink' },
};

function useMenuTableColumns() {
  const { t } = useI18n();

  // 表格视图列（含多选、序号）
  const tableColumns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 60,
    },
    // 菜单名称（标题）
    {
      label: t('sysMenu.menuTitle'),
      prop: 'title',
      formatter: (row: SysMenuRow) => {
        return <ElText>{transformI18n(row.title)}</ElText>;
      },
      minWidth: 160,
    },
    // 路由名称
    { label: t('sysMenu.routeName'), prop: 'name', minWidth: 160 },
    // 路由路径
    { label: t('sysMenu.path'), prop: 'path', minWidth: 180, showOverflowTooltip: true },
    // 菜单类型
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      width: 100,
      formatter: (row: SysMenuRow) => {
        const cfg = MENU_TYPE_TAG_MAP[row.menuType];
        if (!cfg) return '-';
        return (
          <ElTag type={cfg.type} effect="plain" size="small">
            {t(cfg.labelKey)}
          </ElTag>
        );
      },
    },
    // 排序
    { label: t('sysMenu.menuRank'), prop: 'menuRank', width: 80 },
    // 图标
    {
      label: t('menus.icon'),
      prop: 'icon',
      width: 80,
      formatter: (row: SysMenuRow) => {
        return <span className="flex justify-center text-xl">{h(useRenderIcon(row.icon))}</span>;
      },
    },
    // 状态
    {
      label: t('sysMenu.status'),
      prop: 'status',
      width: 90,
      formatter: (row: SysMenuRow) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain" size="small">
          {row.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText')}
        </ElTag>
      ),
    },
    // 显示
    {
      label: t('sysMenu.showLink'),
      prop: 'showLink',
      width: 80,
      formatter: (row: SysMenuRow) => (
        <ElTag type={row.showLink ? 'success' : 'info'} effect="plain" size="small">
          {row.showLink ? t('sysMenu.showLinkYes') : t('sysMenu.showLinkNo')}
        </ElTag>
      ),
    },
    // 缓存
    {
      label: t('sysMenu.keepAlive'),
      prop: 'keepAlive',
      width: 90,
      formatter: (row: SysMenuRow) => (
        <ElTag type={row.keepAlive ? 'success' : 'info'} effect="plain" size="small">
          {row.keepAlive ? t('sysMenu.keepAliveYes') : t('sysMenu.keepAliveNo')}
        </ElTag>
      ),
    },
    { label: t('table.updateTime'), prop: 'updateTime', sortable: true, minWidth: 160 },
    { label: t('table.createTime'), prop: 'createTime', sortable: true, minWidth: 160 },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 240,
      slot: 'actions',
    },
  ]);

  /**
   * 角色分配
   */
  const roleDrawerDataColumns = computed<TableColumnList>(() => [
    {
      label: t('sysMenu.roleCode'),
      prop: 'roleCode',
    },
    {
      label: t('sysMenu.roleName'),
      prop: 'roleName',
    },
  ]);

  /**
   * 权限分配
   */
  const permissionDrawerDataColumns = computed<TableColumnList>(() => [
    {
      label: t('sysMenu.permissionName'),
      prop: 'permissionName',
    },
    {
      label: t('sysMenu.permissionCode'),
      prop: 'permissionCode',
    },
  ]);
  return { tableColumns, roleDrawerDataColumns, permissionDrawerDataColumns };
}

export default useMenuTableColumns;

import { formatDateTime } from '@/shared/utils/date/dateTime';
/**
 * 菜单管理表格列定义（表格视图与树形视图共用）
 */
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { transformI18n } from '@/app/plugins/i18n';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { ElTag, ElText } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { MENU_TYPE_OPTIONS } from '@/views/system/menu/constants/menu-type';

/**
 * 表格列配置
 * @returns 表格列定义
 */
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
        const option = MENU_TYPE_OPTIONS.find((item) => item.value === row.menuType);
        if (!option) return '-';
        return (
          <ElTag type={option.tagType} effect="plain">
            {t(option.labelKey)}
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
        if (!row.icon) {
          return '';
        }
        return <span className="flex justify-center text-xl">{h(useRenderIcon(row.icon))}</span>;
      },
    },
    // 状态
    {
      label: t('sysMenu.status'),
      prop: 'status',
      width: 90,
      formatter: (row: SysMenuRow) => renderBooleanStatusTag(row.status),
    },
    // 显示
    {
      label: t('sysMenu.showLink'),
      prop: 'showLink',
      width: 80,
      formatter: (row: SysMenuRow) => (
        <ElTag type={row.showLink ? 'success' : 'info'} effect="plain">
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
        <ElTag type={row.keepAlive ? 'success' : 'info'} effect="plain">
          {row.keepAlive ? t('sysMenu.keepAliveYes') : t('sysMenu.keepAliveNo')}
        </ElTag>
      ),
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
      formatter: (row: SysMenuRow) => formatDateTime(row.updateTime),
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
      formatter: (row: SysMenuRow) => formatDateTime(row.createTime),
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 200,
      slot: 'actions',
    },
  ]);

  return { tableColumns };
}

export default useMenuTableColumns;

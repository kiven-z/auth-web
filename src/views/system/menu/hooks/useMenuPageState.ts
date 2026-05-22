import type { SysMenuListQuery, SysMenuListVO, SysMenuTreeNode } from '@/api/system/menu';
import { getMenuList, getMenuPage, type SysMenuPageQuery } from '@/api/system/menu';
import { useCreateModuleTableTreePageState } from '@/shared/hooks/useCreateModuleTableTreePageState';
import { reactive } from 'vue';

/**
 * 列表行（与后端 SysMenuListVO 一致）
 */
export type SysMenuRow = SysMenuListVO;

export type MenuViewMode = 'table' | 'tableTree' | 'tree';

/**
 * 菜单页状态挂在模块级，供 `index`、表格视图、树视图共用。
 * 若在各组件内分别调用工厂函数，会得到多份独立的 `viewMode`，
 * 导致分段器切换后 `refresh` 仍按默认 `table` 只拉分页数据、不刷新 `treeData`。
 */
const searchForm = reactive<SysMenuListQuery>({
  name: undefined,
  title: undefined,
  menuType: undefined,
  status: undefined,
  component: undefined,
});

const useMenuPageState = useCreateModuleTableTreePageState<SysMenuRow, SysMenuListVO, SysMenuTreeNode, MenuViewMode>({
  searchForm,
  defaultPageSize: 10,
  errorI18nKey: 'sysMenu.loadFailed',
  fetchPage: (q) => getMenuPage(q as unknown as SysMenuPageQuery),
  fetchFlatList: (p) => getMenuList((p ?? {}) as SysMenuListQuery),
  flatListParams: {},
  resetSearchFormWithoutRef: () => {
    searchForm.name = undefined;
    searchForm.title = undefined;
    searchForm.menuType = undefined;
    searchForm.status = undefined;
    searchForm.component = undefined;
  },
  initialViewMode: 'table',
});

export default useMenuPageState;

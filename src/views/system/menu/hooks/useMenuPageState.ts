import type { SysMenuListQuery, SysMenuListVO, SysMenuTreeNode } from '@/api/system/menu';
import { getMenuList, getMenuPage } from '@/api/system/menu';
import { useCreateModuleTableTreePageState } from '@/views/system/_shared/hooks/useCreateModuleTableTreePageState';
import { reactive, ref } from 'vue';

/**
 * 列表行
 */
export type SysMenuRow = SysMenuListVO;

export type MenuViewMode = 'table' | 'tree';

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

/** 树形视图关键词（与表格筛选独立） */
const treeKeyword = ref('');

const innerPageState = useCreateModuleTableTreePageState<SysMenuRow, SysMenuListVO, SysMenuTreeNode, MenuViewMode>({
  searchForm,
  defaultPageSize: 30,
  errorI18nKey: 'sysMenu.loadFailed',
  fetchPage: (q) => getMenuPage(q),
  fetchFlatList: () => getMenuList({}),
  flatListParams: {},
  initialViewMode: 'table',
});

function useMenuPageState() {
  const state = innerPageState();
  return { ...state, treeKeyword };
}

export default useMenuPageState;

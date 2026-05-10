import type { SysMenuListQuery, SysMenuListVO } from '@/api/system/menu';
import { getMenuList } from '@/api/system/menu';
import { handleTree } from '@/shared/lib/tree';
import { errorMessage } from '@/shared/messaging/message';
import type { SysMenuTreeNode } from '@/views/system/menu/utils/tree-keys';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/** 列表行（与后端 SysMenuListVO 一致） */
export type SysMenuRow = SysMenuListVO;

export type MenuViewMode = 'table' | 'tableTree' | 'tree';

/**
 * 菜单页：全量 list 接口 + 表格前端筛选（无分页）
 */
function useMenuPageState() {
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);

  /** 接口返回的原始扁平列表（最近一次请求） */
  const rawList = ref<SysMenuRow[]>([]);

  const tableData = ref<SysMenuRow[]>([]);
  const treeData = ref<SysMenuTreeNode[]>([]);

  const searchForm = reactive<SysMenuListQuery>({
    name: undefined,
    title: undefined,
    menuType: undefined,
    status: undefined,
    component: undefined,
  });

  /**
   * 按搜索条件过滤（表格视图）
   */
  const applyTableFilters = (list: SysMenuRow[]): SysMenuRow[] => {
    let out = [...list];
    if (searchForm.name) {
      const q = searchForm.name.toLowerCase();
      out = out.filter((m) => m.name.toLowerCase().includes(q));
    }
    if (searchForm.title) {
      out = out.filter((m) => m.title.includes(searchForm.title!));
    }
    if (searchForm.menuType !== undefined) {
      out = out.filter((m) => m.menuType === searchForm.menuType);
    }
    if (searchForm.status !== undefined) {
      out = out.filter((m) => m.status === searchForm.status);
    }
    if (searchForm.component) {
      out = out.filter((m) => (m.component ?? '').includes(searchForm.component!));
    }
    return out;
  };

  /**
   * 拉取全量列表并刷新表格数据
   */
  const fetchTableData = async () => {
    loading.value = true;
    try {
      const list = await getMenuList({});
      rawList.value = list ?? [];
      tableData.value = applyTableFilters(rawList.value);
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
      rawList.value = [];
      tableData.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 拉取全量列表并构建树（不带表格搜索条件，保证结构完整）
   */
  const fetchTreeData = async () => {
    loading.value = true;
    try {
      const list = await getMenuList({});
      rawList.value = list ?? [];
      treeData.value = handleTree([...(list ?? [])], 'id', 'parentId') as SysMenuTreeNode[];
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
      treeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  const handleSelectionChange = (value: SysMenuRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  const resetQuery = async (formRef?: FormInstance) => {
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.name = undefined;
      searchForm.title = undefined;
      searchForm.menuType = undefined;
      searchForm.status = undefined;
      searchForm.component = undefined;
    }
    await fetchTableData();
  };

  return {
    loading,
    selectedRows,
    rawList,
    tableData,
    treeData,
    searchForm,
    fetchTableData,
    fetchTreeData,
    resetQuery,
    handleSelectionChange,
  };
}

export default useMenuPageState;

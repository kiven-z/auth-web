import type { SysMenuListQuery, SysMenuListVO, SysMenuTreeNode } from '@/api/system/menu';
import { getMenuList, getMenuPage } from '@/api/system/menu';
import { handleTree } from '@/shared/lib/tree';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/** 列表行（与后端 SysMenuListVO 一致） */
export type SysMenuRow = SysMenuListVO;

export type MenuViewMode = 'table' | 'tableTree' | 'tree';

/**
 * 菜单页：表格走服务端分页；树视图走全量 list + `handleTree`（与 `@/shared/lib/tree` 一致，不另包一层树构建）。
 */
function useMenuPageState() {
  // 选中的行ID列表
  const selectedRows = ref<string[]>([]);
  // 加载状态
  const loading = ref(false);
  // 表格数据
  const tableData = ref<SysMenuRow[]>([]);
  // 树数据
  const treeData = ref<SysMenuTreeNode[]>([]);
  // 查看展示模式
  const viewMode = ref<MenuViewMode>('table');
  // 搜索表单
  const searchForm = reactive<SysMenuListQuery>({
    name: undefined,
    title: undefined,
    menuType: undefined,
    status: undefined,
    component: undefined,
  });
  // 分页
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
  });

  /**
   * 按当前页码与筛选条件拉取表格（不改变页码）
   */
  const fetchTableData = async () => {
    loading.value = true;
    try {
      const res = await getMenuPage({
        ...searchForm,
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      tableData.value = res.list ?? [];
      pagination.total = res.total ?? 0;
      if (typeof res.pageNo === 'number' && res.pageNo >= 1) {
        pagination.currentPage = res.pageNo;
      }
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
      tableData.value = [];
      pagination.total = 0;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 条件查询：回到第一页再请求（搜索 / 重置后使用）
   */
  const submitTableSearch = async () => {
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 分页大小变化
   * @param value 分页大小
   */
  const handlePageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 分页当前页变化
   * @param value 分页当前页
   */
  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

  /**
   * 拉取全量列表并构建树（不带表格筛选，保证结构完整）
   */
  const fetchTreeData = async () => {
    loading.value = true;
    try {
      const list = await getMenuList({});
      treeData.value = handleTree([...(list ?? [])], 'id', 'parentId') as SysMenuTreeNode[];
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
      treeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 多选变化
   * @param value 选中行
   */
  const handleSelectionChange = (value: SysMenuRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置筛选并查询
   * @param formRef 表单实例
   */
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
    await submitTableSearch();
  };

  /**
   * 刷新
   */
  const refresh = async () => {
    if (viewMode.value === 'table') {
      await fetchTableData();
    } else {
      await fetchTreeData();
    }
  };

  return {
    loading,
    selectedRows,
    tableData,
    treeData,
    searchForm,
    pagination,
    viewMode,
    fetchTableData,
    submitTableSearch,
    fetchTreeData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
    refresh,
  };
}

export default useMenuPageState;

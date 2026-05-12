import { getDeptList, getDeptPage, type SysDeptListVO, type SysDeptTreeNode } from '@/api/system/dept';
import { handleTree } from '@/shared/lib/tree';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 列表行（与后端 SysDeptListVO 一致）
 */
export type SysDeptRow = SysDeptListVO;

export type DeptViewMode = 'table' | 'tree';

/**
 * 部门页状态挂在模块级，供 `index`、表格视图、树视图共用。
 */
const selectedRows = ref<string[]>([]);
const loading = ref(false);
const tableData = ref<SysDeptRow[]>([]);
const treeData = ref<SysDeptTreeNode[]>([]);
const viewMode = ref<DeptViewMode>('table');
const searchForm = reactive({
  deptName: undefined as string | undefined,
  deptCode: undefined as string | undefined,
  status: undefined as boolean | undefined,
});
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
    const res = await getDeptPage({
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
    errorMessage(e, { defaultI18nKey: 'dept.loadFailed' });
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
 * 拉取全量列表并构建树
 */
const fetchTreeData = async () => {
  loading.value = true;
  try {
    const list = await getDeptList({});
    treeData.value = handleTree([...(list ?? [])], 'id', 'parentId') as SysDeptTreeNode[];
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'dept.loadFailed' });
    treeData.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * 多选变化
 * @param value 选中行
 */
const handleSelectionChange = (value: SysDeptRow[]) => {
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
    searchForm.deptName = undefined;
    searchForm.deptCode = undefined;
    searchForm.status = undefined;
  }
  await submitTableSearch();
};

/**
 * 刷新：按当前展示模式拉取对应数据
 */
const refresh = async () => {
  if (viewMode.value === 'table') {
    await fetchTableData();
  } else {
    await fetchTreeData();
  }
};

function useDeptPageState() {
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

export default useDeptPageState;

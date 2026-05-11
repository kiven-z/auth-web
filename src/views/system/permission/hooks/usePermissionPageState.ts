import { getPermissionPage, type SysPermissionPageRow } from '@/api/system/permission';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 权限分页列表页状态：查询条件、分页、表格数据与请求。
 */
function usePermissionPageState() {
  // 选中的行ID列表
  const selectedRows = ref<string[]>([]);
  // 加载状态
  const loading = ref(false);
  // 表格数据
  const tableData = ref<SysPermissionPageRow[]>([]);

  // 搜索表单
  const searchForm = reactive({
    permissionCode: undefined as string | undefined,
    permissionName: undefined as string | undefined,
    permissionType: undefined as number | undefined,
    status: undefined as boolean | undefined,
  });

  // 分页
  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 分页查询（不改变当前页码；分页器事件与重置后调用）。
   */
  const fetchTableData = async () => {
    loading.value = true;
    const query = { ...searchForm, pageIndex: pagination.currentPage, pageSize: pagination.pageSize };

    try {
      const page = await getPermissionPage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'permissions.loadFailed' });
    } finally {
      loading.value = false;
    }
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
   * 选择变化
   * @param value 选中行
   */
  const handleSelectionChange = (value: SysPermissionPageRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置筛选并回到第一页再拉取。
   * @param formRef 表单实例；缺省时手动清空 searchForm
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    formRef.resetFields();
    await fetchTableData();
  };

  return {
    tableData,
    loading,
    pagination,
    selectedRows,
    searchForm,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
  };
}

export default usePermissionPageState;

import { getRolePage, type SysRolePageRow } from '@/api/system/role';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 角色分页列表页状态：查询条件、分页、表格数据与请求。
 */
function useRolePageState() {
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);
  const tableData = ref<SysRolePageRow[]>([]);

  const searchForm = reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
    roleType: undefined as number,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 分页查询（不改变当前页码；分页器事件与重置后调用）。
   */
  const onSearch = async () => {
    loading.value = true;
    const query = { ...searchForm, pageIndex: pagination.currentPage, pageSize: pagination.pageSize };

    try {
      const page = await getRolePage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'roles.loadFailed' });
    } finally {
      loading.value = false;
    }
  };

  /**
   * 分页大小变化
   * @param value 分页大小
   */
  const onPageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await onSearch();
  };

  /**
   * 分页当前页变化
   * @param value 分页当前页
   */
  const onPageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await onSearch();
  };

  /**
   * 选择变化
   * @param value 选中行
   */
  const onSelectionChange = (value: SysRolePageRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置筛选并回到第一页再拉取。
   * @param formRef 表单实例；缺省时手动清空 searchForm
   */
  const onReset = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    formRef.resetFields();
    await onSearch();
  };

  return {
    tableData,
    loading,
    pagination,
    selectedRows,
    searchForm,
    onSearch,
    onReset,
    onPageSizeChange,
    onPageCurrentChange,
    onSelectionChange,
  };
}

export default useRolePageState;

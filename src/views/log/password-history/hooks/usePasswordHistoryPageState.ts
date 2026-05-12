import { getPasswordHistoryPage } from '@/api/log/password-history';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 密码历史日志分页列表页状态：查询条件、分页、表格数据与请求。
 */
function usePasswordHistoryPageState() {
  // 加载状态
  const loading = ref(false);
  // 表格数据
  const tableData = ref<any[]>([]);

  // 搜索表单
  const searchForm = reactive({
    userId: undefined,
    changeTimeStart: undefined,
    changeTimeEnd: undefined,
    changeIp: undefined,
  });

  // 分页
  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 获取表格数据
   * @returns 获取表格数据后，更新表格数据
   */
  const fetchTableData = async () => {
    loading.value = true;
    const query: Record<string, any> = {
      ...searchForm,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    };
    try {
      const page = await getPasswordHistoryPage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'passwordHistory.loadFailed' });
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
   * 重置筛选并回到第一页再拉取。
   * @param formRef 表单实例
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    formRef?.resetFields();
    await fetchTableData();
  };

  return {
    tableData,
    loading,
    pagination,
    searchForm,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
  };
}

export default usePasswordHistoryPageState;

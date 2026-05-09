import { getPasswordHistoryPage } from '@/api/log/password-history';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 密码历史日志分页列表页状态：查询条件、分页、表格数据与请求。
 */
function usePasswordHistoryPageState() {
  const loading = ref(false);
  const tableData = ref<any[]>([]);

  const searchForm = reactive({
    userId: undefined as string | undefined,
    changeTimeStart: undefined as string | undefined,
    changeTimeEnd: undefined as string | undefined,
    changeIp: undefined as string | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 分页查询密码历史日志
   */
  const fetchTableData = async () => {
    loading.value = true;
    const query: Record<string, any> = {
      ...searchForm,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    };
    Object.keys(query).forEach((key) => {
      if (query[key] === undefined || query[key] === '' || (Array.isArray(query[key]) && query[key].length === 0)) {
        delete query[key];
      }
    });
    try {
      const page = await getPasswordHistoryPage(query as any);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'log.passwordHistory.loadFailed' });
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

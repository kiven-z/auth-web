import { getLoginLogPage } from '@/api/log/login-log';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 登录日志分页：查询条件、分页、表格数据与请求。
 */
function useLoginLogPageState() {
  const loading = ref(false);
  const tableData = ref<any[]>([]);

  const searchForm = reactive({
    userId: undefined as string | undefined,
    loginTimeStart: undefined as string | undefined,
    loginTimeEnd: undefined as string | undefined,
    loginResult: undefined as number | undefined,
    loginType: undefined as string | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

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
      const page = await getLoginLogPage(query as any);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'log.loginLog.loadFailed' });
    } finally {
      loading.value = false;
    }
  };

  const handlePageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await fetchTableData();
  };

  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

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

export default useLoginLogPageState;

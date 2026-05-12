import { getAuthorizationAuditPage } from '@/api/log/authorization-audit';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 权限决策审计日志分页：查询条件、分页、表格数据与请求。
 */
function useAuthorizationAuditPageState() {
  // 加载状态
  const loading = ref(false);
  // 表格数据
  const tableData = ref<any[]>([]);
  // 搜索表单
  const searchForm = reactive({
    eventType: undefined as string | undefined,
    decisionReason: undefined as string | undefined,
    className: undefined as string | undefined,
    createUserId: undefined as number | undefined,
    operatorUsername: undefined as string | undefined,
  });

  // 分页
  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 获取表格数据
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
      const page = await getAuthorizationAuditPage(query as any);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationAudit.loadFailed' });
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
   * 重置筛选并查询
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

export default useAuthorizationAuditPageState;

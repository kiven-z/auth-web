import { type EmailTemplatePageRow, getEmailTemplatePage } from '@/api/system/email-template';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 邮件模板列表页：查询、分页、表格数据与请求。
 */
function useEmailTemplatePageState() {
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);
  const tableData = ref<EmailTemplatePageRow[]>([]);

  const searchForm = reactive({
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    status: undefined as boolean | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 分页查询。
   */
  const fetchTableData = async () => {
    loading.value = true;
    const query = { ...searchForm, pageIndex: pagination.currentPage, pageSize: pagination.pageSize };
    try {
      const page = await getEmailTemplatePage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
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
   * @param value 当前页
   */
  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

  /**
   * 多选变化
   * @param value 选中行
   */
  const handleSelectionChange = (value: EmailTemplatePageRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置筛选并查询
   * @param formRef 表单实例
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.templateCode = '';
      searchForm.templateName = '';
      searchForm.subject = '';
      searchForm.status = undefined;
    }
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

export default useEmailTemplatePageState;

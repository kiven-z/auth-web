import {
  type EmailTemplatePageQuery,
  type EmailTemplatePageRow,
  getEmailTemplatePage,
} from '@/api/system/email-template';
import { message } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板列表页：查询、分页、表格数据与请求。
 */
function useEmailTemplatePageState() {
  const { t } = useI18n();
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);
  const tableData = ref<EmailTemplatePageRow[]>([]);

  const searchForm = reactive({
    templateCode: '',
    templateName: '',
    subject: '',
    status: undefined as number | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 组装分页查询参数：空字符串不传。
   */
  const buildPageQuery = (): EmailTemplatePageQuery => {
    const raw = toRaw(searchForm);
    const query: EmailTemplatePageQuery = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    };
    const templateCode = typeof raw.templateCode === 'string' ? raw.templateCode.trim() : '';
    const templateName = typeof raw.templateName === 'string' ? raw.templateName.trim() : '';
    const subject = typeof raw.subject === 'string' ? raw.subject.trim() : '';
    if (templateCode) {
      query.templateCode = templateCode;
    }
    if (templateName) {
      query.templateName = templateName;
    }
    if (subject) {
      query.subject = subject;
    }
    if (raw.status !== undefined && raw.status !== null) {
      query.status = raw.status;
    }
    return query;
  };

  /**
   * 条件查询：回到第一页再请求。
   */
  const onQuery = async () => {
    pagination.currentPage = 1;
    await onSearch();
  };

  /**
   * 分页查询。
   */
  const onSearch = async () => {
    loading.value = true;
    const query = buildPageQuery();
    try {
      const page = await getEmailTemplatePage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
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
   * @param value 当前页
   */
  const onPageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await onSearch();
  };

  /**
   * 多选变化
   * @param value 选中行
   */
  const onSelectionChange = (value: EmailTemplatePageRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置筛选并查询
   * @param formRef 表单实例
   */
  const onReset = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.templateCode = '';
      searchForm.templateName = '';
      searchForm.subject = '';
      searchForm.status = undefined;
    }
    await onSearch();
  };

  return {
    tableData,
    loading,
    pagination,
    selectedRows,
    searchForm,
    onSearch,
    onQuery,
    onReset,
    onPageSizeChange,
    onPageCurrentChange,
    onSelectionChange,
  };
}

export default useEmailTemplatePageState;

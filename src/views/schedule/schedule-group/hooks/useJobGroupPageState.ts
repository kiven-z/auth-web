import { getJobGroupPage, type SysJobGroupPageQuery, type SysJobGroupPageRow } from '@/api/schedule/job-group';
import { message } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务分组分页列表页状态：查询条件、分页、表格数据与请求。
 */
function useJobGroupPageState() {
  const { t } = useI18n();
  const loading = ref(false);
  const tableData = ref<SysJobGroupPageRow[]>([]);

  const searchForm = reactive({
    groupCode: '',
    groupName: '',
    status: undefined as number | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 组装分页查询参数：空字符串不传，与后端契约一致。
   */
  const buildPageQuery = (): SysJobGroupPageQuery => {
    const query: SysJobGroupPageQuery = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    };
    const groupCode = typeof searchForm.groupCode === 'string' ? searchForm.groupCode.trim() : '';
    const groupName = typeof searchForm.groupName === 'string' ? searchForm.groupName.trim() : '';
    if (groupCode) {
      query.groupCode = groupCode;
    }
    if (groupName) {
      query.groupName = groupName;
    }
    if (searchForm.status !== undefined && searchForm.status !== null) {
      query.status = searchForm.status;
    }
    return query;
  };

  /**
   * 条件查询：回到第一页再请求（避免在末页改条件后仍请求空页）。
   */
  const onQuery = async () => {
    pagination.currentPage = 1;
    await onSearch();
  };

  /**
   * 分页查询（不改变当前页码；分页器事件与重置后调用）。
   */
  const onSearch = async () => {
    loading.value = true;
    const query = buildPageQuery();
    try {
      const page = await getJobGroupPage(query);
      tableData.value = page.list ?? [];
      pagination.total = Number(page.total);
      pagination.currentPage = Number(page.pageNo);
      pagination.pageSize = Number(page.pageSize);
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('scheduleGroup.loadFailed');
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
   * @param value 分页当前页
   */
  const onPageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await onSearch();
  };

  /**
   * 重置筛选并回到第一页再拉取。
   * @param formRef 表单实例；缺省时手动清空 searchForm
   */
  const onReset = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.groupCode = '';
      searchForm.groupName = '';
      searchForm.status = undefined;
    }
    await onSearch();
  };

  return {
    tableData,
    loading,
    pagination,
    searchForm,
    onSearch,
    onQuery,
    onReset,
    onPageSizeChange,
    onPageCurrentChange,
  };
}

export default useJobGroupPageState;

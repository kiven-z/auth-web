import { getJobGroupPage, type SysJobGroupPageRow } from '@/api/schedule/job-group';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/**
 * 任务分组分页列表页状态：查询条件、分页、表格数据与请求。
 */
function useJobGroupPageState() {
  const loading = ref(false);
  const tableData = ref<SysJobGroupPageRow[]>([]);

  // 默认为 undefined 没有值时不会传递
  const searchForm = reactive({
    groupCode: undefined,
    groupName: undefined,
    status: undefined,
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
      const page = await getJobGroupPage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
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
    formRef.resetFields();
    await onSearch();
  };

  return {
    tableData,
    loading,
    pagination,
    searchForm,
    onSearch,
    onReset,
    onPageSizeChange,
    onPageCurrentChange,
  };
}

export default useJobGroupPageState;

import { SysRolePageQuery, SysRolePageRow, getRolePage } from "@/api/system/role";
import { message } from "@/shared/messaging/message";
import { FormInstance } from "element-plus";
import { reactive, ref, toRaw } from "vue";
import { useI18n } from "vue-i18n";

function useRolePageState() {
const { t } = useI18n();
const selectedRows = ref<string[]>([]);
const loading = ref(false);
const tableData = ref<SysRolePageRow[]>([]);

const searchForm = reactive({ 
  roleCode: '',
  roleName: '',
  status: undefined,
  roleType: undefined,
});

const pagination = reactive({
  total: 0,
  pageSize: 30,
  currentPage: 1,
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [15, 30, 50, 100, 200, 300],
});

/**
 * 分页查询
 */
async function onSearch() {
  loading.value = true;

  const query: SysRolePageQuery = {
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize,
    ...toRaw(searchForm),
  };

  try {
    const page = await getRolePage(query);
    tableData.value = page.list ?? [];
    pagination.total = Number(page.total);
    pagination.currentPage = Number(page.pageNo);
    pagination.pageSize = Number(page.pageSize);
  } catch (error: unknown) {
    const text = error instanceof Error && error.message ? error.message : t('roles.loadFailed');
    message(text, { type: 'error' });
  } finally {
    loading.value = false;
  }
}

/**
 * 分页大小变化
 * @param value 分页大小
 */
async function onPageSizeChange(value: number) {
  pagination.pageSize = value;
  await onSearch();
}

/**
 * 分页当前页变化
 * @param value 分页当前页
 */
async function onPageCurrentChange(value: number) {
  pagination.currentPage = value;
  await onSearch();
}

/**
 * 选择变化
 * @param value 选择
 */
  async function onSelectionChange(value: SysRolePageRow[]) {
  selectedRows.value = value.map((item) => item.id);
}

/**
 * 重置筛选并重新拉取第一页
 * @param forEl 表单实例
 */
async function onReset(forEl: FormInstance | undefined) {
  if (forEl) {
    return;
  }

  forEl.resetFields();
  await onSearch();
}
  
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
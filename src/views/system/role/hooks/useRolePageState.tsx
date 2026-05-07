import { getRolePage, type SysRolePageQuery, type SysRolePageRow } from '@/api/system/role';
import { message } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色分页列表页状态：查询条件、分页、表格数据与请求。
 */
function useRolePageState() {
  const { t } = useI18n();
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);
  const tableData = ref<SysRolePageRow[]>([]);

  const searchForm = reactive({
    roleCode: '',
    roleName: '',
    status: undefined as number | undefined,
    roleType: undefined as number | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  /**
   * 组装分页查询参数：空字符串不传，与后端契约一致。
   */
  const buildPageQuery = (): SysRolePageQuery => {
    const raw = toRaw(searchForm);
    const query: SysRolePageQuery = {
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    };
    const roleCode = typeof raw.roleCode === 'string' ? raw.roleCode.trim() : '';
    const roleName = typeof raw.roleName === 'string' ? raw.roleName.trim() : '';
    if (roleCode) {
      query.roleCode = roleCode;
    }
    if (roleName) {
      query.roleName = roleName;
    }
    if (raw.status !== undefined && raw.status !== null) {
      query.status = raw.status;
    }
    if (raw.roleType !== undefined && raw.roleType !== null) {
      query.roleType = raw.roleType;
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
      const page = await getRolePage(query);
      tableData.value = page.list ?? [];
      pagination.total = page.total;
      pagination.currentPage = page.pageNo;
      pagination.pageSize = page.pageSize;
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('roles.loadFailed');
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
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.roleCode = '';
      searchForm.roleName = '';
      searchForm.status = undefined;
      searchForm.roleType = undefined;
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

export default useRolePageState;

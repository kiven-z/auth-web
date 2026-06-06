import { getDeptList, getDeptPage, type SysDeptListVO, type SysDeptTreeNode } from '@/api/system/dept';
import { useCreateModuleTableTreePageState } from '@/views/system/_shared/hooks/useCreateModuleTableTreePageState';
import { reactive } from 'vue';

/**
 * 列表行（与后端 SysDeptListVO 一致）
 */
export type SysDeptRow = SysDeptListVO;

export type DeptViewMode = 'table' | 'tree';

/**
 * 部门页状态挂在模块级，供 `index`、表格视图、树视图共用。
 */
const searchForm = reactive({
  deptName: undefined,
  deptCode: undefined,
  status: undefined,
});

const useDeptPageState = useCreateModuleTableTreePageState<SysDeptRow, SysDeptListVO, SysDeptTreeNode, DeptViewMode>({
  searchForm,
  defaultPageSize: 30,
  errorI18nKey: 'dept.loadFailed',
  fetchPage: (query) => getDeptPage(query),
  fetchFlatList: () => getDeptList({}),
  flatListParams: {},
  resetSearchFormWithoutRef: () => {
    searchForm.deptName = undefined;
    searchForm.deptCode = undefined;
    searchForm.status = undefined;
  },
  initialViewMode: 'table',
});

export default useDeptPageState;

import {
  getDeptList,
  getDeptPage,
  type SysDeptListVO,
  type SysDeptPageQuery,
  type SysDeptTreeNode,
} from '@/api/system/dept';
import { createModuleTableTreePageState } from '@/shared/hooks/createModuleTableTreePageState';
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
  deptName: undefined as string | undefined,
  deptCode: undefined as string | undefined,
  status: undefined as boolean | undefined,
});

const useDeptPageState = createModuleTableTreePageState<SysDeptRow, SysDeptListVO, SysDeptTreeNode, DeptViewMode>({
  searchForm,
  defaultPageSize: 10,
  errorI18nKey: 'dept.loadFailed',
  fetchPage: (q) => getDeptPage(q as unknown as SysDeptPageQuery),
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

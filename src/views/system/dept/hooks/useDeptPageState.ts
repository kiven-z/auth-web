import { getDeptList, getDeptPage, type SysDeptListVO, type SysDeptTreeNode } from '@/api/system/dept';
import { useCreateModuleTableTreePageState } from '@/views/system/_shared/hooks/useCreateModuleTableTreePageState';
import { reactive, ref } from 'vue';

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

/** 树形视图关键词（与表格筛选独立） */
const treeKeyword = ref('');

const innerPageState = useCreateModuleTableTreePageState<SysDeptRow, SysDeptListVO, SysDeptTreeNode, DeptViewMode>({
  searchForm,
  defaultPageSize: 30,
  errorI18nKey: 'dept.loadFailed',
  fetchPage: (query) => getDeptPage(query),
  fetchFlatList: () => {
    const keyword = treeKeyword.value;
    return getDeptList(keyword ? { keyword } : {});
  },
  flatListParams: {},
  initialViewMode: 'table',
});

function useDeptPageState() {
  const state = innerPageState();
  return { ...state, treeKeyword };
}

export default useDeptPageState;

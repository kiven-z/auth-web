import {
  getInAppMessageCategoryList,
  type InAppMessageCategoryPageRow,
  type InAppMessageCategoryQuery,
} from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { handleTree } from '@/shared/utils/tree/tree';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/** 视图模式 */
export type InAppCategoryViewMode = 'table' | 'tree';

/**
 * 分类页状态挂在模块级，供 index、树表、树面板共用同一套 viewMode / 数据
 */
const searchForm = reactive<InAppMessageCategoryQuery>({
  code: undefined,
  name: undefined,
  status: undefined,
  rootOnly: undefined,
});

const treeData = ref<InAppMessageCategoryPageRow[]>([]);
const selectedRows = ref<string[]>([]);
const loading = ref(false);
const viewMode = ref<InAppCategoryViewMode>('table');

/**
 * 按当前筛选拉取扁平列表并建树（树表与树视图共用）
 */
async function fetchTreeData() {
  loading.value = true;
  try {
    const list = await getInAppMessageCategoryList({
      code: searchForm.code,
      name: searchForm.name,
      status: searchForm.status,
      rootOnly: searchForm.rootOnly,
    });
    treeData.value = handleTree([...(list ?? [])], 'id', 'parentId') as InAppMessageCategoryPageRow[];
  } catch (error: unknown) {
    errorMessage(error);
    treeData.value = [];
  } finally {
    loading.value = false;
  }
}

/**
 * 重置筛选并重新拉取
 * @param formRef 可选表单实例，用于 resetFields
 */
async function resetQuery(formRef?: FormInstance) {
  formRef?.resetFields();
  await fetchTreeData();
}

/**
 * 站内信业务分类页状态（全量建树，不分页）
 * @returns 树数据、筛选与刷新方法
 */
function useInAppCategoryPageState() {
  return {
    loading,
    treeData,
    selectedRows,
    searchForm,
    viewMode,
    fetchTreeData,
    resetQuery,
    refresh: fetchTreeData,
  };
}

export default useInAppCategoryPageState;

import type { TableActionDeps } from '@/api/common';
import type { SysDeptListVO } from '@/api/system/dept';
import { deleteDepts, getDeptDetail, getDeptList } from '@/api/system/dept';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/useBatchDeleteAction';
import { errorMessage, message } from '@/shared/messaging/message';
import DeptDescriptionDialog from '@/views/system/dept/components/DeptDescriptionDialog.vue';
import type { DeptViewMode, SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import type { Ref } from 'vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

const ROOT_PARENT_ID = '0';

export interface DeptTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
  viewMode: Ref<DeptViewMode>;
  selectedRows: Ref<string[]>;
}

/**
 * 部门行操作：详情、删除等（编辑/新增表单待后续接入）
 */
function useDeptTableAction(deps: DeptTableActionDeps) {
  const { t } = useI18n();
  const { refresh } = deps;

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteDepts,
    onSuccess: refresh,
    errorDefaultI18nKey: 'dept.deleteFailed',
  });

  /**
   * 解析父部门展示名
   */
  const resolveParentDeptLabel = (detailParentId: string, flatList: SysDeptListVO[]): string => {
    if (!detailParentId || detailParentId === ROOT_PARENT_ID) {
      return t('dept.parentTopLevel');
    }
    const parent = flatList.find((item) => item.id === detailParentId);
    return parent?.deptName ?? detailParentId;
  };

  /**
   * 打开详情弹窗
   * @param row 表格行或树节点数据
   */
  const openDetailDialog = async (row: SysDeptRow) => {
    try {
      const [detail, flatList] = await Promise.all([getDeptDetail(row.id), getDeptList()]);
      const parentDeptLabel = resolveParentDeptLabel(detail.parentId, flatList);

      addDialog({
        title: t('dept.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(DeptDescriptionDialog, { data: detail, parentDeptLabel }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'dept.loadDetailFailed' });
    }
  };

  /**
   * 打开新增（表单未实现）
   */
  const openCreateDialog = () => {
    message('部门新增功能开发中', { type: 'warning' });
  };

  /**
   * 打开编辑（表单未实现）
   */
  const openEditDialog = (_row: SysDeptRow) => {
    void _row;
    message('部门编辑功能开发中', { type: 'warning' });
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteBatchRows,
  };
}

export default useDeptTableAction;

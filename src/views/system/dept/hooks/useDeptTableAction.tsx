import type { TableActionDeps } from '@/api/common';
import type { SysDeptListVO } from '@/api/system/dept';
import { getDeptDetail, getDeptList } from '@/api/system/dept';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/shared/messaging/message';
import DeptDescriptionDialog from '@/views/system/dept/components/DeptDescriptionDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

const ROOT_PARENT_ID = '0';

/**
 * 部门表格操作：详情弹窗
 */
function useDeptTableAction(deps: TableActionDeps) {
  const { t } = useI18n();
  void deps;

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
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysDeptListVO) => {
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

  return {
    openDetailDialog,
  };
}

export default useDeptTableAction;

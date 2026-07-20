import type { TableActionDeps } from '@/api/common';
import {
  createDept,
  deleteDepts,
  DEPT_ROOT_PARENT_ID,
  getDeptDetail,
  getDeptList,
  type SysDeptCreateForm,
  type SysDeptListVO,
  type SysDeptUpdateForm,
  updateDept,
} from '@/api/system/dept';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { errorMessage } from '@/services/feedback/message';
import DeptDescriptionDialog from '@/views/system/dept/components/DeptDescriptionDialog.vue';
import DeptFormDialog from '@/views/system/dept/components/DeptFormDialog.vue';
import type { DeptViewMode, SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const ROOT_PARENT_ID = DEPT_ROOT_PARENT_ID;

export interface DeptTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
  viewMode: Ref<DeptViewMode>;
  selectedRows: Ref<string[]>;
}

/**
 * 部门行操作：详情、新增、删除等
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useDeptTableAction(deps: DeptTableActionDeps) {
  const { t } = useI18n();
  const { refresh } = deps;
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteDepts,
    onSuccess: refresh,
  });

  /**
   * 解析父部门展示名
   */
  const resolveParentDeptLabel = (detailParentId: string, flatList: SysDeptListVO[]): string => {
    if (!detailParentId || detailParentId === ROOT_PARENT_ID) {
      return t('dept.field.parentTopLevel');
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
        title: t('dept.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(DeptDescriptionDialog, { data: detail, parentDeptLabel }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开新增弹窗
   * @param parentRow 树视图「新增下级」时传入，预填父部门
   */
  const openCreateDialog = (parentRow?: SysDeptRow) => {
    const dialogFormRef = ref<FormOverlayExpose<SysDeptCreateForm> | null>(null);

    addDialog({
      title: t('dept.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(DeptFormDialog, { ref: dialogFormRef, form: parentRow as SysDeptCreateForm }),
      beforeSure: createFormBeforeSure<SysDeptCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createDept(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行或树节点
   */
  const openEditDialog = async (row: SysDeptRow) => {
    try {
      const detail = await getDeptDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysDeptUpdateForm> | null>(null);

      addDialog({
        title: t('dept.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(DeptFormDialog, { ref: dialogFormRef, form: detail }),
        beforeSure: createFormBeforeSure<SysDeptUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateDept(formData);
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteBatchRows,
  };
}

export default useDeptTableAction;

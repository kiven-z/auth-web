import type { TableActionDeps } from '@/api/common';
import type { SysDeptCreateForm, SysDeptListVO, SysDeptUpdateForm } from '@/api/system/dept';
import { createDept, deleteDepts, getDeptDetail, getDeptList, updateDept } from '@/api/system/dept';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/table/useFormOverlaySubmit';
import { errorMessage } from '@/shared/messaging/message';
import DeptDescriptionDialog from '@/views/system/dept/components/DeptDescriptionDialog.vue';
import DeptFormDialog from '@/views/system/dept/components/DeptFormDialog.vue';
import type { DeptViewMode, SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import { DEPT_ROOT_PARENT_ID } from '@/views/system/dept/utils/dept-parent';
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
 */
function useDeptTableAction(deps: DeptTableActionDeps) {
  const { t } = useI18n();
  const { refresh } = deps;
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteDepts,
    onSuccess: refresh,
    errorDefaultI18nKey: 'tips.deleteFailed',
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
   * 打开新增弹窗
   * @param parentRow 树视图「新增下级」时传入，预填父部门
   */
  const openCreateDialog = (parentRow?: SysDeptRow) => {
    const initialForm: SysDeptCreateForm = {
      parentId: parentRow?.id ?? DEPT_ROOT_PARENT_ID,
      deptName: '',
      deptCode: '',
      status: true,
      orderNum: 0,
    };
    const dialogFormRef = ref<FormOverlayExpose<SysDeptCreateForm> | null>(null);

    addDialog({
      title: t('dept.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(DeptFormDialog, { ref: dialogFormRef, form: initialForm }),
      beforeSure: createFormBeforeSure<SysDeptCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'tips.addFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createDept({
            ...formPayload,
            parentId: formPayload.parentId || DEPT_ROOT_PARENT_ID,
          });
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
      const formPayload: SysDeptUpdateForm = {
        id: row.id,
        parentId: detail.parentId || DEPT_ROOT_PARENT_ID,
        deptName: detail.deptName,
        deptCode: detail.deptCode,
        status: detail.status,
        orderNum: detail.orderNum ?? 0,
        remark: detail.remark ?? '',
      };

      const dialogFormRef = ref<FormOverlayExpose<SysDeptUpdateForm> | null>(null);

      addDialog({
        title: t('dept.dialogEditTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(DeptFormDialog, { ref: dialogFormRef, form: formPayload }),
        beforeSure: createFormBeforeSure<SysDeptUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          errorI18nKey: 'tips.editFailed',
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateDept(row.id, {
              ...formData,
              id: row.id,
              parentId: formData.parentId || DEPT_ROOT_PARENT_ID,
            });
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'dept.loadDetailFailed' });
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

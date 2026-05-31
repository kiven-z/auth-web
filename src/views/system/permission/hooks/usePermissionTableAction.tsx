import type { TableActionDeps } from '@/api/common';
import type { SysPermissionCreateForm, SysPermissionPageRow } from '@/api/system/permission';
import { createPermission } from '@/api/system/permission';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/useFormOverlaySubmit';
import PermissionFormDialog from '@/views/system/permission/components/PermissionFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限表格操作：弹窗与写接口
 */
function usePermissionTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysPermissionCreateForm> | null>(null);

    addDialog({
      title: t('permissions.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PermissionFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysPermissionCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'permissions.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createPermission(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /** 查看详情 — TODO */
  const openDetailDialog = async (_row: SysPermissionPageRow) => {
    void _row;
  };

  /** 编辑 — TODO */
  const openEditDialog = async (_row: SysPermissionPageRow) => {
    void _row;
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
  };
}

export default usePermissionTableAction;

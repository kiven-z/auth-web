import type { TableActionDeps } from '@/api/common';
import {
  createMenu,
  deleteMenus,
  getMenuDetail,
  type MenuForm,
  updateMenu,
  updateMenuBatchStatus,
} from '@/api/system/menu';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage, message } from '@/ui/feedback/message';
import MenuDialog from '@/views/system/menu/components/MenuDialog.vue';
import type { MenuViewMode, SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { detailToForm } from '@/views/system/menu/utils/menu-form-mapper';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 菜单表格操作依赖 */
interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
  viewMode: Ref<MenuViewMode>;
  selectedRows: Ref<string[]>;
}

/**
 * 菜单表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useMenuTableAction(deps: MenuTableActionDeps) {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { refresh } = deps;
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteMenus,
    onSuccess: refresh,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

  /**
   * 打开创建抽屉
   */
  const openCreateDialog = () => {
    const drawerFormRef = ref<FormOverlayExpose<MenuForm> | null>(null);

    addDrawer({
      title: t('sysMenu.addDialogTitle'),
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(MenuDialog, {
          ref: drawerFormRef,
          isFormDisabled: false,
        }),
      beforeSure: createFormBeforeSure<MenuForm>({
        formExposeRef: drawerFormRef,
        errorI18nKey: 'sysMenu.saveFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createMenu(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑抽屉
   * @param row 行数据
   */
  const openEditDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);
      const formData = detailToForm(detail);
      const drawerFormRef = ref<FormOverlayExpose<MenuForm> | null>(null);

      addDrawer({
        title: t('sysMenu.editDialogTitle'),
        size: '80%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(MenuDialog, {
            ref: drawerFormRef,
            form: formData,
            isFormDisabled: false,
          }),
        beforeSure: createFormBeforeSure<MenuForm>({
          formExposeRef: drawerFormRef,
          errorI18nKey: 'sysMenu.saveFailed',
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateMenu(formPayload);
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);
      const formData = detailToForm(detail);

      addDialog({
        title: t('sysMenu.detailDialogTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () =>
          h(MenuDialog, {
            form: formData,
            isFormDisabled: true,
          }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  /**
   * 批量更新状态
   * @param ids 行ID列表
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) {
      return;
    }
    try {
      await updateMenuBatchStatus({ ids, status: enabled });
      message(t('tips.editSuccess'), { type: 'success' });
      await refresh();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'sysMenu.statusFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useMenuTableAction;

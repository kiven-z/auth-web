import type { TableActionDeps } from '@/api/common';
import type { MenuForm } from '@/api/system/menu';
import { createMenu, deleteMenus, getMenuDetail, updateMenu, updateMenuBatchStatus } from '@/api/system/menu';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import MenuDialog from '@/views/system/menu/components/MenuDialog.vue';
import type { MenuViewMode, SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { createEmptyMenuForm, detailToForm, formToSaveRequest } from '@/views/system/menu/utils/menu-form-mapper';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
  viewMode: Ref<MenuViewMode>;
  selectedRows: Ref<string[]>;
}

type MenuDialogExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: MenuForm;
};

function useMenuTableAction(deps: MenuTableActionDeps) {
  const { t } = useI18n();

  const { refresh } = deps;

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    const dlgRef = ref<MenuDialogExpose | null>(null);
    addDrawer({
      title: t('sysMenu.addDialogTitle'),
      size: '50%',
      direction: 'ltr',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      props: { form: createEmptyMenuForm(), isFormDisabled: false },
      contentRenderer: () => h(MenuDialog, { ref: dlgRef }),
      beforeSure: async (done) => {
        try {
          const ok = await dlgRef.value?.formRef?.validate().catch(() => false);
          if (!ok) {
            return;
          }
          const f = dlgRef.value?.form;
          if (!f) {
            return;
          }
          await createMenu(formToSaveRequest(f));
          message(t('tips.addSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (e: unknown) {
          errorMessage(e, { defaultI18nKey: 'sysMenu.saveFailed' });
        }
      },
    });
  };

  /**
   * 打开编辑对话框
   * @param row 行数据
   */
  const openEditDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);
      const form = detailToForm(detail);
      const dlgRef = ref<MenuDialogExpose | null>(null);
      addDrawer({
        title: t('sysMenu.editDialogTitle'),
        size: '50%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        props: { form, isFormDisabled: false },
        contentRenderer: () => h(MenuDialog, { ref: dlgRef }),
        beforeSure: async (done) => {
          try {
            const ok = await dlgRef.value?.formRef?.validate().catch(() => false);
            if (!ok) {
              return;
            }
            const f = dlgRef.value?.form;
            if (!f?.id) {
              return;
            }
            await updateMenu({ ...formToSaveRequest(f), id: f.id });
            message(t('tips.editSuccess'), { type: 'success' });
            await refresh();
            done();
          } catch (e: unknown) {
            errorMessage(e, { defaultI18nKey: 'sysMenu.saveFailed' });
          }
        },
      });
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);
      const form = detailToForm(detail);
      addDialog({
        title: t('sysMenu.detailDialogTitle'),
        width: '920px',
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        props: { form, isFormDisabled: true },
        contentRenderer: () => h(MenuDialog),
      });
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  /**
   * 批量删除（单行传 [row.id]，未传 ids 时使用表格多选）
   * @param ids 主键列表，可选
   */
  const deleteBatchRows = async (ids?: string[]) => {
    ids = ids || deps.selectedRows.value;

    const ok = await deleteConfirm();
    if (!ok) {
      return;
    }

    try {
      await deleteMenus(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      deps.selectedRows.value = [];
      await refresh();
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.deleteFailed' });
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
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.statusFailed' });
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

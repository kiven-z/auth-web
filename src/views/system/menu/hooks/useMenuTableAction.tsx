import { createMenu, deleteMenus, getMenuDetail, updateMenu, updateMenuBatchStatus } from '@/api/system/menu';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import type { MenuForm } from '@/types/system';
import MenuDialog from '@/views/system/menu/components/MenuDialog.vue';
import type { MenuViewMode, SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { createEmptyMenuForm, detailToForm, formToSaveRequest } from '@/views/system/menu/utils/menu-form-mapper';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/api/common';

export interface MenuTableActionDeps extends TableActionDeps {
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
    addDialog({
      title: t('sysMenu.addDialogTitle'),
      width: '920px',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      props: { formInline: createEmptyMenuForm(), isFormDisabled: false },
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
      const formInline = detailToForm(detail);
      const dlgRef = ref<MenuDialogExpose | null>(null);
      addDialog({
        title: t('sysMenu.editDialogTitle'),
        width: '920px',
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        props: { formInline, isFormDisabled: false },
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
      const formInline = detailToForm(detail);
      addDialog({
        title: t('sysMenu.detailDialogTitle'),
        width: '920px',
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        props: { formInline, isFormDisabled: true },
        contentRenderer: () => h(MenuDialog),
      });
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  /**
   * 删除
   * @param ids 行ID列表
   */
  const handleDelete = async (ids: string[]) => {
    if (ids.length <= 0) {
      return;
    }
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
      await updateMenuBatchStatus({ ids, status: enabled ? 0 : 1 });
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
    handleDelete,
    batchUpdateStatus,
  };
}

export default useMenuTableAction;

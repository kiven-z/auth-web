import type { InAppMessageCategoryFormModel, InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
import {
  createInAppMessageCategory,
  getInAppMessageCategoryById,
  updateInAppMessageCategory,
} from '@/api/message/in-app-category';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import InAppCategoryFormDialog from '@/views/message/in-app-category/components/InAppCategoryFormDialog.vue';
import { IN_APP_CATEGORY_ROOT_PARENT_ID } from '@/views/message/in-app-category/constants/root';
import useInAppCategoryDetailColumns from '@/views/message/in-app-category/hooks/useInAppCategoryDetailColumns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface InAppCategoryTableActionDeps {
  /** 新增/编辑成功后刷新树数据 */
  refresh: () => Promise<void>;
}

/**
 * 站内信业务分类表格/树操作
 * @param deps 操作依赖
 * @returns 操作方法
 */
function useInAppCategoryTableAction(deps: InAppCategoryTableActionDeps) {
  const { t } = useI18n();
  const { refresh } = deps;
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { detailColumns } = useInAppCategoryDetailColumns();

  /**
   * 打开新增弹窗
   * @param parentRow 传入大类时预填为小类父级；小类不可再挂子级
   */
  const openCreateDialog = (parentRow?: InAppMessageCategoryPageRow) => {
    // 仅大类可作父级；小类直接拒绝
    if (parentRow && parentRow.parentId !== IN_APP_CATEGORY_ROOT_PARENT_ID) {
      return;
    }

    const dialogFormRef = ref<FormOverlayExpose<InAppMessageCategoryFormModel> | null>(null);

    addDialog({
      title: t('inAppCategory.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => (
        <InAppCategoryFormDialog
          ref={dialogFormRef}
          form={parentRow ? ({ parentId: parentRow.id } as InAppMessageCategoryFormModel) : undefined}
        />
      ),
      beforeSure: createFormBeforeSure<InAppMessageCategoryFormModel>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createInAppMessageCategory(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗（先拉详情再回填；大类 parentId=0 视为未选）
   * @param row 表格行或树节点
   */
  const openEditDialog = async (row: InAppMessageCategoryPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<InAppMessageCategoryFormModel> | null>(null);

    try {
      const detail = await getInAppMessageCategoryById(row.id);
      const parentId = detail.parentId;
      const editForm = {
        ...detail,
        parentId: parentId === IN_APP_CATEGORY_ROOT_PARENT_ID ? undefined : parentId,
      };

      addDialog({
        title: t('inAppCategory.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => <InAppCategoryFormDialog ref={dialogFormRef} form={editForm} />,
        beforeSure: createFormBeforeSure<InAppMessageCategoryFormModel>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateInAppMessageCategory(formPayload);
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开详情弹窗
   * @param row 表格行或树节点
   */
  const openDetailDialog = async (row: InAppMessageCategoryPageRow) => {
    try {
      const detailData = await getInAppMessageCategoryById(row.id);
      addDialog({
        title: t('inAppCategory.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
  };
}

export default useInAppCategoryTableAction;

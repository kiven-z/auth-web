import type { InAppMessageCategoryFormModel, InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
import { createInAppMessageCategory, getInAppMessageCategoryById } from '@/api/message/in-app-category';
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
  /** 新增成功后刷新树数据 */
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
    openDetailDialog,
  };
}

export default useInAppCategoryTableAction;

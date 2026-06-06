import {
  type AuthorizationInvalidationEventDetailRow,
  type AuthorizationInvalidationEventPageRow,
  getAuthorizationInvalidationEventDetail,
} from '@/api/ops/authorization-invalidation-event';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/shared/messaging/message';
import AuthorizationInvalidationEventDetailDialog from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationEventDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效幂等事件表格操作：查看详情（只读）
 * @returns 表格操作方法
 */
function useAuthorizationInvalidationEventTableAction() {
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationInvalidationEventPageRow) => {
    let detailData: AuthorizationInvalidationEventDetailRow;
    try {
      detailData = await getAuthorizationInvalidationEventDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.loadFailed' });
      return;
    }

    addDialog({
      title: t('authorizationInvalidation.detailTitle'),
      fullscreenIcon: true,
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(AuthorizationInvalidationEventDetailDialog, { data: detailData }),
    });
  });

  return {
    openDetailDialog,
  };
}

export default useAuthorizationInvalidationEventTableAction;

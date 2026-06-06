import {
  type AuthorizationInvalidationOutboxPageRow,
  getAuthorizationInvalidationOutboxDetail,
} from '@/api/ops/authorization-invalidation-outbox';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/shared/messaging/message';
import AuthorizationInvalidationOutboxDetailDialog from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationOutboxDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效 Outbox 表格操作
 * @returns 表格操作方法
 */
function useAuthorizationInvalidationOutboxTableAction() {
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationInvalidationOutboxPageRow) => {
    try {
      const detailData = await getAuthorizationInvalidationOutboxDetail(row.id);

      addDialog({
        title: t('authorizationInvalidation.outboxDetailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationOutboxDetailDialog, { data: detailData }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.outboxLoadFailed' });
      return;
    }
  });

  return {
    openDetailDialog,
  };
}

export default useAuthorizationInvalidationOutboxTableAction;

import {
  getAuthorizationInvalidationEventDetail,
  getAuthorizationInvalidationEventPage,
} from '@/api/ops/authorization-invalidation-event';
import {
  getAuthorizationInvalidationOutboxDetail,
  getAuthorizationInvalidationOutboxPage,
} from '@/api/ops/authorization-invalidation-outbox';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import AuthorizationInvalidationEventDetailDialog from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationEventDetailDialog.vue';
import AuthorizationInvalidationOutboxDetailDialog from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationOutboxDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效运维：按 eventId 打开关联 Outbox / Event 详情
 * @returns 关联记录跳转方法
 */
function useAuthorizationInvalidationLinkedRecord() {
  const { t } = useI18n();

  /**
   * 按 eventId 打开幂等事件详情
   * @param eventId 业务事件 ID
   */
  const openLinkedEventByEventId = async (eventId: string) => {
    try {
      const page = await getAuthorizationInvalidationEventPage({
        eventId,
        pageIndex: 1,
        pageSize: 1,
      });
      const row = page.list?.[0];
      if (!row?.id) {
        message(t('authorizationInvalidation.linkedEventNotFound'), { type: 'warning' });
        return;
      }
      const detail = await getAuthorizationInvalidationEventDetail(row.id);
      addDialog({
        title: t('authorizationInvalidation.detailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationEventDetailDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.loadFailed' });
    }
  };

  /**
   * 按 eventId 打开 Outbox 详情
   * @param eventId 业务事件 ID
   */
  const openLinkedOutboxByEventId = async (eventId: string) => {
    try {
      const page = await getAuthorizationInvalidationOutboxPage({
        eventId,
        pageIndex: 1,
        pageSize: 1,
      });
      const row = page.list?.[0];
      if (!row?.id) {
        message(t('authorizationInvalidation.linkedOutboxNotFound'), { type: 'warning' });
        return;
      }
      const detail = await getAuthorizationInvalidationOutboxDetail(row.id);
      addDialog({
        title: t('authorizationInvalidation.outboxDetailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationOutboxDetailDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.outboxLoadFailed' });
    }
  };

  return {
    openLinkedEventByEventId,
    openLinkedOutboxByEventId,
  };
}

export default useAuthorizationInvalidationLinkedRecord;

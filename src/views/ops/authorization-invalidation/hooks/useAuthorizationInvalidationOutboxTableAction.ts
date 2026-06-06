import {
  type AuthorizationInvalidationOutboxPageRow,
  getAuthorizationInvalidationOutboxDetail,
  retryAuthorizationInvalidationOutbox,
} from '@/api/ops/authorization-invalidation-outbox';
import { addDialog } from '@/components/ui/Dialog';
import { hasAuth } from '@/shared/permission';
import { operationConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import AuthorizationInvalidationOutboxDetailDialog from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationOutboxDetailDialog.vue';
import { isOutboxRetryable } from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/** Outbox 表格操作依赖 */
export interface AuthorizationInvalidationOutboxTableActionDeps {
  /** 重试成功后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 授权失效 Outbox 表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useAuthorizationInvalidationOutboxTableAction(deps: AuthorizationInvalidationOutboxTableActionDeps) {
  const { fetchTableData } = deps;
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
    }
  });

  /**
   * 人工重试投递
   * @param row 行数据
   */
  const retryOutboxRow = useDebounceFn(async (row: AuthorizationInvalidationOutboxPageRow) => {
    if (!hasAuth('sysAuthInvalidationOutbox:retry')) {
      return;
    }
    if (!isOutboxRetryable(row.status)) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      const result = await retryAuthorizationInvalidationOutbox(row.id, {
        force: row.status === 'PROCESSING',
      });
      if (result.dispatched) {
        message(t('authorizationInvalidation.retrySuccess'), { type: 'success' });
      } else {
        message(t('authorizationInvalidation.retryFailed'), { type: 'warning' });
      }
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.outboxLoadFailed' });
    }
  });

  return {
    openDetailDialog,
    retryOutboxRow,
    // FIXME hasAuth 不能在返回方法中
    canRetryOutbox: (row: AuthorizationInvalidationOutboxPageRow) =>
      hasAuth('sysAuthInvalidationOutbox:retry') && isOutboxRetryable(row.status),
  };
}

export default useAuthorizationInvalidationOutboxTableAction;

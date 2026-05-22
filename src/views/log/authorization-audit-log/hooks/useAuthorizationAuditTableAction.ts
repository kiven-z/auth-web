import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
  type AuthorizationAuditDetailRow,
  type AuthorizationAuditPageRow,
} from '@/api/log/authorization-audit';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import AuthorizationAuditDetailDialog from '@/views/log/authorization-audit-log/components/AuthorizationAuditDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限决策审计日志表格操作：查看详情、删除、批量删除（标准两次删除确认）
 */
function useAuthorizationAuditTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationAuditPageRow) => {
    let detailData: AuthorizationAuditDetailRow;
    try {
      detailData = await getAuthorizationAuditDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationAudit.loadFailed' });
      return;
    }

    addDialog({
      title: t('authorizationAudit.detailTitle'),
      width: '100%',
      fullscreenIcon: true,
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(AuthorizationAuditDetailDialog, { data: detailData }),
    });
  });

  /**
   * 批量删除（单行传 [row.id]，未传 ids 时使用表格多选）
   * @param ids 主键列表，可选
   */
  const deleteBatchRows = async (ids?: string[]) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    ids = ids || selectedRows.value;
    try {
      await deleteAuthorizationAudit(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationAudit.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useAuthorizationAuditTableAction;

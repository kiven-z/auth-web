import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  type AuthorizationAuditDetailRow,
  type AuthorizationAuditPageRow,
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
} from '@/api/log/authorization-audit';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { errorMessage } from '@/shared/messaging/message';
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

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteAuthorizationAudit,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'authorizationAudit.loadFailed',
  });

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

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useAuthorizationAuditTableAction;

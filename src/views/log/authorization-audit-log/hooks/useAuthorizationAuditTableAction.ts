import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  type AuthorizationAuditPageRow,
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
} from '@/api/log/authorization-audit';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { errorMessage } from '@/ui/feedback/message';
import AuthorizationAuditDetailDialog from '@/views/log/authorization-audit-log/components/AuthorizationAuditDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限决策审计日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
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
    try {
      const detailData = await getAuthorizationAuditDetail(row.id);

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
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationAudit.loadFailed' });
      return;
    }
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useAuthorizationAuditTableAction;

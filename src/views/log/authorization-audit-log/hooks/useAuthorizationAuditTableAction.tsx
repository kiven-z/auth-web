import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  type AuthorizationAuditPageRow,
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
} from '@/api/log/authorization-audit';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import useAuthorizationAuditDetailColumns from '@/views/log/authorization-audit-log/hooks/useAuthorizationAuditDetailColumns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 权限决策审计日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useAuthorizationAuditTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useAuthorizationAuditDetailColumns();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteAuthorizationAudit,
    onSuccess: fetchTableData,
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
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
      return;
    }
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useAuthorizationAuditTableAction;

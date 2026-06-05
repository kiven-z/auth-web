import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteLoginLog, getLoginLogDetail, type LoginLogDetailRow, type LoginLogPageRow } from '@/api/log/login-log';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { errorMessage } from '@/shared/messaging/message';
import LoginLogDetailDialog from '@/views/log/login-log/components/LoginLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useLoginLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteLoginLog,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'loginLog.loadFailed',
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: LoginLogPageRow) => {
    let detailData: LoginLogDetailRow;
    try {
      detailData = await getLoginLogDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'loginLog.loadFailed' });
      return;
    }

    addDialog({
      title: t('loginLog.detailTitle'),
      width: '100%',
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(LoginLogDetailDialog, { data: detailData }),
    });
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useLoginLogTableAction;

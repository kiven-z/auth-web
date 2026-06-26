import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteLoginLog, getLoginLogDetail, type LoginLogPageRow } from '@/api/log/login-log';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { errorMessage } from '@/services/feedback/message';
import LoginLogDetailDialog from '@/views/log/login-log/components/LoginLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志表格操作
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
    errorDefaultI18nKey: 'loginLog.message.loadFailed',
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: LoginLogPageRow) => {
    try {
      const detailData = await getLoginLogDetail(row.id);

      addDialog({
        title: t('loginLog.title.detail'),
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(LoginLogDetailDialog, { data: detailData }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'loginLog.message.loadFailed' });
      return;
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useLoginLogTableAction;

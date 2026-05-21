import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteLoginLog, getLoginLogDetail, type LoginLogPageRow } from '@/api/log/login-log';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import LoginLogDetailDialog from '@/views/log/login-log/components/LoginLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 */
function useLoginLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: LoginLogPageRow) => {
    let detailData: any = row;
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
      props: { data: detailData },
      contentRenderer: () => h(LoginLogDetailDialog),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除
   * @param row 行数据
   */
  const deleteRow = async (row: LoginLogPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteLoginLog([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'loginLog.loadFailed' });
    }
  };

  /**
   * 批量删除
   */
  const deleteBatchRows = async () => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const ids = selectedRows.value;
    try {
      await deleteLoginLog(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'loginLog.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteRow,
    deleteBatchRows,
  };
}

export default useLoginLogTableAction;

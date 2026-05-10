import type { TableActionDeps } from '@/api/common';
import { deleteLoginLog, getLoginLogDetail, type LoginLogPageRow } from '@/api/log/login-log';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import LoginLogDetailDialog from '@/views/log/login-log/components/LoginLogDetailDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 */
function useLoginLogTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  const selectedRows = ref<LoginLogPageRow[]>([]);

  const handleSelectionChange = (rows: LoginLogPageRow[]) => {
    selectedRows.value = rows;
  };

  const openDetailDialog = async (row: LoginLogPageRow) => {
    let detailData: any = row;
    try {
      detailData = await getLoginLogDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'log.loginLog.loadFailed' });
      return;
    }

    addDialog({
      title: t('log.loginLog.detailTitle'),
      props: {},
      contentRenderer: () => h(LoginLogDetailDialog, { data: detailData }),
      beforeSure: (done) => done(),
    });
  };

  const deleteRow = async (row: LoginLogPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteLoginLog([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'log.loginLog.loadFailed' });
    }
  };

  const deleteBatchRows = async () => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const ids = selectedRows.value.map((row) => row.id);
    try {
      await deleteLoginLog(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'log.loginLog.loadFailed' });
    }
  };

  return {
    selectedRows,
    handleSelectionChange,
    openDetailDialog,
    deleteRow,
    deleteBatchRows,
  };
}

export default useLoginLogTableAction;

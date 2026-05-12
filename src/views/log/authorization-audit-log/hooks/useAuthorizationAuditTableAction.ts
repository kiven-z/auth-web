import type { TableActionDeps } from '@/api/common';
import {
  type AuthorizationAuditPageRow,
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
} from '@/api/log/authorization-audit';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import AuthorizationAuditDetailDialog from '@/views/log/authorization-audit-log/components/AuthorizationAuditDetailDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addDialog } from '@/components/ui/Dialog';
import { useDebounceFn } from '@vueuse/core';

/**
 * 权限决策审计日志表格操作：查看详情、删除、批量删除（标准两次删除确认）
 */
function useAuthorizationAuditTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  // 选中的行
  const selectedRows = ref<AuthorizationAuditPageRow[]>([]);

  /**
   * 多选变化
   * @param rows 选中行
   */
  const handleSelectionChange = (rows: AuthorizationAuditPageRow[]) => {
    selectedRows.value = rows;
  };

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationAuditPageRow) => {
    let detailData: any = row;
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
      props: {},
      contentRenderer: () => h(AuthorizationAuditDetailDialog, { data: detailData }),
      beforeSure: async (done) => {
        done();
      },
    });
  }, 500);

  /**
   * 删除单行
   * @param row 行数据
   */
  const deleteRow = async (row: AuthorizationAuditPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteAuthorizationAudit([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'authorizationAudit.loadFailed' });
    }
  };

  /**
   * 批量删除
   */
  const deleteBatchRows = async () => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const ids = selectedRows.value.map((row) => row.id);
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
    selectedRows,
    handleSelectionChange,
    openDetailDialog,
    deleteRow,
    deleteBatchRows,
  };
}

export default useAuthorizationAuditTableAction;

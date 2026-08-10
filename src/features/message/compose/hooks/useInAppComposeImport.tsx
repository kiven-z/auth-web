import type { InAppComposeRequest } from '@/features/message/api/in-app-message';
import { addDialog, closeDialog } from '@/components/ui/Dialog';
import { multiConfirm } from '@/services/feedback/dialog';
import InAppHistoryImportDialog from '@/features/message/compose/components/InAppHistoryImportDialog.vue';
import InAppTemplateImportDialog from '@/features/message/compose/components/InAppTemplateImportDialog.vue';
import type { InAppComposeImportPayload } from '@/features/message/compose/types/compose-import';
import { useI18n } from 'vue-i18n';

/**
 * 撰写页模板 / 历史发送导入弹窗
 * @param form 撰写表单
 * @returns 打开导入弹窗的方法
 */
function useInAppComposeImport(form: InAppComposeRequest) {
  const { t } = useI18n();

  /**
   * 确认后将导入结果写入撰写表单
   * @param payload 导入载荷
   * @returns 是否已导入
   */
  async function confirmAndApplyImport(payload: InAppComposeImportPayload) {
    const confirmed = await multiConfirm([
      {
        title: t('inAppCompose.importConfirmTitle'),
        message: t('inAppCompose.importConfirmMessage'),
      },
    ]);
    if (!confirmed) {
      return false;
    }

    form.templateCode = payload.templateCode;
    form.title = payload.title;
    form.body = payload.body;
    form.contentType = payload.contentType;
    return true;
  }

  /**
   * 打开模板导入弹窗
   */
  function openTemplateImportDialog(): void {
    addDialog({
      title: t('inAppCompose.importTemplateDialogTitle'),
      width: '90%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) => (
        <InAppTemplateImportDialog
          onImport={async (payload: InAppComposeImportPayload) => {
            const imported = await confirmAndApplyImport(payload);
            if (imported) {
              closeDialog(options, index, { command: 'close' });
            }
          }}
        />
      ),
    });
  }

  /**
   * 打开历史发送导入弹窗
   */
  function openHistoryImportDialog(): void {
    addDialog({
      title: t('inAppCompose.importHistoryDialogTitle'),
      width: '90%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) => (
        <InAppHistoryImportDialog
          onImport={async (payload: InAppComposeImportPayload) => {
            const imported = await confirmAndApplyImport(payload);
            if (imported) {
              closeDialog(options, index, { command: 'close' });
            }
          }}
        />
      ),
    });
  }

  return {
    openTemplateImportDialog,
    openHistoryImportDialog,
  };
}

export default useInAppComposeImport;

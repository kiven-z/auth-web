import { type ChannelDeliveryPageRow, getChannelDeliveryById } from '@/api/message/channel-delivery';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useSendRecordDetailColumns from '@/views/message/send-record/hooks/useSendRecordDetailColumns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录表格操作（详情）
 * @returns 表格操作方法
 */
function useSendRecordTableAction() {
  const { t } = useI18n();
  const { detailColumns } = useSendRecordDetailColumns();

  /**
   * 打开列表行详情
   * @param row 分页行
   */
  const openDetailDialog = useDebounceFn(async (row: ChannelDeliveryPageRow) => {
    try {
      const detailData = await getChannelDeliveryById(row.id);

      addDialog({
        title: t('sendRecord.title.detail'),
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  return {
    openDetailDialog,
  };
}

export default useSendRecordTableAction;

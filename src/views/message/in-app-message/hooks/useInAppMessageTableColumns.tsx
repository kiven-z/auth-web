import type { InAppSendTaskPageRow } from '@/api/message/in-app-message';
import { selectUserinfo } from '@/components/business/UserProfile';
import {
  IN_APP_MESSAGE_SCOPE_OPTIONS,
  IN_APP_MESSAGE_SOURCE_OPTIONS,
  IN_APP_MESSAGE_STATUS_ITEMS,
} from '@/views/message/in-app-message/constants/task-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格列配置
 * @returns 表格列定义
 */
function useInAppMessageTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('inAppMessage.field.title'),
      prop: 'title',
      minWidth: 180,
    },
    {
      label: t('inAppMessage.field.status'),
      prop: 'status',
      minWidth: 120,
      formatter: (row: InAppSendTaskPageRow) => {
        const meta = IN_APP_MESSAGE_STATUS_ITEMS.find((item) => item.value === row.status);
        if (!meta) {
          return <span>{row.status || '—'}</span>;
        }
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeType'),
      prop: 'recipientScopeType',
      minWidth: 120,
      formatter: (row: InAppSendTaskPageRow) => {
        const labelKey = IN_APP_MESSAGE_SCOPE_OPTIONS.find((item) => item.value === row.recipientScopeType)?.labelKey;
        return labelKey ? t(labelKey) : row.recipientScopeType || '—';
      },
    },
    {
      label: t('inAppMessage.field.sourceType'),
      prop: 'sourceType',
      minWidth: 130,
      formatter: (row: InAppSendTaskPageRow) => {
        const labelKey = IN_APP_MESSAGE_SOURCE_OPTIONS.find((item) => item.value === row.sourceType)?.labelKey;
        return labelKey ? t(labelKey) : row.sourceType || '—';
      },
    },
    {
      label: t('inAppMessage.field.contentType'),
      prop: 'contentType',
      minWidth: 110,
    },
    {
      label: t('inAppMessage.field.categoryName'),
      prop: 'categoryName',
      minWidth: 110,
    },
    {
      label: t('inAppMessage.field.totalCount'),
      prop: 'totalCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.successCount'),
      prop: 'successCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.failCount'),
      prop: 'failCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.sceneCode'),
      prop: 'sceneCode',
      minWidth: 140,
    },
    {
      label: t('inAppMessage.field.recalledAt'),
      prop: 'recalledAt',
      minWidth: 170,
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: InAppSendTaskPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: InAppSendTaskPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppMessageTableColumns;

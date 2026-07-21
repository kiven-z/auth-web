import {
  IN_APP_MESSAGE_SCOPE_OPTIONS,
  IN_APP_MESSAGE_SOURCE_OPTIONS,
  IN_APP_MESSAGE_STATUS_ITEMS,
} from '@/views/message/in-app-message/constants/task-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务详情描述列
 * @returns 详情列配置
 */
function useInAppMessageDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    {
      label: t('inAppMessage.field.title'),
      prop: 'title',
      labelWidth: 120,
      copy: true,
      span: 2,
    },
    {
      label: t('inAppMessage.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const meta = IN_APP_MESSAGE_STATUS_ITEMS.find((item) => item.value === value);
        if (!meta) {
          return <span>{value}</span>;
        }
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('inAppMessage.field.sourceType'),
      prop: 'sourceType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const labelKey = IN_APP_MESSAGE_SOURCE_OPTIONS.find((item) => item.value === value)?.labelKey;
        return <span>{labelKey ? t(labelKey) : value}</span>;
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeType'),
      prop: 'recipientScopeType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const labelKey = IN_APP_MESSAGE_SCOPE_OPTIONS.find((item) => item.value === value)?.labelKey;
        return <span>{labelKey ? t(labelKey) : value}</span>;
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeIds'),
      prop: 'recipientScopeIds',
      labelWidth: 120,
      span: 2,
      copy: true,
      cellRenderer: ({ value }) => {
        if (!Array.isArray(value) || value.length === 0) {
          return <span>—</span>;
        }
        return <span class="break-all">{value.join(', ')}</span>;
      },
    },
    {
      label: t('inAppMessage.field.includeChildren'),
      prop: 'includeChildren',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value === null || value === undefined) {
          return <span>—</span>;
        }
        return <span>{value ? t('status.yes') : t('status.no')}</span>;
      },
    },
    { label: t('inAppMessage.field.contentType'), prop: 'contentType', labelWidth: 120 },
    { label: t('inAppMessage.field.categoryName'), prop: 'categoryName', labelWidth: 120 },
    { label: t('inAppMessage.field.sceneCode'), prop: 'sceneCode', labelWidth: 120, copy: true },
    { label: t('inAppMessage.field.senderUserId'), prop: 'senderUserId', labelWidth: 120, copy: true },
    {
      label: t('inAppMessage.field.linkUrl'),
      prop: 'linkUrl',
      labelWidth: 120,
      span: 2,
      copy: true,
    },
    { label: t('inAppMessage.field.totalCount'), prop: 'totalCount', labelWidth: 120 },
    { label: t('inAppMessage.field.successCount'), prop: 'successCount', labelWidth: 120 },
    { label: t('inAppMessage.field.failCount'), prop: 'failCount', labelWidth: 120 },
    { label: t('inAppMessage.field.recalledAt'), prop: 'recalledAt', labelWidth: 120 },
    { label: t('inAppMessage.field.recallUserId'), prop: 'recallUserId', labelWidth: 120, copy: true },
    { label: t('inAppMessage.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
    { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
    { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
    { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
  ]);

  return { detailColumns };
}

export default useInAppMessageDetailColumns;

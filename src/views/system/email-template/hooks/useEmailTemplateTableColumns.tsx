/**
 * 邮件模板表格列
 */
import type { EmailTemplatePageRow } from '@/api/system/email-template';
import { selectUserinfo } from '@/components/user/UserProfile';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

function useEmailTemplateTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 模板编码
    { label: t('emailTemplate.templateCode'), prop: 'templateCode', minWidth: 160 },
    // 模板名称
    { label: t('emailTemplate.templateName'), prop: 'templateName', minWidth: 160 },
    // 主题
    { label: t('emailTemplate.subject'), prop: 'subject', minWidth: 220 },
    // 优先级
    { label: t('emailTemplate.priority'), prop: 'priority', width: 120 },
    // 状态
    {
      label: t('emailTemplate.status'),
      prop: 'status',
      width: 110,
      formatter: (row: EmailTemplatePageRow) => {
        return (
          <ElTag type={row.status === 1 ? 'success' : 'danger'} effect="plain" size="small">
            {row.status === 1 ? t('emailTemplate.statusEnabled') : t('emailTemplate.statusDisabled')}
          </ElTag>
        );
      },
    },
    { label: t('table.updateTime'), prop: 'updateTime', sortable: true, minWidth: 160 },
    { label: t('table.createTime'), prop: 'createTime', sortable: true, minWidth: 160 },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: EmailTemplatePageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
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
      formatter: (row: EmailTemplatePageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername ?? '')}>
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

export default useEmailTemplateTableColumns;

import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { AuthorizationAuditPageRow } from '@/api/log/authorization-audit';
import { selectUserinfo } from '@/components/business/UserProfile';
import { resolveAuditEventTypeMeta } from '@/views/log/authorization-audit-log/constants/authorization-audit-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useAuthorizationAuditTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 事件类型
    {
      label: t('authorizationAudit.eventType'),
      prop: 'eventType',
      minWidth: 110,
      formatter: (row: AuthorizationAuditPageRow) => {
        if (!row.eventType) {
          return <span>—</span>;
        }
        const meta = resolveAuditEventTypeMeta(row.eventType);
        if (!meta) {
          return <span>{row.eventType}</span>;
        }
        const label = t(meta.labelKey);
        return (
          <ElTag type={meta.tagType} effect="plain">
            {label}
          </ElTag>
        );
      },
    },
    // 决策原因
    {
      label: t('authorizationAudit.decisionReason'),
      prop: 'decisionReason',
      minWidth: 140,
    },
    // 类名
    {
      label: t('authorizationAudit.className'),
      prop: 'className',
      minWidth: 200,
    },
    // 方法名
    {
      label: t('authorizationAudit.methodName'),
      prop: 'methodName',
      minWidth: 160,
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      formatter: (row: AuthorizationAuditPageRow) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      formatter: (row: AuthorizationAuditPageRow) => {
        return (
          row.createdBy && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
              {row.createdByName}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updatedByName'),
      prop: 'updatedBy',
      minWidth: 130,
      formatter: (row: AuthorizationAuditPageRow) => {
        return (
          row.updatedBy && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updatedBy, row.updatedByName)}>
              {row.updatedByName}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationAuditTableColumns;

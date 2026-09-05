import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import { useFileExportTaskOptions } from '@/components/domain/file/file-export-task-table';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人导出任务详情描述列
 * @returns 详情列配置
 */
function usePersonalFileExportTaskDetailColumns() {
  const { t } = useI18n();
  const { statusOptions, exportFormatOptions } = useFileExportTaskOptions();

  const detailColumns = computed(() => [
    { label: t('fileExportTask.fields.bizType'), prop: 'bizType', labelWidth: 140, copy: true },
    {
      label: t('fileExportTask.fields.exportFormat'),
      prop: 'exportFormat',
      labelWidth: 140,
      cellRenderer: ({ value }: { value?: string | null }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = exportFormatOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value}</span>;
      },
    },
    {
      label: t('fileExportTask.fields.status'),
      prop: 'status',
      labelWidth: 140,
      cellRenderer: ({ value }: { value?: string | null }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = statusOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('fileExportTask.fields.progressPercent'),
      prop: 'progressPercent',
      labelWidth: 140,
      cellRenderer: ({ value }: { value?: number | null }) => {
        return value ? <span>{value}%</span> : <span>—</span>;
      },
    },
    {
      label: t('fileExportTask.fields.processedRows'),
      prop: 'processedRows',
      labelWidth: 140,
      cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
        const processed = (row.processedRows as number | null | undefined) ?? 0;
        const total = row.totalRows as number | null | undefined;
        if (total == null) {
          return <span>{processed}</span>;
        }
        return (
          <span>
            {processed} / {total}
          </span>
        );
      },
    },
    { label: t('fileExportTask.fields.fileRecordId'), prop: 'fileRecordId', labelWidth: 140, copy: true },
    { label: t('fileExportTask.fields.requestId'), prop: 'requestId', labelWidth: 140, copy: true },
    {
      label: t('fileExportTask.fields.retryCount'),
      prop: 'retryCount',
      labelWidth: 140,
      cellRenderer: ({ row }: { row: Record<string, unknown> }) => (
        <span>
          {(row.retryCount as number | null | undefined) ?? '—'} / {(row.maxRetry as number | null | undefined) ?? '—'}
        </span>
      ),
    },
    {
      label: t('fileExportTask.fields.nextRetryAt'),
      prop: 'nextRetryAt',
      labelWidth: 140,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('fileExportTask.fields.errorCode'), prop: 'errorCode', labelWidth: 140, copy: true },
    {
      label: t('fileExportTask.fields.errorMessage'),
      prop: 'errorMessage',
      labelWidth: 140,
      span: 2,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => <span class="break-all">{value || '—'}</span>,
    },
    {
      label: t('fileExportTask.fields.querySnapshotJson'),
      prop: 'querySnapshotJson',
      labelWidth: 140,
      span: 2,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => (
        <span class="text-left break-all whitespace-pre-wrap">{value ?? '—'}</span>
      ),
    },
    {
      label: t('fileExportTask.fields.startedAt'),
      prop: 'startedAt',
      labelWidth: 140,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('fileExportTask.fields.finishedAt'),
      prop: 'finishedAt',
      labelWidth: 140,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('fileExportTask.fields.expireAt'),
      prop: 'expireAt',
      labelWidth: 140,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('fileExportTask.fields.remark'), prop: 'remark', labelWidth: 140, span: 2 },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default usePersonalFileExportTaskDetailColumns;

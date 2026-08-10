import type { FileExportTaskPageRow } from '@/features/file/api/models/file-export-task';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import { useFileExportTaskOptions } from '@/components/domain/file/FileExportTaskTable';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人导出任务表格列配置
 * @returns 表格列定义
 */
function usePersonalFileExportTaskTableColumns() {
  const { t } = useI18n();
  const { statusOptions, exportFormatOptions } = useFileExportTaskOptions();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 70,
    },
    {
      label: t('fileExportTask.fields.bizType'),
      prop: 'bizType',
      minWidth: 140,
    },
    {
      label: t('fileExportTask.fields.exportFormat'),
      prop: 'exportFormat',
      minWidth: 110,
      render: ({ row }: { row: FileExportTaskPageRow }) => {
        const option = exportFormatOptions.value.find((item) => item.value === row.exportFormat);
        return option?.label ?? row.exportFormat ?? '—';
      },
    },
    {
      label: t('fileExportTask.fields.status'),
      prop: 'status',
      minWidth: 110,
      render: ({ row }: { row: FileExportTaskPageRow }) => {
        const option = statusOptions.value.find((item) => item.value === row.status);
        if (!option) {
          return <span>{row.status || '—'}</span>;
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
      minWidth: 100,
      render: ({ row }: { row: FileExportTaskPageRow }) =>
        row.progressPercent == null ? '—' : `${row.progressPercent}%`,
    },
    {
      label: t('fileExportTask.fields.processedRows'),
      prop: 'processedRows',
      minWidth: 120,
      render: ({ row }: { row: FileExportTaskPageRow }) => {
        const processed = row.processedRows ?? 0;
        if (row.totalRows == null) {
          return String(processed);
        }
        return `${processed} / ${row.totalRows}`;
      },
    },
    {
      label: t('fileExportTask.fields.errorCode'),
      prop: 'errorCode',
      minWidth: 140,
      render: ({ row }: { row: FileExportTaskPageRow }) => row.errorCode || '—',
    },
    {
      label: t('fileExportTask.fields.retryCount'),
      prop: 'retryCount',
      minWidth: 110,
      render: ({ row }: { row: FileExportTaskPageRow }) => {
        const retryCount = row.retryCount ?? 0;
        const maxRetry = row.maxRetry ?? 0;
        return `${retryCount} / ${maxRetry}`;
      },
    },
    {
      label: t('fileExportTask.fields.startedAt'),
      prop: 'startedAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskPageRow }) => formatDateTime(row.startedAt),
    },
    {
      label: t('fileExportTask.fields.finishedAt'),
      prop: 'finishedAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskPageRow }) => formatDateTime(row.finishedAt),
    },
    {
      label: t('fileExportTask.fields.expireAt'),
      prop: 'expireAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskPageRow }) => formatDateTime(row.expireAt),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default usePersonalFileExportTaskTableColumns;

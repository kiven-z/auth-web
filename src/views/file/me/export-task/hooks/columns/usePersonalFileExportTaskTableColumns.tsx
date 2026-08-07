import type { FileExportTaskPageRow } from '@/api/file/models/file-export-task';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import usePersonalFileExportTaskOptions from '@/views/file/me/export-task/hooks/options/usePersonalFileExportTaskOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人导出任务表格列配置。
 * @returns 表格列定义
 */
function usePersonalFileExportTaskTableColumns() {
  const { t } = useI18n();
  const { statusOptions, exportFormatOptions } = usePersonalFileExportTaskOptions();

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
      render: ({ row }: { row: FileExportTaskPageRow }) => {
        if (row.progressPercent == null) {
          return '—';
        }
        return `${row.progressPercent}%`;
      },
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

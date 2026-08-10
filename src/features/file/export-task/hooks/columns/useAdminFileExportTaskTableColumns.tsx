import type { FileExportTaskAdminPageRow } from '@/features/file/api/models/file-export-task';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import { useFileExportTaskOptions } from '@/components/domain/file/FileExportTaskTable';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 管理端导出任务表格列配置
 * @returns 表格列定义
 */
function useAdminFileExportTaskTableColumns() {
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
      label: t('fileExportTask.fields.createdBy'),
      prop: 'createdBy',
      minWidth: 120,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => row.createdBy || '—',
    },
    {
      label: t('fileExportTask.fields.bizType'),
      prop: 'bizType',
      minWidth: 130,
    },
    {
      label: t('fileExportTask.fields.exportFormat'),
      prop: 'exportFormat',
      minWidth: 100,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => {
        const option = exportFormatOptions.value.find((item) => item.value === row.exportFormat);
        return option?.label ?? row.exportFormat ?? '—';
      },
    },
    {
      label: t('fileExportTask.fields.status'),
      prop: 'status',
      minWidth: 110,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => {
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
      render: ({ row }: { row: FileExportTaskAdminPageRow }) =>
        row.progressPercent == null ? '—' : `${row.progressPercent}%`,
    },
    {
      label: t('fileExportTask.fields.processedRows'),
      prop: 'processedRows',
      minWidth: 120,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => {
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
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => row.errorCode || '—',
    },
    {
      label: t('fileExportTask.fields.errorMessage'),
      prop: 'errorMessage',
      minWidth: 180,
      showOverflowTooltip: true,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => row.errorMessage || '—',
    },
    {
      label: t('fileExportTask.fields.lockedBy'),
      prop: 'lockedBy',
      minWidth: 120,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => row.lockedBy || '—',
    },
    {
      label: t('fileExportTask.fields.leaseUntil'),
      prop: 'leaseUntil',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => formatDateTime(row.leaseUntil),
    },
    {
      label: t('fileExportTask.fields.startedAt'),
      prop: 'startedAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => formatDateTime(row.startedAt),
    },
    {
      label: t('fileExportTask.fields.finishedAt'),
      prop: 'finishedAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => formatDateTime(row.finishedAt),
    },
    {
      label: t('fileExportTask.fields.expireAt'),
      prop: 'expireAt',
      minWidth: 170,
      render: ({ row }: { row: FileExportTaskAdminPageRow }) => formatDateTime(row.expireAt),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 260,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAdminFileExportTaskTableColumns;

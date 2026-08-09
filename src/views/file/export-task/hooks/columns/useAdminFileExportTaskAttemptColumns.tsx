import type { FileExportAttempt } from '@/api/file/models/file-export-task';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import useFileExportTaskOptions from '@/views/file/_shared/hooks/useFileExportTaskOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 管理端导出任务执行尝试表格列配置
 * @returns 表格列定义
 */
function useAdminFileExportTaskAttemptColumns() {
  const { t } = useI18n();
  const { attemptResultOptions } = useFileExportTaskOptions();

  const attemptColumns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 70,
    },
    { label: t('fileExportTask.fields.attemptNo'), prop: 'attemptNo', minWidth: 100 },
    { label: t('fileExportTask.fields.workerId'), prop: 'workerId', minWidth: 120 },
    {
      label: t('fileExportTask.fields.attemptResult'),
      prop: 'result',
      minWidth: 120,
      render: ({ row }: { row: FileExportAttempt }) => {
        const option = attemptResultOptions.value.find((item) => item.value === row.result);
        if (!option) {
          return <span>{row.result || '—'}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    { label: t('fileExportTask.fields.processedRows'), prop: 'processedRows', minWidth: 120 },
    { label: t('fileExportTask.fields.errorCode'), prop: 'errorCode', minWidth: 140 },
    { label: t('fileExportTask.fields.errorMessage'), prop: 'errorMessage', minWidth: 220 },
    {
      label: t('fileExportTask.fields.startedAt'),
      minWidth: 180,
      render: ({ row }: { row: FileExportAttempt }) => formatDateTime(row.startedAt),
    },
    {
      label: t('fileExportTask.fields.finishedAt'),
      minWidth: 180,
      render: ({ row }: { row: FileExportAttempt }) => formatDateTime(row.finishedAt),
    },
  ]);

  return { attemptColumns };
}

export default useAdminFileExportTaskAttemptColumns;

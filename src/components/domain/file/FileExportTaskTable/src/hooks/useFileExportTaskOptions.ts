import type {
  FileExportAttemptResult,
  FileExportFormat,
  FileExportTaskStatus,
} from '@/features/file/api/models/file-export-task';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SelectOption, TagSelectOption } from '@/shared/types/selectOption';

/**
 * 导出任务枚举选项（文案随 locale 更新）
 * @returns 任务状态、导出格式、执行尝试结果
 */
function useFileExportTaskOptions() {
  const { t } = useI18n();

  const statusOptions = computed<TagSelectOption<FileExportTaskStatus>[]>(() => [
    { value: 'PENDING', label: t('fileExportTask.status.PENDING'), tagType: 'info' },
    { value: 'RUNNING', label: t('fileExportTask.status.RUNNING'), tagType: 'warning' },
    { value: 'CANCELLING', label: t('fileExportTask.status.CANCELLING'), tagType: 'warning' },
    { value: 'SUCCESS', label: t('fileExportTask.status.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('fileExportTask.status.FAILED'), tagType: 'danger' },
    { value: 'CANCELLED', label: t('fileExportTask.status.CANCELLED'), tagType: 'info' },
    { value: 'EXPIRED', label: t('fileExportTask.status.EXPIRED'), tagType: 'warning' },
  ]);

  const exportFormatOptions = computed<SelectOption<FileExportFormat>[]>(() => [
    { value: 'XLSX', label: t('fileExportTask.exportFormat.XLSX') },
  ]);

  const attemptResultOptions = computed<TagSelectOption<FileExportAttemptResult>[]>(() => [
    { value: 'SUCCESS', label: t('fileExportTask.attemptResult.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('fileExportTask.attemptResult.FAILED'), tagType: 'danger' },
    { value: 'CANCELLED', label: t('fileExportTask.attemptResult.CANCELLED'), tagType: 'info' },
    { value: 'TIMEOUT', label: t('fileExportTask.attemptResult.TIMEOUT'), tagType: 'warning' },
  ]);

  return {
    statusOptions,
    exportFormatOptions,
    attemptResultOptions,
  };
}

export default useFileExportTaskOptions;

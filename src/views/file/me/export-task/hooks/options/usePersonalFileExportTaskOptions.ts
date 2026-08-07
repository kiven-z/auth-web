import type { FileExportFormat, FileExportTaskStatus } from '@/api/file/models/file-export-task.types';
import type { SelectOption, TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人导出任务枚举选项（文案随 locale 更新）
 * @returns 状态 / 导出格式
 */
function usePersonalFileExportTaskOptions() {
  const { t } = useI18n();

  const statusOptions = computed<TagSelectOption<FileExportTaskStatus>[]>(() => [
    { value: 'PENDING', label: t('fileExportTask.status.PENDING'), tagType: 'info' },
    { value: 'RUNNING', label: t('fileExportTask.status.RUNNING'), tagType: 'warning' },
    { value: 'SUCCESS', label: t('fileExportTask.status.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('fileExportTask.status.FAILED'), tagType: 'danger' },
    { value: 'CANCELLED', label: t('fileExportTask.status.CANCELLED'), tagType: 'info' },
    { value: 'EXPIRED', label: t('fileExportTask.status.EXPIRED'), tagType: 'warning' },
  ]);

  const exportFormatOptions = computed<SelectOption<FileExportFormat>[]>(() => [
    { value: 'XLSX', label: t('fileExportTask.exportFormat.XLSX') },
  ]);

  return {
    statusOptions,
    exportFormatOptions,
  };
}

export default usePersonalFileExportTaskOptions;

<script lang="ts" setup>
import type { ImportRowError, SpreadsheetImportResult } from '@/api/common';
import { errorMessage } from '@/ui/feedback/message';
import { downloadBlob } from '@/utils/fileDownload';
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SpreadsheetImportPanel' });

interface SpreadsheetImportDialogProps {
  /** 模板文件名（触发浏览器下载时使用） */
  templateFilename: string;
  /**
   * 调用后端导入接口
   * @param file 用户选择的 xlsx 文件
   * @returns 导入结果
   */
  onImport: (file: File) => Promise<SpreadsheetImportResult>;
  /**
   * 调用后端模板下载接口
   * @returns 模板 Blob
   */
  onDownloadTemplate: () => Promise<Blob>;
}

const props = defineProps<SpreadsheetImportDialogProps>();

/** 导入面板对外暴露方法 */
export interface SpreadsheetImportDialogExpose {
  /** 提交导入（成功返回 `true`） */
  submitImport: () => Promise<boolean>;
}

const { t } = useI18n();

const importing = ref(false);
const downloadingTemplate = ref(false);
const uploadRef = ref<UploadInstance>();

const selectedFile = ref<File | null>(null);
const importResult = ref<SpreadsheetImportResult | null>(null);

/** 最大上传大小 10MB（字节） */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * el-upload beforeUpload 钩子：仅做校验，禁止自动上传
 * @param rawFile 待上传文件
 * @returns false 阻止自动上传
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  if (!rawFile.name.endsWith('.xlsx')) {
    errorMessage(null, { message: t('import.fileTypeInvalid') });
    return false;
  }
  if (rawFile.size > MAX_FILE_SIZE_BYTES) {
    errorMessage(null, { message: t('import.fileLimitExceeded') });
    return false;
  }
  return false;
};

/**
 * 文件变更时（拖拽或点击选择）记录选中文件，限制只保留最新一个
 * @param uploadFile Element Plus 上传文件对象
 */
function handleFileChange(uploadFile: UploadFile) {
  if (!uploadFile.raw) {
    return;
  }
  selectedFile.value = uploadFile.raw;
  importResult.value = null;
}

/**
 * 点击「开始导入」
 */
async function handleImport() {
  if (!selectedFile.value) {
    errorMessage(null, { message: t('import.fileRequired') });
    return false;
  }
  importing.value = true;
  try {
    const result = await props.onImport(selectedFile.value);
    importResult.value = result;
    return result.success;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'import.importFailed' });
    return false;
  } finally {
    importing.value = false;
  }
}

/**
 * 点击「下载模板」
 */
async function handleDownloadTemplate() {
  downloadingTemplate.value = true;
  try {
    const blob = await props.onDownloadTemplate();
    downloadBlob(blob, props.templateFilename);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'import.templateDownloadFailed' });
  } finally {
    downloadingTemplate.value = false;
  }
}

/**
 * 计算错误行数
 * @param errors 错误列表
 * @returns 错误行数
 */
function countErrors(errors: ImportRowError[]): number {
  return errors.length;
}

defineExpose<SpreadsheetImportDialogExpose>({ submitImport: handleImport });
</script>

<template>
  <div>
    <!-- 上传区域 -->
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :before-upload="handleBeforeUpload"
      :limit="1"
      :show-file-list="true"
      accept=".xlsx"
      class="spreadsheet-import-dialog__uploader"
      drag
      @change="handleFileChange"
    >
      <!-- 拖拽/点击提示文案 -->
      <div class="el-upload__text">{{ t('import.dropOrClickHint') }}</div>
      <template #tip>
        <div class="el-upload__tip">{{ t('import.fileTypeHint') }}</div>
      </template>
    </el-upload>

    <div class="spreadsheet-import-dialog__template-action">
      <el-button :loading="downloadingTemplate" link type="primary" @click="handleDownloadTemplate">
        {{ t('import.downloadTemplate') }}
      </el-button>
    </div>

    <!-- 导入结果：成功 -->
    <el-alert
      v-if="importResult?.success"
      :description="t('import.successMessage', { count: importResult.importedCount })"
      :title="t('tips.operationSuccess')"
      class="mt-3"
      show-icon
      type="success"
    />

    <!-- 导入结果：行级错误 -->
    <template v-if="importResult && !importResult.success">
      <el-alert
        :description="`${t('import.errorTitle')}（${countErrors(importResult.errors)} ${t('import.errorRowIndex')}）`"
        :title="t('tips.editFailed')"
        class="mt-3"
        show-icon
        type="error"
      />
      <el-table :data="importResult.errors" :max-height="240" border class="mt-2 w-full" size="small" stripe>
        <el-table-column :label="t('import.errorRowIndex')" prop="rowIndex" width="80" />
        <el-table-column :label="t('import.errorMessage')" prop="message" />
      </el-table>
    </template>
  </div>
</template>

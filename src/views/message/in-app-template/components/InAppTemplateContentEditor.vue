<script lang="ts" setup>
import { uploadFile } from '@/api/file/file-upload';
import { errorMessage } from '@/services/feedback/message';
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import { validateUploadFile } from '@/shared/utils/file/validateUploadFile';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import { MdEditor, type ToolbarNames, type UploadImgCallBack } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppTemplateContentEditor',
});

/** 消息模板正文配图（对应后端 FileBizType.MESSAGE_IMAGE） */
const MESSAGE_IMAGE_BIZ_TYPE = 'message-image';

const MESSAGE_IMAGE_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MESSAGE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/** 隐藏与表单提交无关的工具项，避免误点 */
const MARKDOWN_TOOLBARS_EXCLUDE: ToolbarNames[] = ['save', 'github'];

/** 按正文类型切换编辑器：TEXT=el-input，MARKDOWN=md-editor-v3，HTML=占位 */
interface InAppTemplateContentEditorProps {
  contentType: MessageTemplateContentTypeCode;
}

defineProps<InAppTemplateContentEditorProps>();

const modelValue = defineModel<string>({ required: true });

const { t } = useI18n();
const { mdEditorTheme } = useEditorTheme();

/**
 * 将选中/粘贴的图片上传为公开 URL，并回填到 Markdown
 * @param files 待上传图片
 * @param callback md-editor 插入链接回调
 */
async function handleUploadImg(files: File[], callback: UploadImgCallBack): Promise<void> {
  const validFiles: File[] = [];
  for (const file of files) {
    const isValid = validateUploadFile(file, {
      allowedMimeTypes: ALLOWED_MESSAGE_IMAGE_MIME_TYPES,
      maxSizeBytes: MESSAGE_IMAGE_MAX_FILE_SIZE_BYTES,
      onTypeInvalid: () => errorMessage(null, { message: t('inAppTemplate.image.fileTypeInvalid') }),
      onSizeExceeded: () => errorMessage(null, { message: t('inAppTemplate.image.fileSizeExceeded') }),
    });
    if (isValid) {
      validFiles.push(file);
    }
  }
  if (validFiles.length === 0) {
    return;
  }

  try {
    const uploaded = await Promise.all(validFiles.map((file) => uploadFile({ file, bizType: MESSAGE_IMAGE_BIZ_TYPE })));
    callback(uploaded.map((item) => item.url));
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'tips.requestFailed' });
  }
}
</script>

<template>
  <!-- TEXT：仅此类型使用 el-input -->
  <el-input
    v-if="contentType === 'TEXT'"
    v-model="modelValue"
    :placeholder="t('inAppTemplate.placeholder.content')"
    :rows="16"
    autocomplete="off"
    type="textarea"
  />

  <!-- MARKDOWN：md-editor-v3（图片走公开上传，去掉假保存） -->
  <MdEditor
    v-else-if="contentType === 'MARKDOWN'"
    v-model="modelValue"
    :placeholder="t('inAppTemplate.placeholder.contentMd')"
    :theme="mdEditorTheme"
    :toolbars-exclude="MARKDOWN_TOOLBARS_EXCLUDE"
    class="in-app-template-content-editor__markdown"
    language="zh-CN"
    preview-theme="default"
    style="height: 520px"
    @on-upload-img="handleUploadImg"
  />

  <!-- HTML：本期不做编辑器 -->
  <el-alert v-else-if="contentType === 'HTML'" :closable="false" show-icon title="HTML 编辑器即将上线" type="info" />
</template>

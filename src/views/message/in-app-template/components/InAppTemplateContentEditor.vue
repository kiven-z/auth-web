<script lang="ts" setup>
import { uploadFile } from '@/api/file/file-upload';
import { errorMessage } from '@/services/feedback/message';
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import { validateUploadFile } from '@/shared/utils/file/validateUploadFile';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';
import { MdEditor, type ToolbarNames, type UploadImgCallBack } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { computed, onBeforeUnmount, shallowRef } from 'vue';
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

/** 仅开放与后端 InAppHtmlSanitizer 白名单对齐的菜单（编辑器界面固定中文，与 MdEditor 一致） */
const HTML_TOOLBAR_CONFIG: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'bold',
    'italic',
    'color',
    'bulletedList',
    'numberedList',
    'insertLink',
    'uploadImage',
    '|',
    'undo',
    'redo',
  ],
};

/** 按正文类型切换编辑器：TEXT / MARKDOWN / HTML */
interface InAppTemplateContentEditorProps {
  contentType: MessageTemplateContentTypeCode;
}

defineProps<InAppTemplateContentEditorProps>();

const modelValue = defineModel<string>({ required: true });

const { t } = useI18n();
const { mdEditorTheme, isDark } = useEditorTheme();
const htmlEditorRef = shallowRef<IDomEditor>();

/**
 * 校验并上传模板配图
 * @param file 待上传图片
 * @returns 公开访问 URL；校验失败返回 null
 */
async function uploadMessageImage(file: File): Promise<string | null> {
  const isValid = validateUploadFile(file, {
    allowedMimeTypes: ALLOWED_MESSAGE_IMAGE_MIME_TYPES,
    maxSizeBytes: MESSAGE_IMAGE_MAX_FILE_SIZE_BYTES,
    onTypeInvalid: () => errorMessage(null, { message: t('inAppTemplate.image.fileTypeInvalid') }),
    onSizeExceeded: () => errorMessage(null, { message: t('inAppTemplate.image.fileSizeExceeded') }),
  });
  if (!isValid) {
    return null;
  }

  try {
    const uploaded = await uploadFile({ file, bizType: MESSAGE_IMAGE_BIZ_TYPE });
    return uploaded.url;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'tips.requestFailed' });
    return null;
  }
}

/**
 * 将选中/粘贴的图片上传为公开 URL，并回填到 Markdown
 * @param files 待上传图片
 * @param callback md-editor 插入链接回调
 */
async function handleUploadImg(files: File[], callback: UploadImgCallBack): Promise<void> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadMessageImage(file);
    if (url) {
      urls.push(url);
    }
  }
  if (urls.length > 0) {
    callback(urls);
  }
}

/**
 * wangEditor 自定义图片上传：校验后走公开上传并插入
 * @param file 待上传文件
 * @param insertFn 编辑器插入回调
 */
async function handleHtmlUploadImage(
  file: File,
  insertFn: (src: string, alt: string, href: string) => void
): Promise<void> {
  const url = await uploadMessageImage(file);
  if (url) {
    insertFn(url, file.name, url);
  }
}

const htmlEditorConfig = computed<Partial<IEditorConfig>>(() => ({
  placeholder: t('inAppTemplate.placeholder.contentHtml'),
  MENU_CONF: {
    uploadImage: {
      customUpload: handleHtmlUploadImage,
    },
  },
}));

/**
 * 缓存编辑器实例，卸载时销毁
 * @param editor wangEditor 实例
 */
function handleHtmlEditorCreated(editor: IDomEditor): void {
  htmlEditorRef.value = editor;
}

onBeforeUnmount(() => {
  const editor = htmlEditorRef.value;
  if (editor == null) {
    return;
  }
  editor.destroy();
  htmlEditorRef.value = undefined;
});
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

  <!-- HTML：wangEditor（工具栏对齐后端白名单，消毒由服务端负责） -->
  <div
    v-else-if="contentType === 'HTML'"
    :class="{ 'in-app-template-content-editor__html--dark': isDark }"
    class="in-app-template-content-editor__html"
  >
    <Toolbar :default-config="HTML_TOOLBAR_CONFIG" :editor="htmlEditorRef" mode="simple" />
    <Editor
      v-model="modelValue"
      :default-config="htmlEditorConfig"
      mode="simple"
      style="height: 460px; overflow-y: hidden"
      @on-created="handleHtmlEditorCreated"
    />
  </div>
</template>

<style scoped>
.in-app-template-content-editor__html {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.in-app-template-content-editor__html :deep(.w-e-toolbar) {
  border-bottom: 1px solid var(--el-border-color);
}

.in-app-template-content-editor__html--dark {
  --w-e-textarea-bg-color: var(--el-bg-color);
  --w-e-textarea-color: var(--el-text-color-primary);
  --w-e-textarea-border-color: var(--el-border-color);
  --w-e-textarea-slight-border-color: var(--el-border-color-lighter);
  --w-e-textarea-slight-color: var(--el-text-color-placeholder);
  --w-e-textarea-slight-bg-color: var(--el-fill-color-light);
  --w-e-textarea-selected-border-color: var(--el-color-primary-light-5);
  --w-e-toolbar-color: var(--el-text-color-regular);
  --w-e-toolbar-bg-color: var(--el-bg-color);
  --w-e-toolbar-active-color: var(--el-text-color-primary);
  --w-e-toolbar-active-bg-color: var(--el-fill-color);
  --w-e-toolbar-disabled-color: var(--el-text-color-disabled);
  --w-e-toolbar-border-color: var(--el-border-color);
  --w-e-modal-button-bg-color: var(--el-fill-color-blank);
  --w-e-modal-button-border-color: var(--el-border-color);
}
</style>

<script lang="ts" setup>
import { type InAppComposeRequest, sendInAppMessage } from '@/api/message/in-app-message';
import { addDialog, closeDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { MESSAGE_TEMPLATE_CONTENT_TYPES } from '@/views/message/_shared/constants/content-type';
import InAppRecipientScopeSelector from '@/views/message/compose/components/InAppRecipientScopeSelector.vue';
import InAppTemplateImportDialog from '@/views/message/compose/components/InAppTemplateImportDialog.vue';
import { IN_APP_COMPOSE_PERMS } from '@/views/message/compose/constants/permissions';
import type { InAppTemplateImportPayload } from '@/views/message/compose/types/template-import';
import InAppTemplateContentEditor from '@/views/message/in-app-template/components/InAppTemplateContentEditor.vue';
import type { FormInstance, FormRules } from 'element-plus';
import { h, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageCompose',
});

const { t } = useI18n();

const formRef = ref<FormInstance>();
const sending = ref(false);

const form = reactive<InAppComposeRequest>({
  recipientScopeType: 'USER',
  recipientScopeIds: [],
  includeChildren: true,
  templateCode: undefined,
  title: '',
  body: '',
  contentType: 'TEXT',
  bizType: undefined,
  linkUrl: undefined,
});

const rules = reactive<FormRules>({
  recipientScopeType: [{ required: true, message: t('inAppCompose.recipientScope'), trigger: 'change' }],
  recipientScopeIds: [
    {
      validator: (_rule, _value, callback) => {
        if (form.recipientScopeType === 'ALL' || (form.recipientScopeIds?.length ?? 0) > 0) {
          callback();
          return;
        }
        callback(new Error(t('inAppCompose.rules.recipientScopeIds')));
      },
      trigger: 'change',
    },
  ],
  title: [{ required: true, message: t('inAppCompose.rules.title'), trigger: 'blur' }],
  body: [{ required: true, message: t('inAppCompose.rules.body'), trigger: 'blur' }],
  contentType: [{ required: true, message: t('inAppCompose.rules.contentType'), trigger: 'change' }],
});

/**
 * 打开模板导入弹窗（分页选择启用中的站内信模板）
 */
function openImportDialog(): void {
  addDialog({
    title: t('inAppCompose.importTemplateDialogTitle'),
    width: '90%',
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    hideFooter: true,
    contentRenderer: ({ options, index }) =>
      h(InAppTemplateImportDialog, {
        onImport: (payload: InAppTemplateImportPayload) => {
          form.templateCode = payload.templateCode;
          form.title = payload.title;
          form.body = payload.body;
          form.contentType = payload.contentType;
          closeDialog(options, index, { command: 'close' });
        },
      }),
  });
}

/**
 * 重置表单为初始态
 */
function resetForm(): void {
  form.recipientScopeType = 'USER';
  form.recipientScopeIds = [];
  form.includeChildren = true;
  form.templateCode = undefined;
  form.title = '';
  form.body = '';
  form.contentType = 'TEXT';
  form.bizType = undefined;
  form.linkUrl = undefined;
  formRef.value?.clearValidate();
}

/**
 * 提交发送
 */
async function handleSend(): Promise<void> {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    return;
  }

  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

  const request: InAppComposeRequest = {
    recipientScopeType: form.recipientScopeType,
    title: form.title,
    body: form.body,
    contentType: form.contentType,
    templateCode: form.templateCode,
    bizType: form.bizType,
    linkUrl: form.linkUrl,
  };

  if (form.recipientScopeType !== 'ALL') {
    request.recipientScopeIds = [...(form.recipientScopeIds ?? [])];
  }

  if (form.recipientScopeType === 'DEPT') {
    request.includeChildren = form.includeChildren;
  }

  try {
    sending.value = true;
    await sendInAppMessage(request);
    message(t('inAppCompose.sendSuccess'), { type: 'success' });
    resetForm();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'inAppCompose.sendFailed' });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="message-compose bg-bg_color rounded p-6">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-medium">{{ t('inAppCompose.pageTitle') }}</h1>
      <el-button-group>
        <el-button v-perms="IN_APP_COMPOSE_PERMS.SEND" type="success" @click="openImportDialog">
          {{ t('inAppCompose.importTemplate') }}
        </el-button>
        <el-button @click="resetForm">{{ t('buttons.actionReset') }}</el-button>
        <el-button v-perms="IN_APP_COMPOSE_PERMS.SEND" :loading="sending" type="primary" @click="handleSend">
          {{ t('inAppCompose.sendButton') }}
        </el-button>
      </el-button-group>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <InAppRecipientScopeSelector
        v-model:include-children="form.includeChildren"
        v-model:recipient-scope-ids="form.recipientScopeIds"
        v-model:recipient-scope-type="form.recipientScopeType"
      />

      <el-divider />

      <!-- 来源模板（可选，仅溯源） -->
      <el-form-item v-if="form.templateCode" :label="t('inAppCompose.templateCodeTrace')">
        <el-tag type="info">{{ form.templateCode }}</el-tag>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item :label="t('inAppCompose.title')" prop="title">
        <el-input
          v-model="form.title"
          :placeholder="t('inAppCompose.placeholder.title')"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- 正文类型 -->
      <el-form-item :label="t('inAppCompose.contentType')" prop="contentType">
        <el-segmented v-model="form.contentType" :options="MESSAGE_TEMPLATE_CONTENT_TYPES" class="w-full" />
      </el-form-item>

      <!-- 业务分类 -->
      <el-form-item :label="t('inAppCompose.bizType')" prop="bizType">
        <el-input
          v-model="form.bizType"
          :placeholder="t('inAppCompose.placeholder.bizType')"
          clearable
          maxlength="64"
        />
      </el-form-item>

      <!-- 跳转链接 -->
      <el-form-item :label="t('inAppCompose.linkUrl')" prop="linkUrl">
        <el-input
          v-model="form.linkUrl"
          :placeholder="t('inAppCompose.placeholder.linkUrl')"
          clearable
          maxlength="500"
        />
      </el-form-item>

      <!-- 正文 -->
      <el-form-item :label="t('inAppCompose.body')" prop="body">
        <InAppTemplateContentEditor v-model="form.body" :content-type="form.contentType" />
      </el-form-item>
    </el-form>
  </div>
</template>

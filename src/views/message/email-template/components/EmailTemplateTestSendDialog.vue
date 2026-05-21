<!--
  测试发送弹窗
-->
<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import {
  createEmptyEmailTestSendForm,
  type EmailTestSendForm,
} from '@/views/message/email-template/utils/email-test-send-form-mapper';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface EmailTemplateTestSendDialogProps extends FormDialog<EmailTestSendForm> {}

const props = withDefaults(defineProps<EmailTemplateTestSendDialogProps>(), {
  form: {},
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<EmailTestSendForm>({ ...createEmptyEmailTestSendForm(), ...props.form });

watch(
  () => props.form,
  (v) => {
    form.value = { ...createEmptyEmailTestSendForm(), ...(v ?? {}) };
  },
  { deep: true }
);

const rules = reactive<FormRules>({
  email: [
    { required: true, message: t('emailTemplate.testSendEmailPlaceholder'), trigger: 'blur' },
    { type: 'email', message: t('emailTemplate.testSendEmailInvalid'), trigger: 'blur' },
  ],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item :label="t('emailTemplate.testSendEmail')" prop="email">
      <el-input v-model="form.email" :placeholder="t('emailTemplate.testSendEmailPlaceholder')" clearable />
    </el-form-item>
  </el-form>
</template>

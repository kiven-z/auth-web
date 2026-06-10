<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { EmailTestSendForm } from '@/views/message/email-template/hooks/useEmailTemplateTableMoreAction';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type EmailTemplateTestSendDialogProps = FormDialog<EmailTestSendForm>;

const props = withDefaults(defineProps<EmailTemplateTestSendDialogProps>(), {
  form: () => ({ id: '', email: '' }),
});

const { t } = useI18n();
const formRef = ref<FormInstance>();

const form = ref<EmailTestSendForm>(props.form);

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

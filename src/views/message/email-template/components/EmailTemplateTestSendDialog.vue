<!--
  测试发送弹窗
-->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export interface EmailTestSendForm {
  id: string;
  email: string;
}

const props = withDefaults(
  defineProps<{
    formInline?: Partial<EmailTestSendForm>;
  }>(),
  {
    formInline: () => ({ id: '', email: '' }),
  }
);

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<EmailTestSendForm>({ id: props.formInline.id ?? '', email: props.formInline.email ?? '' });

watch(
  () => props.formInline,
  (v) => {
    if (v) {
      form.value = { id: v.id ?? '', email: v.email ?? '' };
    }
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

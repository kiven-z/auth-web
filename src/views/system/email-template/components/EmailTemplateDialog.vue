<script lang="ts" setup>
import type { EmailTemplateFormModel } from '@/api/system/email-template';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    formInline?: Partial<EmailTemplateFormModel>;
  }>(),
  {
    formInline: () => ({}),
  }
);

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<EmailTemplateFormModel>(props.formInline as EmailTemplateFormModel);

const rules = reactive<FormRules>({
  // 模板编码
  templateCode: [
    { required: true, message: t('emailTemplate.placeholder.templateCode'), trigger: 'blur' },
    {
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z_-]+$',
      message: t('emailTemplate.rules.templateCodeReg'),
      trigger: 'change',
    },
  ],
  // 模板名称
  templateName: [{ required: true, message: t('emailTemplate.placeholder.templateName'), trigger: 'blur' }],
  // 主题
  subject: [{ required: true, message: t('emailTemplate.placeholder.subject'), trigger: 'blur' }],
  // 状态
  status: [{ required: true, message: t('emailTemplate.placeholder.status'), trigger: 'change' }],
  // 优先级
  priority: [{ required: true, message: t('emailTemplate.placeholder.priority'), trigger: 'change' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 场景编码（scene_code） -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
          <el-input
            v-model="form.templateCode"
            :placeholder="t('emailTemplate.placeholder.templateCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <!-- 模板名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
          <el-input
            v-model="form.templateName"
            :placeholder="t('emailTemplate.placeholder.templateName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <!-- 主题 -->
      <el-col :lg="24" :md="24" :sm="24" :xs="24">
        <el-form-item :label="t('emailTemplate.subject')" prop="subject">
          <el-input
            v-model="form.subject"
            :placeholder="t('emailTemplate.placeholder.subject')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <!-- 优先级 -->
        <el-form-item :label="t('emailTemplate.priority')" prop="priority">
          <el-input-number v-model="form.priority" :max="10" :min="1" class="w-full" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <!-- 状态 -->
        <el-form-item :label="t('emailTemplate.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-text="t('emailTemplate.statusEnabled')"
            :active-value="true"
            :inactive-text="t('emailTemplate.statusDisabled')"
            :inactive-value="false"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <!-- 描述 -->
        <el-form-item :label="t('emailTemplate.description')" prop="description">
          <el-input
            v-model="form.description"
            :placeholder="t('emailTemplate.placeholder.description')"
            autocomplete="off"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

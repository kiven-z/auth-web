<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { InAppTemplateFormModel } from '@/features/message/api/in-app-template';
import type { FormInstance, FormRules } from 'element-plus';
import InAppContentEditor from '@/features/message/_shared/components/InAppContentEditor.vue';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IN_APP_CONTENT_TYPES } from '@/features/message/api/models/content-type';

defineOptions({
  name: 'InAppTemplateDrawer',
});

type InAppTemplateDrawerProps = FormDialog<InAppTemplateFormModel>;

const props = withDefaults(defineProps<InAppTemplateDrawerProps>(), {
  form: () => ({}) as InAppTemplateFormModel,
});

const { t } = useI18n();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const formRef = ref<FormInstance>();

const form = ref<InAppTemplateFormModel>({
  status: true,
  priority: 5,
  contentType: 'MARKDOWN',
  content: '',
  ...props.form,
});

const rules = reactive<FormRules>({
  // 场景编码
  templateCode: [
    { required: true, message: t('inAppTemplate.placeholder.templateCode'), trigger: 'blur' },
    {
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z_-]+$',
      message: t('inAppTemplate.rules.templateCodeReg'),
      trigger: 'change',
    },
  ],
  // 模板名称
  templateName: [{ required: true, message: t('inAppTemplate.placeholder.templateName'), trigger: 'blur' }],
  // 标题
  subject: [{ required: true, message: t('inAppTemplate.placeholder.subject'), trigger: 'blur' }],
  // 正文类型
  contentType: [{ required: true, message: t('inAppTemplate.placeholder.contentType'), trigger: 'change' }],
  // 正文
  content: [{ required: true, message: t('inAppTemplate.placeholder.content'), trigger: 'blur' }],
  // 状态
  status: [{ required: true, message: t('inAppTemplate.placeholder.status'), trigger: 'change' }],
  // 优先级
  priority: [{ required: true, message: t('inAppTemplate.placeholder.priority'), trigger: 'change' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 场景编码（scene_code） -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.templateCode')" prop="templateCode">
          <el-input
            v-model="form.templateCode"
            :placeholder="t('inAppTemplate.placeholder.templateCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.templateName')" prop="templateName">
          <el-input
            v-model="form.templateName"
            :placeholder="t('inAppTemplate.placeholder.templateName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <!-- 标题模板（subject） -->
      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.subject')" prop="subject">
          <el-input
            v-model="form.subject"
            :placeholder="t('inAppTemplate.placeholder.subject')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.contentType')" prop="contentType">
          <el-radio-group v-model="form.contentType">
            <el-radio-button v-for="type in IN_APP_CONTENT_TYPES" :key="type" :value="type">
              {{ type }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.priority')" prop="priority">
          <el-input-number v-model="form.priority" :max="10" :min="1" class="w-full" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in booleanStatusOptions" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.description')" prop="description">
          <el-input
            v-model="form.description"
            :placeholder="t('inAppTemplate.placeholder.description')"
            autocomplete="off"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <!-- 模板正文：按 contentType 切换编辑器 -->
        <el-form-item :label="t('inAppTemplate.content')" prop="content">
          <InAppContentEditor v-model="form.content" :content-type="form.contentType" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

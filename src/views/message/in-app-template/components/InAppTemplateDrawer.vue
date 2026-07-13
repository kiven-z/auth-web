<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { InAppTemplateFormModel } from '@/api/message/in-app-template';
import type { FormInstance, FormRules } from 'element-plus';
import InAppTemplateContentEditor from '@/views/message/in-app-template/components/InAppTemplateContentEditor.vue';
import { MESSAGE_TEMPLATE_CONTENT_TYPES } from '@/views/message/_shared/constants/content-type';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppTemplateDrawer',
});

type InAppTemplateDrawerProps = FormDialog<InAppTemplateFormModel>;

const props = withDefaults(defineProps<InAppTemplateDrawerProps>(), {
  form: () => ({}) as InAppTemplateFormModel,
});

const { t } = useI18n();
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

      <!-- 模板名称 -->
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

      <!-- 正文类型 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.contentType')" prop="contentType">
          <el-radio-group v-model="form.contentType">
            <!-- HTML 编辑器未就绪，先禁用 -->
            <el-radio-button v-for="type in MESSAGE_TEMPLATE_CONTENT_TYPES" :key="type" :value="type">
              {{ type }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <!-- 优先级 -->
        <el-form-item :label="t('inAppTemplate.priority')" prop="priority">
          <el-input-number v-model="form.priority" :max="10" :min="1" class="w-full" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <!-- 状态 -->
        <el-form-item :label="t('inAppTemplate.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-text="t('buttons.statusActiveText')"
            :active-value="true"
            :inactive-text="t('buttons.statusInactiveText')"
            :inactive-value="false"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <!-- 描述 -->
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
          <InAppTemplateContentEditor v-model="form.content" :content-type="form.contentType" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

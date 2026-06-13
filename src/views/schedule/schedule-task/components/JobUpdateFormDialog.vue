<script lang="ts" setup>
import type { SysJobDetailRow, SysJobUpdateForm } from '@/api/schedule/job';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import JobFormScheduleExtrasFields from '@/views/schedule/schedule-task/components/JobFormScheduleExtrasFields.vue';
import { JOB_TASK_TYPE_OPTIONS } from '@/views/schedule/schedule-task/constants/job-task-enums';
import type { FormInstance, FormRules } from 'element-plus';
import { CodeEditor } from 'monaco-editor-vue3';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobUpdateFormDialog',
});

interface JobUpdateFormDialogProps {
  detail: SysJobDetailRow;
}

const props = defineProps<JobUpdateFormDialogProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const formRef = ref<FormInstance>();

const form = ref(props.detail as SysJobUpdateForm);

const taskTypeLabel = computed(() => {
  const option = JOB_TASK_TYPE_OPTIONS.find((item) => item.value === props.detail.taskType);
  return option ? t(option.labelKey) : (props.detail.taskType ?? '—');
});

const isBeanInvoke = computed(() => form.value.taskType === 'BEAN_INVOKE');
const isMessageDispatch = computed(() => form.value.taskType === 'MESSAGE_DISPATCH');

const rules = computed<FormRules>(() => ({
  cronExpression: [
    { required: true, message: ph.select('scheduleTask.fields.cronExpression'), trigger: 'change' },
    { max: 255, message: t('scheduleTask.validation.cronExpressionLengthLimit'), trigger: 'change' },
  ],
  misfirePolicy: [{ required: true, message: ph.select('scheduleTask.fields.misfirePolicy'), trigger: 'change' }],
  concurrent: [{ required: true, message: ph.select('scheduleTask.fields.concurrent'), trigger: 'change' }],
  status: [{ required: true, message: ph.select('scheduleTask.fields.status'), trigger: 'change' }],
  ...(isBeanInvoke.value
    ? { invokeTarget: [{ required: true, message: ph.input('scheduleTask.fields.invokeTarget'), trigger: 'blur' }] }
    : {}),
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobName')">
          <el-input :model-value="detail.jobName" disabled />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobGroup')">
          <el-input :model-value="detail.jobGroup" disabled />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.taskType')">
          <el-input :model-value="taskTypeLabel" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="detail.jobClass" :span="24">
        <el-form-item :label="t('scheduleTask.fields.jobClass')">
          <el-input :model-value="detail.jobClass" disabled />
        </el-form-item>
      </el-col>

      <el-col v-if="isBeanInvoke" :span="24">
        <el-form-item :label="t('scheduleTask.fields.invokeTarget')" prop="invokeTarget">
          <el-input
            v-model="form.invokeTarget"
            :placeholder="ph.input('scheduleTask.fields.invokeTarget')"
            :rows="2"
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <template v-if="isMessageDispatch">
        <el-col :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item :label="t('scheduleTask.fields.handlerCode')" prop="handlerCode">
            <el-input v-model="form.handlerCode" :placeholder="ph.input('scheduleTask.fields.handlerCode')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.fields.payloadJson')" prop="payloadJson">
            <CodeEditor
              v-model:value="form.payloadJson"
              class="border"
              height="150"
              language="json"
              show-progress
              theme="vs"
            />
          </el-form-item>
        </el-col>
      </template>

      <JobFormScheduleExtrasFields v-model:form="form" />
    </el-row>
  </el-form>
</template>

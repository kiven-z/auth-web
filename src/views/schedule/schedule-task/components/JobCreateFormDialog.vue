<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import {
  getJobCatalogClasses,
  getJobCatalogMethods,
  type QuartzTaskClassRow,
  type QuartzTaskMethodRow,
  type SysJobCreateForm,
} from '@/api/schedule/job';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { errorMessage } from '@/ui/feedback/message';
import JobCatalogClassPicker from '@/views/schedule/schedule-task/components/JobCatalogClassPicker.vue';
import JobFormScheduleExtrasFields from '@/views/schedule/schedule-task/components/JobFormScheduleExtrasFields.vue';
import { JOB_TASK_TYPE_FORM_OPTIONS } from '@/views/schedule/schedule-task/constants/job-task-enums';
import useJobGroupRemoteSearch from '@/views/schedule/schedule-task/hooks/useJobGroupRemoteSearch';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobCreateFormDialog',
});

type JobCreateFormDialogProps = FormDialog<SysJobCreateForm>;

const props = withDefaults(defineProps<JobCreateFormDialogProps>(), {
  form: () => ({}) as SysJobCreateForm,
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const formRef = ref<FormInstance>();

const form = ref<SysJobCreateForm>({
  taskType: 'BEAN_INVOKE',
  misfirePolicy: 2,
  concurrent: false,
  status: true,
  ...props.form,
});

const { jobGroupOptions, loadingJobGroups, loadJobGroupByKeyword } = useJobGroupRemoteSearch();
const catalogClasses = ref<QuartzTaskClassRow[]>([]);
const catalogMethods = ref<QuartzTaskMethodRow[]>([]);
const selectedBeanClass = ref<string>();
const selectedBeanMethod = ref<string>();
const loadingMethods = ref(false);

const isBeanInvoke = computed(() => form.value.taskType === 'BEAN_INVOKE');
const isCustomClass = computed(() => form.value.taskType === 'CUSTOM_CLASS');

const beanCatalogClasses = computed(() =>
  catalogClasses.value.filter((item) => item.invokeModes?.includes('BEAN_INVOKE'))
);
const customCatalogClasses = computed(() =>
  catalogClasses.value.filter((item) => item.invokeModes?.includes('CUSTOM_CLASS'))
);
const jobParamsExample = computed(() => {
  if (!isCustomClass.value || !form.value.jobClass) {
    return undefined;
  }
  return customCatalogClasses.value.find((item) => item.className === form.value.jobClass)?.jobParamsExample;
});

const rules = computed<FormRules>(() => ({
  jobName: [
    { required: true, message: ph.input('scheduleTask.fields.jobName'), trigger: 'blur' },
    { max: 64, message: t('scheduleTask.validation.jobNameLengthLimit'), trigger: 'blur' },
  ],
  jobGroup: [{ required: true, message: ph.select('scheduleTask.fields.jobGroup'), trigger: 'change' }],
  taskType: [{ required: true, message: ph.select('scheduleTask.fields.taskType'), trigger: 'change' }],
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
  ...(isCustomClass.value
    ? { jobClass: [{ required: true, message: ph.select('scheduleTask.fields.jobClass'), trigger: 'change' }] }
    : {}),
}));

/**
 * 加载白名单任务类
 */
async function loadCatalogClasses() {
  try {
    catalogClasses.value = await getJobCatalogClasses();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'scheduleTask.messages.loadCatalogFailed' });
  }
}

/**
 * 加载 Bean 调用可选方法
 * @param className 类全限定名
 */
async function loadCatalogMethods(className: string) {
  loadingMethods.value = true;
  catalogMethods.value = [];
  selectedBeanMethod.value = undefined;
  try {
    catalogMethods.value = await getJobCatalogMethods(className);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'scheduleTask.messages.loadCatalogFailed' });
  } finally {
    loadingMethods.value = false;
  }
}

watch(
  () => form.value.taskType,
  (taskType) => {
    if (taskType === 'BEAN_INVOKE') {
      form.value.jobClass = undefined;
      form.value.jobParams = undefined;
      return;
    }
    if (taskType === 'CUSTOM_CLASS') {
      form.value.invokeTarget = undefined;
      selectedBeanClass.value = undefined;
      selectedBeanMethod.value = undefined;
      catalogMethods.value = [];
    }
  }
);

watch(
  () => form.value.jobClass,
  (className) => {
    if (!isCustomClass.value || !className) {
      return;
    }
    const catalogClass = customCatalogClasses.value.find((item) => item.className === className);
    if (!catalogClass?.jobParamsExample) {
      return;
    }
    form.value.jobParams = JSON.stringify(JSON.parse(catalogClass.jobParamsExample), null, 2);
  }
);

watch(selectedBeanClass, (className) => {
  if (!className) {
    catalogMethods.value = [];
    selectedBeanMethod.value = undefined;
    return;
  }
  void loadCatalogMethods(className);
});

watch(selectedBeanMethod, (methodKey) => {
  if (!methodKey) {
    return;
  }
  const method = catalogMethods.value.find((item) => `${item.methodName}:${item.parameterSignature}` === methodKey);
  if (method) {
    form.value.invokeTarget = method.invokeTargetExample;
  }
});

onMounted(() => {
  void loadJobGroupByKeyword(undefined);
  void loadCatalogClasses();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobName')" prop="jobName">
          <el-input v-model="form.jobName" :placeholder="ph.input('scheduleTask.fields.jobName')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobGroup')" prop="jobGroup">
          <el-select
            v-model="form.jobGroup"
            :loading="loadingJobGroups"
            :placeholder="ph.select('scheduleTask.fields.jobGroup')"
            :remote-method="loadJobGroupByKeyword"
            class="w-full"
            filterable
            remote
          >
            <el-option
              v-for="item in jobGroupOptions"
              :key="item.id"
              :label="`${item.groupName} (${item.groupCode})`"
              :value="item.groupCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.taskType')" prop="taskType">
          <el-select v-model="form.taskType" :placeholder="ph.select('scheduleTask.fields.taskType')" class="w-full">
            <el-option
              v-for="opt in JOB_TASK_TYPE_FORM_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <template v-if="isBeanInvoke">
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.beanInvoke.class')">
            <JobCatalogClassPicker
              v-model="selectedBeanClass"
              :options="beanCatalogClasses"
              :placeholder="ph.select('scheduleTask.beanInvoke.class')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item :label="t('scheduleTask.beanInvoke.method')">
            <el-select
              v-model="selectedBeanMethod"
              :disabled="!selectedBeanClass"
              :loading="loadingMethods"
              :placeholder="ph.select('scheduleTask.beanInvoke.method')"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in catalogMethods"
                :key="`${item.methodName}:${item.parameterSignature}`"
                :label="`${item.methodName}${item.parameterSignature}`"
                :value="`${item.methodName}:${item.parameterSignature}`"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.fields.invokeTarget')" prop="invokeTarget">
            <el-input
              v-model="form.invokeTarget"
              :placeholder="ph.input('scheduleTask.fields.invokeTarget')"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </template>

      <template v-if="isCustomClass">
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.fields.jobClass')" prop="jobClass">
            <JobCatalogClassPicker
              v-model="form.jobClass"
              :options="customCatalogClasses"
              :placeholder="ph.select('scheduleTask.fields.jobClass')"
            />
          </el-form-item>
        </el-col>
      </template>

      <JobFormScheduleExtrasFields v-model:form="form" :job-params-example="jobParamsExample" />
    </el-row>
  </el-form>
</template>

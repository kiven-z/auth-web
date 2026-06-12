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

const rules = computed<FormRules>(() => ({
  jobName: [
    { required: true, message: ph.input('scheduleTask.jobName'), trigger: 'blur' },
    { max: 64, message: t('scheduleTask.jobNameLengthLimit'), trigger: 'blur' },
  ],
  jobGroup: [{ required: true, message: ph.select('scheduleTask.jobGroup'), trigger: 'change' }],
  taskType: [{ required: true, message: ph.select('scheduleTask.taskType'), trigger: 'change' }],
  cronExpression: [
    { required: true, message: ph.select('scheduleTask.cronExpression'), trigger: 'change' },
    { max: 255, message: t('scheduleTask.cronExpressionLengthLimit'), trigger: 'change' },
  ],
  misfirePolicy: [{ required: true, message: ph.select('scheduleTask.misfirePolicy'), trigger: 'change' }],
  concurrent: [{ required: true, message: ph.select('scheduleTask.concurrent'), trigger: 'change' }],
  status: [{ required: true, message: ph.select('scheduleTask.status'), trigger: 'change' }],
  ...(isBeanInvoke.value
    ? { invokeTarget: [{ required: true, message: ph.input('scheduleTask.invokeTarget'), trigger: 'blur' }] }
    : {}),
  ...(isCustomClass.value
    ? { jobClass: [{ required: true, message: ph.select('scheduleTask.jobClass'), trigger: 'change' }] }
    : {}),
}));

/**
 * 加载白名单任务类
 */
async function loadCatalogClasses() {
  try {
    catalogClasses.value = await getJobCatalogClasses();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'scheduleTask.loadCatalogFailed' });
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
    errorMessage(error, { defaultI18nKey: 'scheduleTask.loadCatalogFailed' });
  } finally {
    loadingMethods.value = false;
  }
}

watch(
  () => form.value.taskType,
  (taskType) => {
    if (taskType === 'BEAN_INVOKE') {
      form.value.jobClass = undefined;
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
        <el-form-item :label="t('scheduleTask.jobName')" prop="jobName">
          <el-input v-model="form.jobName" :placeholder="ph.input('scheduleTask.jobName')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.jobGroup')" prop="jobGroup">
          <el-select
            v-model="form.jobGroup"
            :loading="loadingJobGroups"
            :placeholder="ph.select('scheduleTask.jobGroup')"
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
        <el-form-item :label="t('scheduleTask.taskType')" prop="taskType">
          <el-select v-model="form.taskType" :placeholder="ph.select('scheduleTask.taskType')" class="w-full">
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
          <el-form-item :label="t('scheduleTask.beanInvokeClass')">
            <JobCatalogClassPicker
              v-model="selectedBeanClass"
              :options="beanCatalogClasses"
              :placeholder="ph.select('scheduleTask.beanInvokeClass')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item :label="t('scheduleTask.beanInvokeMethod')">
            <el-select
              v-model="selectedBeanMethod"
              :disabled="!selectedBeanClass"
              :loading="loadingMethods"
              :placeholder="ph.select('scheduleTask.beanInvokeMethod')"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in catalogMethods"
                :key="`${item.methodName}:${item.parameterSignature}`"
                :label="`${item.methodName}(${item.parameterSignature})`"
                :value="`${item.methodName}:${item.parameterSignature}`"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.invokeTarget')" prop="invokeTarget">
            <el-input
              v-model="form.invokeTarget"
              :placeholder="ph.input('scheduleTask.invokeTarget')"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </template>

      <template v-if="isCustomClass">
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.jobClass')" prop="jobClass">
            <JobCatalogClassPicker
              v-model="form.jobClass"
              :options="customCatalogClasses"
              :placeholder="ph.select('scheduleTask.jobClass')"
            />
          </el-form-item>
        </el-col>
      </template>

      <JobFormScheduleExtrasFields v-model:form="form" />
    </el-row>
  </el-form>
</template>

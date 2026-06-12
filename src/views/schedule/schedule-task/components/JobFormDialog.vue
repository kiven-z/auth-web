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
import { JOB_CRON_PRESET_OPTIONS } from '@/views/schedule/schedule-task/constants/job-cron-presets';
import {
  JOB_MISFIRE_POLICY_OPTIONS,
  JOB_TASK_TYPE_FORM_OPTIONS,
} from '@/views/schedule/schedule-task/constants/job-task-enums';
import useJobGroupRemoteSearch from '@/views/schedule/schedule-task/hooks/useJobGroupRemoteSearch';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CodeEditor } from 'monaco-editor-vue3';

defineOptions({
  name: 'JobFormDialog',
});

const props = withDefaults(defineProps<FormDialog<SysJobCreateForm>>(), {
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
  invokeTarget: isBeanInvoke.value
    ? [{ required: true, message: ph.input('scheduleTask.invokeTarget'), trigger: 'blur' }]
    : [],
  jobClass: isCustomClass.value
    ? [{ required: true, message: ph.select('scheduleTask.jobClass'), trigger: 'change' }]
    : [],
  remark: [{ max: 500, message: t('scheduleTask.remarkLengthLimit'), trigger: 'blur' }],
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
      <!-- 任务名称 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.jobName')" prop="jobName">
          <el-input v-model="form.jobName" :placeholder="ph.input('scheduleTask.jobName')" />
        </el-form-item>
      </el-col>
      <!-- 任务分组 -->
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
      <!-- 任务类型 -->
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
        <!-- Bean 调用类 -->
        <el-col :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item :label="t('scheduleTask.beanInvokeClass')">
            <el-select
              v-model="selectedBeanClass"
              :placeholder="ph.select('scheduleTask.beanInvokeClass')"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in catalogClasses"
                :key="item.className"
                :label="item.name || item.className"
                :value="item.className"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- Bean 调用方法 -->
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
        <!-- 调用目标 -->
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
        <!-- 任务类 -->
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.jobClass')" prop="jobClass">
            <el-select
              v-model="form.jobClass"
              :placeholder="ph.select('scheduleTask.jobClass')"
              class="w-full"
              filterable
            >
              <el-option
                v-for="item in catalogClasses"
                :key="item.className"
                :label="item.name || item.className"
                :value="item.className"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>

      <!-- Cron 表达式 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.cronExpression')" prop="cronExpression">
          <el-select
            v-model="form.cronExpression"
            :placeholder="ph.select('scheduleTask.cronExpression')"
            allow-create
            class="w-full"
            default-first-option
            filterable
          >
            <el-option
              v-for="opt in JOB_CRON_PRESET_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 错失策略 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.misfirePolicy')" prop="misfirePolicy">
          <el-select v-model="form.misfirePolicy" :placeholder="ph.select('scheduleTask.misfirePolicy')" class="w-full">
            <el-option
              v-for="opt in JOB_MISFIRE_POLICY_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 是否并发 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.concurrent')" prop="concurrent">
          <el-radio-group v-model="form.concurrent">
            <el-radio :value="true">{{ t('scheduleTask.concurrentAllowed') }}</el-radio>
            <el-radio :value="false">{{ t('scheduleTask.concurrentForbidden') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 运行状态 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('buttons.statusActiveText') }}</el-radio>
            <el-radio :value="false">{{ t('buttons.statusInactiveText') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 开始时间 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.startTime')" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            :placeholder="ph.select('scheduleTask.startTime')"
            class="w-full!"
            clearable
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <!-- 结束时间 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.endTime')" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            :placeholder="ph.select('scheduleTask.endTime')"
            class="w-full!"
            clearable
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <!-- 执行参数 JSON -->
      <el-col :span="24">
        <el-form-item :label="t('scheduleTask.jobParams')" prop="jobParams">
          <CodeEditor
            v-model:value="form.jobParams"
            class="border"
            height="150"
            language="json"
            show-progress
            theme="vs"
          />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('scheduleTask.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="ph.input('scheduleTask.remark')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

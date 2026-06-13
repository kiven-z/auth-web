<script lang="ts" setup>
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { JOB_CRON_PRESET_OPTIONS } from '@/views/schedule/schedule-task/constants/job-cron-presets';
import { JOB_MISFIRE_POLICY_OPTIONS } from '@/views/schedule/schedule-task/constants/job-task-enums';
import { useI18n } from 'vue-i18n';
import { CodeEditor } from 'monaco-editor-vue3';

defineOptions({
  name: 'JobFormScheduleExtrasFields',
});

/** 新增与修改表单共用的调度与扩展字段 */
export interface JobFormScheduleExtrasModel {
  cronExpression: string;
  misfirePolicy: number;
  concurrent: boolean;
  status: boolean;
  startTime?: string;
  endTime?: string;
  jobParams?: string;
  remark?: string;
}

const form = defineModel<JobFormScheduleExtrasModel>('form', { required: true });

const { t } = useI18n();
const ph = useFormPlaceholder();
</script>

<template>
  <!-- Cron 表达式 -->
  <el-col :lg="12" :md="12" :sm="24" :xs="24">
    <el-form-item :label="t('scheduleTask.fields.cronExpression')" prop="cronExpression">
      <el-select
        v-model="form.cronExpression"
        :placeholder="ph.select('scheduleTask.fields.cronExpression')"
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
    <el-form-item :label="t('scheduleTask.fields.misfirePolicy')" prop="misfirePolicy">
      <el-select
        v-model="form.misfirePolicy"
        :placeholder="ph.select('scheduleTask.fields.misfirePolicy')"
        class="w-full"
      >
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
    <el-form-item :label="t('scheduleTask.fields.concurrent')" prop="concurrent">
      <el-radio-group v-model="form.concurrent">
        <el-radio :value="true">{{ t('scheduleTask.enums.concurrent.allowed') }}</el-radio>
        <el-radio :value="false">{{ t('scheduleTask.enums.concurrent.forbidden') }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-col>
  <!-- 运行状态 -->
  <el-col :lg="12" :md="12" :sm="24" :xs="24">
    <el-form-item :label="t('scheduleTask.fields.status')" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio :value="true">{{ t('buttons.statusActiveText') }}</el-radio>
        <el-radio :value="false">{{ t('buttons.statusInactiveText') }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-col>
  <!-- 开始时间 -->
  <el-col :lg="12" :md="12" :sm="24" :xs="24">
    <el-form-item :label="t('scheduleTask.fields.startTime')" prop="startTime">
      <el-date-picker
        v-model="form.startTime"
        :placeholder="ph.select('scheduleTask.fields.startTime')"
        class="w-full!"
        clearable
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ss"
      />
    </el-form-item>
  </el-col>
  <!-- 结束时间 -->
  <el-col :lg="12" :md="12" :sm="24" :xs="24">
    <el-form-item :label="t('scheduleTask.fields.endTime')" prop="endTime">
      <el-date-picker
        v-model="form.endTime"
        :placeholder="ph.select('scheduleTask.fields.endTime')"
        class="w-full!"
        clearable
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ss"
      />
    </el-form-item>
  </el-col>
  <!-- 执行参数 JSON -->
  <el-col :span="24">
    <el-form-item :label="t('scheduleTask.fields.jobParams')" prop="jobParams">
      <CodeEditor v-model:value="form.jobParams" class="border" height="150" language="json" show-progress theme="vs" />
    </el-form-item>
  </el-col>
  <!-- 备注 -->
  <el-col :span="24">
    <el-form-item :label="t('scheduleTask.fields.remark')" prop="remark">
      <el-input
        v-model="form.remark"
        :placeholder="ph.input('scheduleTask.fields.remark')"
        :rows="3"
        maxlength="500"
        show-word-limit
        type="textarea"
      />
    </el-form-item>
  </el-col>
</template>

<script lang="ts" setup>
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { message } from '@/ui/feedback/message';
import { JOB_CRON_PRESET_OPTIONS } from '@/views/schedule/schedule-task/constants/job-cron-presets';
import { JOB_MISFIRE_POLICY_OPTIONS } from '@/views/schedule/schedule-task/constants/job-task-enums';
import { CodeEditor } from 'monaco-editor-vue3';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

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

const props = withDefaults(defineProps<{ jobParamsExample?: string }>(), {});

const form = defineModel<JobFormScheduleExtrasModel>('form', { required: true });

const { t } = useI18n();
const ph = useFormPlaceholder();

/**
 * 格式化后写入 job_params；force 为 true 时始终覆盖
 * @param raw 原始 JSON 文本
 * @param _force 是否强制覆盖当前值
 */
function setFormattedJobParams(raw: string | undefined, _force = false) {
  if (!raw) return;

  try {
    form.value.jobParams = JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return;
  }
}

/**
 * 将目录示例填入 job_params 编辑器
 */
function applyJobParamsExample() {
  if (!props.jobParamsExample) {
    message(t('scheduleTask.messages.templateExampleUnavailable'), { type: 'warning' });
    return;
  }

  setFormattedJobParams(props.jobParamsExample, true);
}

onMounted(() => {
  setFormattedJobParams(form.value.jobParams);
});
</script>

<template>
  <el-col :span="24">
    <el-alert class="mb-3!" closable show-icon title="调度说明" type="info">
      <ul class="m-0 pl-4 leading-relaxed">
        <li>
          勾选「不补跑」和「禁止并发」并不能保证保存或重启后只执行一次。若服务曾停机、热重启，或 Cron 频率很高（如每 3
          秒），日志里仍可能短时间出现多条记录，多数是调度器在消化积压，不一定是接口或配置错误。
        </li>
        <li>
          「禁止并发」表示同一任务同一时刻不会重叠执行；前一次结束后可以立刻跑下一次。任务很快结束时，多条日志间隔可能只有几毫秒，看起来像并发，实为排队快进。
        </li>
        <li>
          <strong>错失策略：</strong>
          不补跑（推荐）跳过错失触发，等下次正常 Cron；补跑一次在停机恢复后最多补 1
          次；补跑全部（慎用）会把停机期间错过的每一次都尽快补跑，高频 Cron 下可能瞬间大量执行。
        </li>
        <li>
          保存任务会重建 Quartz 调度。开发环境常伴随热重启，配合高频 Cron
          时更容易在改完后看到连跑几次再恢复正常；生产环境用分钟级 Cron 且选「不补跑」通常不会出现明显爆发。
        </li>
        <li>
          业务任务推荐不补跑 + 禁止并发（远程调用）；开发 Demo 避免「每 3 秒」类 Cron；多个任务调用同一微服务时尽量错开
          Cron。
        </li>
      </ul>
    </el-alert>
  </el-col>

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
      <div class="flex w-full min-w-0 flex-col gap-2">
        <div class="flex w-full justify-end">
          <el-button link type="primary" @click.prevent="applyJobParamsExample">
            {{ t('scheduleTask.actions.fillTemplateExample') }}
          </el-button>
        </div>
        <CodeEditor
          v-model:value="form.jobParams"
          class="w-full border"
          height="260"
          language="json"
          show-progress
          theme="vs"
        />
      </div>
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

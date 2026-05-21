<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { CreateJobGroupRequest, UpdateJobGroupRequest } from '@/api/schedule/job-group';
import { createEmptyJobGroupForm } from '@/views/schedule/schedule-group/utils/job-group-form-mapper';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupFormDialog',
});

type JobGroupForm = CreateJobGroupRequest & UpdateJobGroupRequest;

interface ScheduleGroupFormDialogProps extends FormDialog<JobGroupForm> {
  mode: 'add' | 'edit';
}

const props = withDefaults(defineProps<ScheduleGroupFormDialogProps>(), {
  form: {},
  mode: 'add',
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<JobGroupForm>({ ...createEmptyJobGroupForm(), ...props.form });

const rules = computed<FormRules>(() => ({
  groupCode: [
    { required: true, message: t('scheduleGroup.placeholder.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: t('scheduleGroup.placeholder.code'),
      trigger: 'blur',
    },
  ],
  groupName: [{ required: true, message: t('scheduleGroup.placeholder.name'), trigger: 'blur' }],
  status: [{ required: true, message: t('scheduleGroup.placeholder.status'), trigger: 'change' }],
  orderNum: [{ required: true, message: t('scheduleGroup.placeholder.orderNum'), trigger: 'blur' }],
}));

watch(
  () => props.form,
  (v) => {
    form.value = { ...createEmptyJobGroupForm(), ...(v ?? {}) };
    formRef.value?.clearValidate();
  },
  { deep: true }
);

defineExpose({
  formRef,
  form,
});
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item v-if="mode === 'add'" :label="t('scheduleGroup.code')" prop="groupCode">
          <el-input v-model="form.groupCode" :placeholder="t('scheduleGroup.placeholder.code')" />
        </el-form-item>
        <el-form-item v-else :label="t('scheduleGroup.code')">
          <el-input v-model="form.groupCode" disabled />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.name')" prop="groupName">
          <el-input v-model="form.groupName" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" class="w-full!" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.status')" prop="status">
          <el-switch
            v-model="form.status"
            :active-text="t('scheduleGroup.statusEnabled')"
            :active-value="true"
            :inactive-text="t('scheduleGroup.statusDisabled')"
            :inactive-value="false"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('scheduleGroup.description')" prop="description">
          <el-input v-model="form.description" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

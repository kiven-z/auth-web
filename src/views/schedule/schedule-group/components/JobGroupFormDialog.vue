<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupFormDialog',
});

const props = defineProps<{
  formInline: Record<string, any>;
  mode: 'add' | 'edit';
}>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const rules = computed<FormRules>(() => ({
  // 分组编码
  groupCode: [
    { required: true, message: t('schedule.group.placeholder.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: t('schedule.group.placeholder.code'),
      trigger: 'blur',
    },
  ],
  // 分组名称
  groupName: [{ required: true, message: t('schedule.group.placeholder.name'), trigger: 'blur' }],
  // 分组状态
  status: [{ required: true, message: t('schedule.group.placeholder.status'), trigger: 'change' }],
  // 排序号
  orderNum: [{ required: true, message: t('schedule.group.placeholder.orderNum'), trigger: 'blur' }],
}));

watch(
  () => props.formInline,
  () => formRef.value?.clearValidate(),
  { deep: true }
);

defineExpose({
  formRef,
});
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="120px">
    <el-row :gutter="14">
      <!-- 分组编码 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item v-if="mode === 'add'" :label="t('schedule.group.code')" prop="groupCode">
          <el-input v-model="formInline.groupCode" :placeholder="t('schedule.group.placeholder.code')" />
        </el-form-item>
        <el-form-item v-else :label="t('schedule.group.code')">
          <el-input v-model="formInline.groupCode" disabled />
        </el-form-item>
      </el-col>

      <!-- 分组名称 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('schedule.group.name')" prop="groupName">
          <el-input v-model="formInline.groupName" />
        </el-form-item>
      </el-col>

      <!-- 分组描述 -->
      <el-col :span="24">
        <el-form-item :label="t('schedule.group.description')" prop="description">
          <el-input v-model="formInline.description" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>

      <!-- 排序号 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('schedule.group.orderNum')" prop="orderNum">
          <el-input-number v-model="formInline.orderNum" :min="0" class="w-full!" />
        </el-form-item>
      </el-col>

      <!-- 分组状态 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('schedule.group.status')" prop="status">
          <el-switch
            v-model="formInline.status"
            :active-text="t('schedule.status.enabled')"
            :active-value="1"
            :inactive-text="t('schedule.status.disabled')"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

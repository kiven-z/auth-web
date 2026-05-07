<!--
  任务分组新增/编辑表单（编辑时 group_code 只读）
-->
<script lang="ts" setup>
import { transformI18n } from '@/plugins/i18n';
import { computed, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{
  formInline: Record<string, any>;
  mode: 'add' | 'edit';
}>();

const formRef = ref<FormInstance>();

const rules = computed<FormRules>(() => ({
  // 分组编码
  groupCode: [
    { required: true, message: transformI18n('schedule.group.placeholder.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: transformI18n('schedule.group.placeholder.code'),
      trigger: 'blur',
    },
  ],
  // 分组名称
  groupName: [{ required: true, message: transformI18n('schedule.group.placeholder.name'), trigger: 'blur' }],
  // 分组状态
  status: [{ required: true, message: 'status', trigger: 'change' }],
  // 排序号
  orderNum: [{ required: true, message: 'order', trigger: 'blur' }],
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
        <el-form-item v-if="mode === 'add'" :label="transformI18n('schedule.group.code')" prop="groupCode">
          <el-input v-model="formInline.groupCode" :placeholder="transformI18n('schedule.group.placeholder.code')" />
        </el-form-item>

        <el-form-item v-else :label="transformI18n('schedule.group.code')">
          <el-input v-model="formInline.groupCode" disabled />
        </el-form-item>
      </el-col>

      <!-- 分组名称 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="transformI18n('schedule.group.name')" prop="groupName">
          <el-input v-model="formInline.groupName" />
        </el-form-item>
      </el-col>

      <!-- 分组描述 -->
      <el-col :span="24">
        <el-form-item :label="transformI18n('schedule.group.description')" prop="description">
          <el-input v-model="formInline.description" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>

      <!-- 排序号 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="transformI18n('schedule.group.orderNum')" prop="orderNum">
          <el-input-number v-model="formInline.orderNum" :min="0" class="!w-full" />
        </el-form-item>
      </el-col>

      <!-- 分组状态 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="transformI18n('schedule.group.status')" prop="status">
          <el-switch
            v-model="formInline.status"
            :active-text="transformI18n('schedule.status.enabled')"
            :active-value="1"
            :inactive-text="transformI18n('schedule.status.disabled')"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import type { SysPostCreateForm } from '@/api/system/post';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    formInline?: Partial<SysPostCreateForm>;
  }>(),
  {
    formInline: () => ({}),
  }
);

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<SysPostCreateForm>(props.formInline as SysPostCreateForm);

const rules = reactive<FormRules>({
  deptId: [{ required: true, message: t('post.deptName'), trigger: 'change' }],
  postCode: [{ required: true, message: t('post.postCode'), trigger: 'blur' }],
  postName: [{ required: true, message: t('post.postName'), trigger: 'blur' }],
  status: [{ required: true, message: t('post.status'), trigger: 'change' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 岗位编码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.postCode')" prop="postCode">
          <el-input v-model="form.postCode" :placeholder="t('post.postCode')" />
        </el-form-item>
      </el-col>
      <!-- 岗位名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.postName')" prop="postName">
          <el-input v-model="form.postName" :placeholder="t('post.postName')" />
        </el-form-item>
      </el-col>
      <!-- 所属部门 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.deptName')" prop="deptId">
          <el-input v-model="form.deptId" :placeholder="t('post.deptName')" disabled />
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('post.statusNormal') }}</el-radio>
            <el-radio :value="false">{{ t('post.statusDisabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 显示顺序 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" :max="9999" />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('post.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('post.remark')"
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

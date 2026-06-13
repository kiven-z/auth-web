<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { SysRoleCreateForm, SysRoleUpdateForm } from '@/api/system/role';
import { ROLE_CODE_REGEX } from '@/views/system/role/constants/role-code-convention';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type RoleFormDialogProps = FormDialog<SysRoleCreateForm | SysRoleUpdateForm>;

const props = withDefaults(defineProps<RoleFormDialogProps>(), {
  form: () => ({}) as SysRoleCreateForm | SysRoleUpdateForm,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<SysRoleCreateForm | SysRoleUpdateForm>({
  status: true,
  roleType: 1,
  orderNum: 0,
  ...props.form,
});

const rules = reactive<FormRules>({
  roleCode: [
    { required: true, message: t('roles.field.roleCode'), trigger: 'blur' },
    { max: 64, message: t('roles.validation.roleCodeLengthLimit'), trigger: 'blur' },
    { pattern: ROLE_CODE_REGEX, message: t('roles.validation.roleCodeFormat'), trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: t('roles.field.roleName'), trigger: 'blur' },
    { max: 128, message: t('roles.validation.roleNameLengthLimit'), trigger: 'blur' },
  ],
  status: [{ required: true, message: t('roles.field.status'), trigger: 'change' }],
  roleType: [{ required: true, message: t('roles.field.roleType'), trigger: 'change' }],
  remark: [{ max: 500, message: t('roles.validation.remarkLengthLimit'), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 角色编码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
          <el-input v-model="form.roleCode" :placeholder="t('roles.field.roleCode')" />
        </el-form-item>
      </el-col>
      <!-- 角色名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.roleName')" prop="roleName">
          <el-input v-model="form.roleName" :placeholder="t('roles.field.roleName')" />
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('roles.status.normal') }}</el-radio>
            <el-radio :value="false">{{ t('roles.status.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 角色类型 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.roleType')" prop="roleType">
          <el-select v-model="form.roleType" :placeholder="t('roles.field.roleType')" class="w-full">
            <el-option
              v-for="opt in ROLE_TYPE_FILTER_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 显示顺序 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('roles.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('roles.field.remark')"
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

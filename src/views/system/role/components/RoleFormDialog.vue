<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { SysRoleCreateForm, SysRoleUpdateForm } from '@/api/system/role';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type RoleFormDialogProps = FormDialog<SysRoleCreateForm | SysRoleUpdateForm> & {
  /** 是否为编辑模式（编辑时角色编码只读） */
  isEdit?: boolean;
};

const props = withDefaults(defineProps<RoleFormDialogProps>(), {
  form: () => ({}) as SysRoleCreateForm | SysRoleUpdateForm,
  isEdit: false,
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
    { required: true, message: t('roles.roleCode'), trigger: 'blur' },
    { max: 64, message: t('roles.roleCodeLengthLimit'), trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: t('roles.roleName'), trigger: 'blur' },
    { max: 128, message: t('roles.roleNameLengthLimit'), trigger: 'blur' },
  ],
  status: [{ required: true, message: t('roles.status'), trigger: 'change' }],
  roleType: [{ required: true, message: t('roles.roleType'), trigger: 'change' }],
  remark: [{ max: 500, message: t('roles.remarkLengthLimit'), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 角色编码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.roleCode')" prop="roleCode">
          <el-input
            v-model="form.roleCode"
            :disabled="isEdit"
            :placeholder="t('roles.roleCode')"
            :readonly="props.isEdit"
          />
        </el-form-item>
      </el-col>
      <!-- 角色名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.roleName')" prop="roleName">
          <el-input v-model="form.roleName" :placeholder="t('roles.roleName')" />
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('roles.statusNormal') }}</el-radio>
            <el-radio :value="false">{{ t('roles.statusDisabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 角色类型 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.roleType')" prop="roleType">
          <el-select v-model="form.roleType" :placeholder="t('roles.roleType')" class="w-full">
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
        <el-form-item :label="t('roles.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('roles.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('roles.remark')"
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

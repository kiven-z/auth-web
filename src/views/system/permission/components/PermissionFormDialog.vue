<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { SysPermissionCreateForm, SysPermissionUpdateForm } from '@/api/system/permission';
import { PERMISSION_CODE_REGEX } from '@/views/system/permission/constants/permission-code-convention';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/permission-type-options';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type PermissionFormModel = SysPermissionCreateForm | SysPermissionUpdateForm;

interface PermissionFormDialogProps extends FormDialog<PermissionFormModel> {
  mode?: 'create' | 'edit';
  displayPermissionType?: number;
}

const props = withDefaults(defineProps<PermissionFormDialogProps>(), {
  form: () => ({}) as PermissionFormModel,
  mode: 'create',
  displayPermissionType: 0,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const isEditMode = computed(() => props.mode === 'edit');
const form = ref<PermissionFormModel>({
  status: true,
  orderNum: 0,
  ...(props.mode === 'create' ? { permissionType: 0 } : {}),
  ...props.form,
});

const permissionTypeModel = computed({
  get(): number {
    if (isEditMode.value) {
      return props.displayPermissionType;
    }
    return (form.value as SysPermissionCreateForm).permissionType;
  },
  set(value: number) {
    if (!isEditMode.value) {
      (form.value as SysPermissionCreateForm).permissionType = value;
    }
  },
});

const rules = computed<FormRules>(() => ({
  permissionCode: [
    { required: true, message: t('permissions.permissionCode'), trigger: 'blur' },
    { max: 128, message: t('permissions.permissionCodeLengthLimit'), trigger: 'blur' },
    { pattern: PERMISSION_CODE_REGEX, message: t('permissions.permissionCodeFormat'), trigger: 'blur' },
  ],
  permissionName: [
    { required: true, message: t('permissions.permissionName'), trigger: 'blur' },
    { max: 128, message: t('permissions.permissionNameLengthLimit'), trigger: 'blur' },
  ],
  ...(isEditMode.value
    ? {}
    : {
        permissionType: [{ required: true, message: t('permissions.permissionType'), trigger: 'change' }],
      }),
  status: [{ required: true, message: t('permissions.status'), trigger: 'change' }],
  remark: [{ max: 500, message: t('permissions.remarkLengthLimit'), trigger: 'blur' }],
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 权限编码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.permissionCode')" prop="permissionCode">
          <el-input v-model="form.permissionCode" :placeholder="t('permissions.placeholder.permissionCode')" />
        </el-form-item>
      </el-col>
      <!-- 权限名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.permissionName')" prop="permissionName">
          <el-input v-model="form.permissionName" :placeholder="t('permissions.placeholder.permissionName')" />
        </el-form-item>
      </el-col>
      <!-- 权限类型 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.permissionType')" :prop="isEditMode ? undefined : 'permissionType'">
          <el-select
            v-model="permissionTypeModel"
            :disabled="isEditMode"
            :placeholder="t('permissions.permissionType')"
            class="w-full"
          >
            <el-option
              v-for="opt in PERMISSION_TYPE_FILTER_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
          <el-text v-if="isEditMode" class="mt-1 block" type="info">
            {{ t('permissions.permissionTypeImmutableHint') }}
          </el-text>
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('permissions.statusActive') }}</el-radio>
            <el-radio :value="false">{{ t('permissions.statusInactive') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 显示顺序 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('permissions.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('permissions.remark')"
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

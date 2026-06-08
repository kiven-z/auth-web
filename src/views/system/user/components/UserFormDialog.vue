<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { SysUserCreateForm } from '@/api/system/user';
import { USER_ACCOUNT_STATUS, USER_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-account-status';
import { USER_GENDER, USER_GENDER_OPTIONS } from '@/views/system/user/constants/user-gender';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type UserFormDialogProps = FormDialog<SysUserCreateForm>;

const props = withDefaults(defineProps<UserFormDialogProps>(), {
  form: () => ({}) as SysUserCreateForm,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<SysUserCreateForm>({
  status: USER_ACCOUNT_STATUS.normal,
  gender: USER_GENDER.unknown,
  ...props.form,
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: t('users.username'), trigger: 'blur' },
    { max: 64, message: t('users.validation.usernameMaxLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('users.email'), trigger: 'blur' },
    { type: 'email', message: t('users.validation.emailInvalid'), trigger: 'blur' },
    { max: 128, message: t('users.validation.emailMaxLength'), trigger: 'blur' },
  ],
  employeeNo: [{ max: 64, message: t('users.validation.employeeNoMaxLength'), trigger: 'blur' }],
  status: [{ required: true, message: t('users.status'), trigger: 'change' }],
  nickname: [
    { required: true, message: t('users.nickname'), trigger: 'blur' },
    { max: 64, message: t('users.validation.nicknameMaxLength'), trigger: 'blur' },
  ],
  phone: [
    { required: true, message: t('users.phone'), trigger: 'blur' },
    { max: 32, message: t('users.validation.phoneMaxLength'), trigger: 'blur' },
  ],
  remark: [{ max: 500, message: t('users.validation.remarkMaxLength'), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 用户名 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.username')" prop="username">
          <el-input v-model="form.username" :placeholder="t('users.username')" clearable />
        </el-form-item>
      </el-col>
      <!-- 昵称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.nickname')" prop="nickname">
          <el-input v-model="form.nickname" :placeholder="t('users.nickname')" clearable />
        </el-form-item>
      </el-col>
      <!-- 邮箱 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.email')" prop="email">
          <el-input v-model="form.email" :placeholder="t('users.email')" clearable />
        </el-form-item>
      </el-col>
      <!-- 手机号 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.phone')" prop="phone">
          <el-input v-model="form.phone" :placeholder="t('users.phone')" clearable />
        </el-form-item>
      </el-col>
      <!-- 工号 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.employeeNo')" prop="employeeNo">
          <el-input v-model="form.employeeNo" :placeholder="t('dept.employeeNo')" clearable />
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in USER_STATUS_FILTER_OPTIONS" :key="opt.value" :value="opt.value">
              {{ t(opt.labelKey) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 性别 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.gender')" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio v-for="opt in USER_GENDER_OPTIONS" :key="opt.value" :value="opt.value">
              {{ t(opt.labelKey) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 出生日期 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.birthday')" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            :placeholder="t('users.birthday')"
            class="w-full!"
            clearable
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <!-- 个人简介 -->
      <el-col :span="24">
        <el-form-item :label="t('users.introduction')" prop="introduction">
          <el-input
            v-model="form.introduction"
            :placeholder="t('users.introduction')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('users.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('users.remark')"
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

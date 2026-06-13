<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { UserPostAssignForm, UserPostRelationUpdateForm } from '@/api/system/user-post';
import useRemotePostSearch from '@/composables/dialog/useRemotePostSearch';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type UserPostAssignFormDialogProps = FormDialog<UserPostAssignForm | UserPostRelationUpdateForm> & {
  /** 编辑模式不展示岗位选择 */
  editMode?: boolean;
};

const props = withDefaults(defineProps<UserPostAssignFormDialogProps>(), {
  form: () => ({}) as UserPostAssignForm,
  editMode: false,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<UserPostAssignForm>({
  status: 1,
  isPrimary: false,
  ...props.form,
});

const { postOptions, postSearchLoading, loadPostListByKeyword } = useRemotePostSearch({
  errorDefaultI18nKey: 'post.messages.loadFailed',
});

const rules = computed<FormRules>(() => {
  const baseRules: FormRules = {
    status: [{ required: true, message: t('relation.status'), trigger: 'change' }],
    isPrimary: [{ required: true, message: t('post.field.isPrimaryPosition'), trigger: 'change' }],
  };
  if (!props.editMode) {
    baseRules.postId = [{ required: true, message: t('post.field.postName'), trigger: 'change' }];
  }
  return baseRules;
});

/**
 * 岗位选项展示文案
 * @param postName 岗位名称
 * @param postCode 岗位编码
 * @param deptName 部门名称
 */
const formatPostOptionLabel = (postName: string, postCode: string, deptName: string) =>
  `${postName} (${postCode}) · ${deptName}`;

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 岗位（仅新增） -->
      <el-col v-if="!editMode" :span="24">
        <el-form-item :label="t('post.field.postName')" prop="postId">
          <el-select
            v-model="form.postId"
            :loading="postSearchLoading"
            :placeholder="t('users.postAssign.searchPlaceholder')"
            :remote-method="loadPostListByKeyword"
            class="w-full"
            clearable
            filterable
            remote
          >
            <el-option
              v-for="item in postOptions"
              :key="item.id"
              :label="formatPostOptionLabel(item.postName, item.postCode, item.deptName)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 关联状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('relation.status')" prop="status">
          <el-select v-model="form.status" :placeholder="t('relation.status')" class="w-full">
            <el-option
              v-for="option in USER_DEPT_RELATION_STATUS_FILTER_OPTIONS"
              :key="`${option.labelKey}:${String(option.value)}`"
              :label="t(option.labelKey)"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 是否主岗位 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.isPrimaryPosition')" prop="isPrimary">
          <el-radio-group v-model="form.isPrimary">
            <el-radio :value="true">{{ t('post.enums.primary.yes') }}</el-radio>
            <el-radio :value="false">{{ t('post.enums.primary.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('users.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('users.field.remark')"
            :rows="3"
            maxlength="255"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

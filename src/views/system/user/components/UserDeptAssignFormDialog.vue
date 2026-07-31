<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { getDeptList } from '@/api/system/dept';
import type { UserDeptAssignForm } from '@/api/system/user-dept';
import { errorMessage } from '@/services/feedback/message';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/views/system/_shared/utils/dept-select-tree';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type UserDeptAssignFormDialogProps = FormDialog<UserDeptAssignForm>;

const props = withDefaults(defineProps<UserDeptAssignFormDialogProps>(), {
  form: () => ({}) as UserDeptAssignForm,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<UserDeptAssignForm>({
  status: 1,
  isPrimary: false,
  ...props.form,
});

const deptCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const deptTree = ref<DeptSelectTreeNode[]>([]);

const rules = reactive<FormRules>({
  deptId: [{ required: true, message: t('dept.field.deptName'), trigger: 'change' }],
  status: [{ required: true, message: t('relation.status'), trigger: 'change' }],
  isPrimary: [{ required: true, message: t('relation.isPrimary'), trigger: 'change' }],
});

/**
 * 加载部门树（含停用部门，节点 disabled 不可选）
 */
const loadDeptTree = async () => {
  try {
    const list = await getDeptList();
    deptTree.value = buildDeptSelectTree(list ?? []);
  } catch (error: unknown) {
    errorMessage(error);
    deptTree.value = [];
  }
};

onMounted(() => {
  void loadDeptTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 所属部门 -->
      <el-col :span="24">
        <el-form-item :label="t('dept.field.deptName')" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :placeholder="t('dept.placeholder.parentDept')"
            :props="deptCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ data }">
              <span>{{ data.label }}</span>
              <el-text type="info">({{ data.deptCode }})</el-text>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>
      <!-- 关联状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('relation.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-for="option in USER_DEPT_RELATION_STATUS_FILTER_OPTIONS"
              :key="`${option.labelKey}:${String(option.value)}`"
              :value="option.value"
            >
              {{ t(option.labelKey) }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 是否主部门 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('relation.isPrimary')" prop="isPrimary">
          <el-radio-group v-model="form.isPrimary">
            <el-radio :value="true">{{ t('relation.primary') }}</el-radio>
            <el-radio :value="false">{{ t('relation.secondary') }}</el-radio>
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

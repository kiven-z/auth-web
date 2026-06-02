<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import type { SysDeptCreateForm } from '@/api/system/dept';
import { getDeptList } from '@/api/system/dept';
import { errorMessage } from '@/shared/messaging/message';
import { findTreePathById } from '@/shared/lib/tree';
import {
  buildActiveDeptParentTree,
  cascaderPathToParentId,
  DEPT_ROOT_PARENT_ID,
  type DeptParentCascaderNode,
} from '@/views/system/dept/utils/dept-parent';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type DeptFormDialogProps = FormDialog<SysDeptCreateForm>;

const props = withDefaults(defineProps<DeptFormDialogProps>(), {
  form: () => ({}) as SysDeptCreateForm,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<SysDeptCreateForm>({
  parentId: DEPT_ROOT_PARENT_ID,
  status: true,
  orderNum: 0,
  deptName: '',
  deptCode: '',
  ...props.form,
});

const parentCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: true,
  value: 'value',
  label: 'label',
  children: 'children',
};

const parentTree = ref<DeptParentCascaderNode[]>([]);
const parentIdPath = ref<string[]>([]);

const rules = reactive<FormRules>({
  deptName: [{ required: true, message: t('dept.deptName'), trigger: 'blur' }],
  deptCode: [{ required: true, message: t('dept.deptCode'), trigger: 'blur' }],
  status: [{ required: true, message: t('dept.status'), trigger: 'change' }],
});

watch(parentIdPath, (path) => {
  form.value.parentId = cascaderPathToParentId(path);
});

/**
 * 加载父级部门树
 */
const loadParentTree = async () => {
  try {
    const list = await getDeptList();
    parentTree.value = buildActiveDeptParentTree(list ?? []);

    // 查找自根到目标 id 的路径
    const targetId = form.value.parentId === DEPT_ROOT_PARENT_ID ? undefined : form.value.parentId;
    parentIdPath.value = findTreePathById(parentTree.value, targetId);
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'dept.loadFailed' });
    parentTree.value = [];
    parentIdPath.value = [];
    form.value.parentId = DEPT_ROOT_PARENT_ID;
  }
};

onMounted(() => {
  loadParentTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :span="24">
        <el-form-item :label="t('dept.parentDept')" prop="parentId">
          <el-cascader
            v-model="parentIdPath"
            :options="parentTree"
            :placeholder="t('dept.placeholder.parentDept')"
            :props="parentCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ data }">
              <span>{{ data.label }}</span>
              <span v-if="data.deptCode" class="text-xs text-(--el-text-color-secondary)">({{ data.deptCode }})</span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.deptCode')" prop="deptCode">
          <el-input v-model="form.deptCode" :placeholder="t('dept.deptCode')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.deptName')" prop="deptName">
          <el-input v-model="form.deptName" :placeholder="t('dept.deptName')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('dept.statusNormal') }}</el-radio>
            <el-radio :value="false">{{ t('dept.statusDisabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('dept.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('dept.remark')"
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

<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { DEPT_ROOT_PARENT_ID, getDeptList, SysDeptCreateForm, SysDeptUpdateForm } from '@/api/system/dept';
import { errorMessage } from '@/services/feedback/message';
import { buildDeptParentTree, type DeptParentCascaderNode } from '@/views/system/dept/utils/dept-parent';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type DeptFormModel = SysDeptCreateForm | SysDeptUpdateForm;

type DeptFormDialogProps = FormDialog<DeptFormModel>;

const props = withDefaults(defineProps<DeptFormDialogProps>(), {
  form: () => ({}) as DeptFormModel,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<DeptFormModel>({
  parentId: DEPT_ROOT_PARENT_ID,
  status: true,
  orderNum: 0,
  ...props.form,
});

const parentCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
};

const parentTree = ref<DeptParentCascaderNode[]>([]);

const parentCascaderModel = computed({
  get: () => {
    const pid = form.value.parentId;
    return pid && pid !== DEPT_ROOT_PARENT_ID ? pid : undefined;
  },
  set: (value: string | undefined | null) => {
    form.value.parentId = value && value.length > 0 ? value : DEPT_ROOT_PARENT_ID;
  },
});

const rules = reactive<FormRules>({
  deptName: [{ required: true, message: t('dept.field.deptName'), trigger: 'blur' }],
  deptCode: [{ required: true, message: t('dept.field.deptCode'), trigger: 'blur' }],
  status: [{ required: true, message: t('dept.field.status'), trigger: 'change' }],
});

/**
 * 加载父级部门树
 */
const loadParentTree = async () => {
  try {
    const list = await getDeptList();
    parentTree.value = buildDeptParentTree(list ?? []);
  } catch (e: unknown) {
    errorMessage(e);
    parentTree.value = [];
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
        <el-form-item :label="t('dept.field.parentDept')" prop="parentId">
          <el-cascader
            v-model="parentCascaderModel"
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
              <el-text v-if="data.deptCode" type="info">({{ data.deptCode }})</el-text>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
          <el-input v-model="form.deptCode" :placeholder="t('dept.field.deptCode')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.deptName')" prop="deptName">
          <el-input v-model="form.deptName" :placeholder="t('dept.field.deptName')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('dept.enum.status.normal') }}</el-radio>
            <el-radio :value="false">{{ t('dept.enum.status.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('dept.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('dept.field.remark')"
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

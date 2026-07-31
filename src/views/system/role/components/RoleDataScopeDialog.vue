<script lang="ts" setup>
import { getDeptList } from '@/api/system/dept/dept';
import { getRoleScope, type RoleScopeType, type SysRoleScopeForm } from '@/api/system/role/role-scope';
import { errorMessage } from '@/services/feedback/message';
import { ROLE_SCOPE_TYPE_OPTIONS } from '@/views/system/role/constants/role-scope-type';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/views/system/_shared/utils/dept-select-tree';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleDataScopeDialog' });

const treeSelectProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const props = defineProps<{
  /** 角色主键 */
  roleId: string;
}>();

const { t } = useI18n();

const formRef = ref<FormInstance>();
const loading = ref(true);
const deptTree = ref<DeptSelectTreeNode[]>([]);

const form = ref<SysRoleScopeForm>({
  scopeType: 'SELF',
  scopeDeptIds: [],
  remark: undefined,
});

const showDeptSelector = computed(() => form.value.scopeType === 'DEPT' || form.value.scopeType === 'DEPT_AND_CHILD');

const rules = reactive<FormRules>({
  scopeType: [{ required: true, message: t('roles.field.scopeType'), trigger: 'change' }],
  scopeDeptIds: [
    {
      required: true,
      validator: (_rule, value: string[], callback) => {
        if (form.value.scopeType !== 'DEPT' && form.value.scopeType !== 'DEPT_AND_CHILD') {
          callback();
          return;
        }
        if (!value?.length) {
          callback(new Error(t('roles.validation.scopeDeptIdsRequired')));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
  remark: [{ max: 500, message: t('roles.validation.remarkLengthLimit'), trigger: 'blur' }],
});

watch(
  () => form.value.scopeType,
  (scopeType: RoleScopeType) => {
    if (scopeType !== 'DEPT' && scopeType !== 'DEPT_AND_CHILD') {
      form.value.scopeDeptIds = [];
    }
  }
);

/**
 * 加载部门树与当前角色范围
 */
async function loadDialogData() {
  loading.value = true;
  try {
    const [deptList, scope] = await Promise.all([getDeptList(), getRoleScope(props.roleId)]);
    deptTree.value = buildDeptSelectTree(deptList ?? []);
    if (!scope) {
      return;
    }
    form.value = {
      scopeType: scope.scopeType,
      scopeDeptIds: scope.scopeDeptIds,
      remark: scope.remark,
    };
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDialogData();
});

defineExpose({ formRef, form });
</script>

<template>
  <div v-loading="loading" class="role-data-scope-dialog">
    <el-alert :closable="false" :title="t('roles.scope.tip')" class="mb-4" show-icon type="info" />
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <!-- 数据范围类型 -->
      <el-form-item :label="t('roles.field.scopeType')" prop="scopeType">
        <el-radio-group v-model="form.scopeType" class="role-data-scope-dialog__types">
          <el-radio-button v-for="option in ROLE_SCOPE_TYPE_OPTIONS" :key="option.value" :value="option.value">
            {{ t(option.labelKey) }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 指定部门（仅 DEPT / DEPT_AND_CHILD） -->
      <el-form-item v-if="showDeptSelector" :label="t('roles.field.scopeDeptIds')" prop="scopeDeptIds">
        <el-tree-select
          v-model="form.scopeDeptIds"
          :data="deptTree"
          :placeholder="t('roles.placeholder.scopeDeptIds')"
          :props="treeSelectProps"
          check-on-click-node
          check-strictly
          class="w-full"
          clearable
          default-expand-all
          filterable
          multiple
          show-checkbox
        />
      </el-form-item>

      <!-- 备注 -->
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
    </el-form>
  </div>
</template>

<style scoped>
.role-data-scope-dialog__types {
  display: flex;
  flex-wrap: wrap;
}
</style>

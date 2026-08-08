<script lang="ts" setup>
import { getDeptPage, type SysDeptListVO, type SysDeptPageQuery } from '@/api/system/dept/dept';
import { getRoleGrantSubjectSeeds, putRoleGrantSubjects } from '@/api/system/role/role-grant-subjects';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/domain/assign/AssignPanel';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { errorMessage, message } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { GrantSubjectPanelProps } from '@/views/system/role/types/grant-subject';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptGrantSubjectPanel' });

const props = defineProps<GrantSubjectPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();
const seedLoading = ref(false);
const saving = ref(false);

const assign = useAssignChecked({
  rowKey: 'id',
  getRowLabel: (row) => String(row.deptName ?? ''),
});

const state = usePaginationState<SysDeptListVO, SysDeptPageQuery>({
  fetchApi: (query) => getDeptPage({ ...query, status: true }),
  searchForm: reactive({
    deptCode: undefined,
    deptName: undefined,
  }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = state;

useAssignTableLabels(assign, tableData);

const columns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'id', { label: t('table.assigned') }),
  { label: t('dept.field.deptCode'), prop: 'deptCode' },
  { label: t('dept.field.deptName'), prop: 'deptName' },
]);

/**
 * 拉取已授权部门并灌种
 */
async function loadSeed() {
  seedLoading.value = true;
  try {
    const subjects = await getRoleGrantSubjectSeeds(props.roleId, 'DEPT');
    assign.applySeed(subjects.map((item) => ({ key: item.id, label: item.label })));
  } catch (error: unknown) {
    errorMessage(error);
    assign.applySeed([]);
  } finally {
    seedLoading.value = false;
  }
}

/**
 * 覆盖保存 DEPT 授权对象
 */
async function handleSave() {
  if (saving.value) {
    return;
  }
  saving.value = true;
  try {
    const subjectIds = assign.getSelectedKeys();
    await putRoleGrantSubjects(props.roleId, { subjectType: 'DEPT', subjectIds });
    message(t('tips.assignSaveSuccess'), { type: 'success' });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  Promise.all([loadSeed(), fetchTableData()]);
});
</script>

<template>
  <div v-loading="seedLoading">
    <AssignPanel
      :assign="assign"
      :left-subtitle="leftSubtitle"
      :left-title="leftTitle"
      :saving="saving"
      :section-label="t('roles.bound.depts.title')"
    >
      <el-form
        ref="searchFormRef"
        v-enter-submit="fetchTableData"
        :model="searchForm"
        class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
        inline
      >
        <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
          <el-input
            v-model="searchForm.deptCode"
            :placeholder="ph.input('dept.field.deptCode')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('dept.field.deptName')" prop="deptName">
          <el-input
            v-model="searchForm.deptName"
            :placeholder="ph.input('dept.field.deptName')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <el-button :loading="saving" type="primary" @click="handleSave">
            {{ t('roles.grantSubjects.saveCurrent') }}
          </el-button>
        </el-form-item>
      </el-form>

      <ListTable
        :columns="columns"
        :state="state"
        :title="t('roles.bound.depts.title')"
        @row-dblclick="(row: Record<string, unknown>) => assign.toggle(row)"
      />
    </AssignPanel>
  </div>
</template>

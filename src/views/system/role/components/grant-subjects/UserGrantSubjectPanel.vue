<script lang="ts" setup>
import { getRoleGrantSubjectSeeds, putRoleGrantSubjects } from '@/api/system/role/role-grant-subjects';
import { getUserPage, type SysUserPageQuery, type SysUserPageRow } from '@/api/system/user/user';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/domain/assign/AssignPanel';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { errorMessage, message } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { GrantSubjectPanelProps } from '@/views/system/role/types/grant-subject';
import { USER_ACCOUNT_STATUS } from '@/views/system/user/constants/user-enums';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserGrantSubjectPanel' });

const props = defineProps<GrantSubjectPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();
const seedLoading = ref(false);
const saving = ref(false);

const assign = useAssignChecked({
  rowKey: 'id',
  getRowLabel: (row) => {
    const nickname = row.nickname;
    const username = row.username;
    if (typeof nickname === 'string' && nickname.trim()) {
      return nickname;
    }
    return String(username ?? '');
  },
});

const state = usePaginationState<SysUserPageRow, SysUserPageQuery>({
  fetchApi: (query) => getUserPage({ ...query, status: USER_ACCOUNT_STATUS.normal }),
  searchForm: reactive({
    username: undefined,
    nickname: undefined,
  }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = state;

useAssignTableLabels(assign, tableData);

const columns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'id', { label: t('table.assigned') }),
  { label: t('users.field.username'), prop: 'username' },
  { label: t('users.field.nickname'), prop: 'nickname' },
]);

/**
 * 拉取已授权用户并灌种
 */
async function loadSeed() {
  seedLoading.value = true;
  try {
    const subjects = await getRoleGrantSubjectSeeds(props.roleId, 'USER');
    assign.applySeed(subjects.map((item) => ({ key: item.id, label: item.label })));
  } catch (error: unknown) {
    errorMessage(error);
    assign.applySeed([]);
  } finally {
    seedLoading.value = false;
  }
}

/**
 * 覆盖保存 USER 授权对象
 */
async function handleSave() {
  if (saving.value) {
    return;
  }
  saving.value = true;
  try {
    const subjectIds = assign.getSelectedKeys();
    await putRoleGrantSubjects(props.roleId, { subjectType: 'USER', subjectIds });
    message(t('tips.assignSaveSuccess'), { type: 'success' });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void Promise.all([loadSeed(), fetchTableData()]);
});
</script>

<template>
  <div v-loading="seedLoading">
    <AssignPanel
      :assign="assign"
      :left-subtitle="leftSubtitle"
      :left-title="leftTitle"
      :saving="saving"
      :section-label="t('roles.bound.users.title')"
    >
      <el-form
        ref="searchFormRef"
        v-enter-submit="fetchTableData"
        :model="searchForm"
        class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
        inline
      >
        <el-form-item :label="t('users.field.username')" prop="username">
          <el-input
            v-model="searchForm.username"
            :placeholder="ph.input('users.field.username')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('users.field.nickname')" prop="nickname">
          <el-input
            v-model="searchForm.nickname"
            :placeholder="ph.input('users.field.nickname')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button :loading="loading" type="primary" @click="fetchTableData">
              {{ t('buttons.actionSearch') }}
            </el-button>
            <el-button @click="resetQuery(searchFormRef)">
              {{ t('buttons.actionReset') }}
            </el-button>
            <el-button :loading="saving" type="primary" @click="handleSave">
              {{ t('roles.grantSubjects.saveCurrent') }}
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <PagedTable
        :columns="columns"
        :state="state"
        :title="t('roles.bound.users.title')"
        @row-dblclick="(row: Record<string, unknown>) => assign.toggle(row)"
      />
    </AssignPanel>
  </div>
</template>

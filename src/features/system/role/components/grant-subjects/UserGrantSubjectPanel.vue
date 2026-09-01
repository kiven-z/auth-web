<script lang="ts" setup>
import { getRoleGrantSubjectSeeds, putRoleGrantSubjects } from '@/features/system/api/role/role-grant-subjects';
import { getUserPage, type SysUserPageQuery, type SysUserPageRow } from '@/features/system/api/user/user';
import AssignPanel from '@/features/system/_shared/components/AssignPanel.vue';
import { createAssignCheckboxColumnFromModel } from '@/features/system/_shared/columns/create-assign-checkbox-column';
import { useAssignModel } from '@/features/system/_shared/hooks/use-assign-model';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { errorMessage, message } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { GrantSubjectPanelProps } from '@/features/system/role/types/grant-subject';
import { USER_ACCOUNT_STATUS } from '@/components/domain/user/user-profile';
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

const state = usePaginationState<SysUserPageRow, SysUserPageQuery>({
  fetchApi: (query) => getUserPage({ ...query, status: USER_ACCOUNT_STATUS.normal }),
  searchForm: reactive({
    username: undefined,
    nickname: undefined,
  }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = state;

const assignModel = useAssignModel({
  getRowLabel: (row) => {
    const nickname = row.nickname;
    const username = row.username;
    if (typeof nickname === 'string' && nickname.trim()) {
      return nickname;
    }
    return String(username ?? '');
  },
  rows: tableData,
  disabled: saving,
});

const { selectedKeys, labels, applyAssigned, handleRowClick } = assignModel;

const columns = computed<TableColumnList>(() => [
  createAssignCheckboxColumnFromModel(assignModel, { saving, label: t('table.assigned') }),
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
    applyAssigned(subjects.map((item) => ({ key: item.id, label: item.label })));
  } catch (error: unknown) {
    errorMessage(error);
    applyAssigned([]);
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
    await putRoleGrantSubjects(props.roleId, { subjectType: 'USER', subjectIds: selectedKeys.value });
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
      v-model="selectedKeys"
      :labels="labels"
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
        :row-class-name="() => 'cursor-pointer'"
        :state="state"
        :title="t('roles.bound.users.title')"
        @row-click="handleRowClick"
      />
    </AssignPanel>
  </div>
</template>

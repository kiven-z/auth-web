<script lang="ts" setup>
import { getRolePage } from '@/api/system/role';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';
import { ROLE_STATUS_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
import useRoleAdvanceAction from '@/views/system/role/hooks/useRoleAdvanceAction';
import useRoleMoreAction from '@/views/system/role/hooks/useRoleMoreAction';
import useRoleTableAction from '@/views/system/role/hooks/useRoleTableAction';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();
const ph = useFormPlaceholder();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
    roleTypes: [],
  }),
  errorI18nKey: 'roles.message.loadFailed',
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = roleState;

const { exporting, openExportDialog } = useRoleAdvanceAction({ searchForm, pagination });

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = useRoleTableAction({
  fetchTableData,
});

const { openAssignPermissionDrawer } = useRoleMoreAction();

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="ph.input('roles.field.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.field.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="ph.input('roles.field.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('roles.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('roles.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in ROLE_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <!-- 角色类型 -->
      <el-form-item :label="t('roles.field.roleType')" prop="roleTypes">
        <el-select
          v-model="searchForm.roleTypes"
          :placeholder="ph.selectFilter('roles.field.roleType')"
          class="w-52!"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
        >
          <el-option
            v-for="opt in ROLE_TYPE_FILTER_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="roleState" :title="t('roles.title.page')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item disabled>从 Excel 导入（敬请期待）</el-dropdown-item>
              <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                {{ t('buttons.exportExcel') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改/编辑 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 删除 -->
          <el-button link type="danger" @click="deleteRow(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>

          <el-dropdown class="ml-1" trigger="click">
            <!-- 更多 -->
            <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openAssignPermissionDrawer(row)">
                  {{ t('roles.assign.permission') }}
                </el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menu.dataScope') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menu.policyBind') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menu.grantSubjects') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menu.impactAnalysis') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

<script lang="ts" setup>
import { getRolePage } from '@/api/system/role';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import {
  ROLE_STATUS_FILTER_OPTIONS,
  ROLE_TYPE_FILTER_OPTIONS,
} from '@/views/system/role/constants/role-search-options';
import useRoleMoreAction from '@/views/system/role/hooks/useRoleMoreAction';
import useRoleTableAction from '@/views/system/role/hooks/useRoleTableAction';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
    roleType: undefined,
  }),
  errorI18nKey: 'roles.loadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = roleState;

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
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="t('roles.placeholder.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="t('roles.placeholder.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('roles.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('roles.status')" class="w-45!" clearable>
          <el-option
            v-for="opt in ROLE_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <!-- 角色类型 -->
      <el-form-item :label="t('roles.roleType')" prop="roleType">
        <el-select v-model="searchForm.roleType" :placeholder="t('roles.roleType')" class="w-40!" clearable>
          <el-option
            v-for="opt in ROLE_TYPE_FILTER_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <!-- 搜索 -->
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <!-- 重置 -->
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="roleState" :title="t('roles.pageTitle')">
      <template #buttons>
        <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
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
                  {{ t('roles.actionAssignPermission') }}
                </el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menuDataScope') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menuPolicyBind') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menuGrantSubjects') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('roles.menuImpactAnalysis') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

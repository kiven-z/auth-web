<script lang="ts" setup>
import type { PermissionReference } from '@/api/system/_shared/grant-table';
import type { RolePermissionPageQuery } from '@/api/system/role/role-authorization';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleBoundPermissionsPanel' });

/** 角色已绑定权限分页面板 */
type RoleBoundPermissionsPanelProps = AuthorizationSurfacePanelProps<PermissionReference, RolePermissionPageQuery>;

const props = defineProps<RoleBoundPermissionsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { permissionColumns } = usePermissionColumns();
const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState<PermissionReference, RolePermissionPageQuery>({
  searchForm: reactive({
    permissionCode: undefined,
    permissionName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = permissionState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="role-bound-permissions-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.field.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.field.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('permissions.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in booleanStatusOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button v-perms="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="queryPerm" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="permissionColumns" :state="permissionState" :title="title" />
  </div>
</template>

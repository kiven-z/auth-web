<script lang="ts" setup>
import { getPermissionPage } from '@/api/system/permission';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/permission-type-options';
import usePermissionAdvanceAction from '@/views/system/permission/hooks/usePermissionAdvanceAction';
import usePermissionTableAction from '@/views/system/permission/hooks/usePermissionTableAction';
import usePermissionTableColumns from '@/views/system/permission/hooks/usePermissionTableColumns';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/constants/boolean-status';

defineOptions({
  name: 'SystemPermission',
});

const { t } = useI18n();
const ph = useFormPlaceholder();

const { columns } = usePermissionTableColumns();

const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState({
  fetchApi: getPermissionPage,
  searchForm: reactive({
    permissionCode: undefined,
    permissionName: undefined,
    permissionType: undefined,
    status: undefined,
  }),
  errorI18nKey: 'permissions.loadFailed',
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = permissionState;

const { exporting, openExportDialog } = usePermissionAdvanceAction({ searchForm, pagination });

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = usePermissionTableAction({ fetchTableData });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 权限编码 -->
      <el-form-item :label="t('permissions.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限名称 -->
      <el-form-item :label="t('permissions.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限类型 -->
      <el-form-item :label="t('permissions.permissionType')" prop="permissionType">
        <el-select
          v-model="searchForm.permissionType"
          :placeholder="ph.selectFilter('permissions.permissionType')"
          class="w-40!"
          clearable
        >
          <el-option
            v-for="opt in PERMISSION_TYPE_FILTER_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('permissions.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('permissions.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
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

    <AuthPagedTable :columns="columns" :state="permissionState" :title="t('permissions.pageTitle')">
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
          <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

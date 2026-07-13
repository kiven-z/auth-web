<script lang="ts" setup>
import { getPermissionPage } from '@/api/system/permission';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';
import { SYS_PERMISSION_PERMS } from '@/views/system/permission/constants/permissions';
import usePermissionAdvanceAction from '@/views/system/permission/hooks/usePermissionAdvanceAction';
import usePermissionTableAction from '@/views/system/permission/hooks/usePermissionTableAction';
import usePermissionTableColumns from '@/views/system/permission/hooks/usePermissionTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

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
    status: undefined,
  }),
  errorI18nKey: 'permissions.messages.loadFailed',
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = permissionState;

const { exporting, openExportDialog, openImportDialog } = usePermissionAdvanceAction({
  searchForm,
  pagination,
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = usePermissionTableAction({ fetchTableData });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 权限编码 -->
      <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.field.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限名称 -->
      <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.field.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('permissions.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('permissions.field.status')"
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
          <el-button v-perms="SYS_PERMISSION_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_PERMISSION_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="permissionState" :title="t('permissions.page.title')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_PERMISSION_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <!-- 从 Excel 导入 -->
              <Perms :value="SYS_PERMISSION_PERMS.IMPORT">
                <el-dropdown-item @click="openImportDialog">
                  {{ t('buttons.importExcel') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_PERMISSION_PERMS.EXPORT">
                <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                  {{ t('buttons.exportExcel') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="SYS_PERMISSION_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 修改/编辑 -->
        <el-button v-perms="SYS_PERMISSION_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="SYS_PERMISSION_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

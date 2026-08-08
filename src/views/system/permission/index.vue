<script lang="ts" setup>
import { getPermissionPage } from '@/api/system/permission/permission';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_PERMISSION_PERMS } from '@/views/system/permission/constants/permissions';
import usePermissionAdvanceAction from '@/views/system/permission/hooks/actions/usePermissionAdvanceAction';
import useOpenPermissionAuthorizationSurface from '@/views/system/permission/hooks/authorization/useOpenPermissionAuthorizationSurface';
import usePermissionTableAction from '@/views/system/permission/hooks/actions/usePermissionTableAction';
import usePermissionTableColumns from '@/views/system/permission/hooks/columns/usePermissionTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemPermission',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();

const { columns } = usePermissionTableColumns();

const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState({
  fetchApi: getPermissionPage,
  searchForm: reactive({
    permissionCode: undefined,
    permissionName: undefined,
    status: undefined,
  }),
});

const { loading, searchForm, pagination, selectedRows, fetchTableData, resetQuery } = permissionState;

const { exporting, openExportDialog, openImportDialog } = usePermissionAdvanceAction({
  searchForm,
  pagination,
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow, batchUpdateStatus } = usePermissionTableAction({
  fetchTableData,
});

const { openPermissionAuthorizationSurface } = useOpenPermissionAuthorizationSurface();

const hasSelection = computed(() => selectedRows.value.length > 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
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
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-perms="SYS_PERMISSION_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-perms="SYS_PERMISSION_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="permissionState" :title="t('permissions.page.title')">
      <template #buttons>
        <el-button v-perms="SYS_PERMISSION_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <Perms :value="SYS_PERMISSION_PERMS.UPDATE">
          <el-dropdown trigger="click">
            <el-button :disabled="!hasSelection" type="warning">
              {{ t('buttons.actionBatchStatus') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, true)">
                {{ t('buttons.actionBatchEnable') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, false)">
                {{ t('buttons.actionBatchDisable') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>

        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>
          <template #dropdown>
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
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_PERMISSION_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_PERMISSION_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_PERMISSION_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
          {{ t('buttons.actionDelete') }}
        </el-button>

        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="SYS_PERMISSION_PERMS.QUERY">
                <el-dropdown-item
                  @click="
                    openPermissionAuthorizationSurface({
                      permissionId: row.id,
                      permissionCode: row.permissionCode,
                      permissionName: row.permissionName,
                    })
                  "
                >
                  {{ t('permissions.menu.authorizationSurface') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ListTable>
  </div>
</template>

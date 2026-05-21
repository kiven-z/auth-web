<script lang="ts" setup>
import { getPermissionPage } from '@/api/system/permission';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import {
  PERMISSION_STATUS_FILTER_OPTIONS,
  PERMISSION_TYPE_FILTER_OPTIONS,
} from '@/views/system/permission/constants/permission-search-options';
import usePermissionTableAction from '@/views/system/permission/hooks/usePermissionTableAction';
import usePermissionTableColumns from '@/views/system/permission/hooks/usePermissionTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemPermission',
});

const { t } = useI18n();

const { columns } = usePermissionTableColumns();

const searchFormRef = ref<FormInstance>();

/** 表格实例（含 setAdaptive，供全屏后调用） */
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange,
} = usePaginationState({
  fetchApi: getPermissionPage,
  searchForm: reactive({
    permissionCode: undefined as string | undefined,
    permissionName: undefined as string | undefined,
    permissionType: undefined as number | undefined,
    status: undefined as boolean | undefined,
  }),
  errorI18nKey: 'permissions.loadFailed',
});

const {} = usePermissionTableAction({ fetchTableData });

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
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <!-- 权限编码 -->
      <el-form-item :label="t('permissions.permissionCode')" prop="permissionCode">
        <el-input v-model="searchForm.permissionCode" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 权限名称 -->
      <el-form-item :label="t('permissions.permissionName')" prop="permissionName">
        <el-input v-model="searchForm.permissionName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 权限类型 -->
      <el-form-item :label="t('permissions.permissionType')" prop="permissionType">
        <el-select
          v-model="searchForm.permissionType"
          :placeholder="t('permissions.permissionType')"
          class="w-[160px]!"
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
        <el-select v-model="searchForm.status" :placeholder="t('permissions.status')" class="w-[180px]!" clearable>
          <el-option
            v-for="opt in PERMISSION_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
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

    <TableBar
      :columns="columns"
      :title="t('permissions.pageTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加（后续补充） -->
          <el-button type="primary">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-item>{{ t('buttons.actionBatchDelete') }}</el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
          :columns="dynamicColumns"
          :data="tableData"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="loading"
          :pagination="pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          table-layout="auto"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handlePageCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <template #actions>
            <div class="flex justify-center">
              <!-- 查看（后续补充） -->
              <el-button link type="primary">{{ t('buttons.actionView') }}</el-button>
              <!-- 修改/编辑（后续补充） -->
              <el-button link type="primary">{{ t('buttons.actionEdit') }}</el-button>
              <!-- 删除（后续补充） -->
              <el-button link type="danger">{{ t('buttons.actionDelete') }}</el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

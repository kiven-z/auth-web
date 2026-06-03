<script lang="ts" setup>
import { getPermissionPage } from '@/api/system/permission';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/shared/constants/permission-type-options';
import usePermissionTableAction from '@/views/system/permission/hooks/usePermissionTableAction';
import usePermissionTableColumns from '@/views/system/permission/hooks/usePermissionTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';

defineOptions({
  name: 'SystemPermission',
});

const { t } = useI18n();

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

const { loading, searchForm, fetchTableData, resetQuery } = permissionState;

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = usePermissionTableAction({
  fetchTableData,
});

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
      <!-- 权限编码 -->
      <el-form-item :label="t('permissions.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="t('permissions.placeholder.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限名称 -->
      <el-form-item :label="t('permissions.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="t('permissions.placeholder.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限类型 -->
      <el-form-item :label="t('permissions.permissionType')" prop="permissionType">
        <el-select
          v-model="searchForm.permissionType"
          :placeholder="t('permissions.permissionType')"
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
        <el-select v-model="searchForm.status" :placeholder="t('permissions.status')" class="w-45!" clearable>
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
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

    <AuthPagedTable :columns="columns" :state="permissionState" :title="t('permissions.pageTitle')">
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
          <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

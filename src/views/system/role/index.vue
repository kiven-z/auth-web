<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import {
  ROLE_STATUS_FILTER_OPTIONS,
  ROLE_TYPE_FILTER_OPTIONS,
} from '@/views/system/role/constants/role-search-options';
import useRolePageState from '@/views/system/role/hooks/useRolePageState';
import useRoleTableAction from '@/views/system/role/hooks/useRoleTableAction';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();

const { onView, onEdit } = useRoleTableAction();
const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();

/** 表格实例（含 setAdaptive，供全屏后调用） */
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  searchForm,
  onSearch,
  onQuery,
  onReset,
  onPageSizeChange,
  onPageCurrentChange,
  onSelectionChange,
} = useRolePageState();
onMounted(() => {
  onSearch();
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
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.roleCode')" prop="roleCode">
        <el-input v-model="searchForm.roleCode" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.roleName')" prop="roleName">
        <el-input v-model="searchForm.roleName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('roles.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('roles.status')" class="w-[140px]!" clearable>
          <el-option
            v-for="opt in ROLE_STATUS_FILTER_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <!-- 角色类型 -->
      <el-form-item :label="t('roles.roleType')" prop="roleType">
        <el-select v-model="searchForm.roleType" :placeholder="t('roles.roleType')" class="w-[160px]!" clearable>
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
        <el-button type="primary" @click="onQuery">{{ t('roles.query') }}</el-button>
        <!-- 重置 -->
        <el-button @click="onReset(searchFormRef)">{{ t('roles.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('roles.pageTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 添加 -->
        <el-button type="primary">{{ t('roles.actionAdd') }}</el-button>
        <!-- 批量删除 -->
        <el-button type="danger">{{ t('roles.actionBatchDelete') }}</el-button>
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
          @page-size-change="onPageSizeChange"
          @page-current-change="onPageCurrentChange"
          @selection-change="onSelectionChange"
        >
          <template #actions>
            <div class="flex justify-center">
              <!-- 查看 -->
              <el-button link type="primary" @click="onView">{{ t('roles.actionView') }}</el-button>
              <!-- 修改/编辑 -->
              <el-button link type="primary" @click="onEdit">{{ t('roles.actionModify') }}</el-button>
              <!-- 删除 -->
              <el-button link type="danger">{{ t('roles.actionDelete') }}</el-button>

              <el-dropdown class="ml-1" trigger="click">
                <!-- 更多 -->
                <el-button class="el-dropdown-link" link type="primary">{{ t('roles.moreActions') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>{{ t('roles.actionAssignPermission') }}</el-dropdown-item>
                    <el-dropdown-item>{{ t('roles.menuDataScope') }}</el-dropdown-item>
                    <el-dropdown-item>{{ t('roles.menuPolicyBind') }}</el-dropdown-item>
                    <el-dropdown-item>{{ t('roles.menuGrantSubjects') }}</el-dropdown-item>
                    <el-dropdown-item>{{ t('roles.menuImpactAnalysis') }}</el-dropdown-item>
                    <el-dropdown-item>强制删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

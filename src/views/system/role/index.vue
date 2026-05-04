<script lang="ts" setup>
import PureTableBar from '@/components/ui/PureTableBar/src/bar';
import { ROLE_STATUS_FILTER_OPTIONS, ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/roleSearchOptions';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import PureTable from '@pureadmin/table';
import '@pureadmin/table/dist/style.css';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useRolePageState from './hooks/useRolePageState';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();
const tableRef = ref();

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
        <el-button type="primary" @click="onQuery">{{ t('roles.query') }}</el-button>
        <el-button @click="onReset(searchFormRef)">{{ t('roles.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar :columns="columns" @fullscreen="tableRef.setAdaptive()" @refresh="onSearch">
      <template #title>
        <div class="flex w-full items-center justify-between">
          <h3 class="m-0 text-base font-semibold">{{ t('roles.pageTitle') }}</h3>
          <div class="mx-1 flex items-center">
            <el-button type="primary">{{ t('roles.actionAdd') }}</el-button>
            <el-button type="danger">{{ t('roles.actionBatchDelete') }}</el-button>
          </div>
        </div>
      </template>

      <template #default="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptive-config="{ offsetBottom: 96 }"
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
              <el-button link type="primary">{{ t('roles.actionEdit') }}</el-button>
              <el-button link type="primary">修改</el-button>
              <el-button link type="danger">{{ t('roles.actionDelete') }}</el-button>

              <el-dropdown class="ml-1">
                <el-button class="el-dropdown-link" link type="primary">更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>{{ t('roles.actionAssignPermission') }}</el-dropdown-item>
                    <el-dropdown-item>数据范围配置</el-dropdown-item>
                    <el-dropdown-item>策略绑定</el-dropdown-item>
                    <el-dropdown-item>授权对象管理（反向）</el-dropdown-item>
                    <el-dropdown-item>影响分析与刷新</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

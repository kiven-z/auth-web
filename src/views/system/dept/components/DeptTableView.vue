<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableColumns from '@/views/system/dept/hooks/useDeptTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTableView',
});

const { t } = useI18n();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const { tableColumns } = useDeptTableColumns();
const {
  loading,
  selectedRows,
  tableData,
  searchForm,
  pagination,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange,
} = useDeptPageState();

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
      <!-- 部门名称 -->
      <el-form-item :label="t('dept.deptName')" prop="deptName">
        <el-input v-model="searchForm.deptName" :placeholder="t('dept.deptName')" class="w-[180px]!" clearable />
      </el-form-item>

      <!-- 部门编码 -->
      <el-form-item :label="t('dept.deptCode')" prop="deptCode">
        <el-input v-model="searchForm.deptCode" :placeholder="t('dept.deptCode')" class="w-[180px]!" clearable />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item :label="t('dept.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('dept.status')" class="w-[140px]!" clearable>
          <el-option
            v-for="opt in DEPT_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="tableColumns"
      :title="t('dept.pageTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
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
          show-overflow-tooltip
          table-layout="auto"
          @page-current-change="handlePageCurrentChange"
          @page-size-change="handlePageSizeChange"
          @selection-change="handleSelectionChange"
        >
          <template #actions="{ row }">
            <el-button link type="primary">查看</el-button>
            <el-button link type="primary">修改</el-button>
            <el-button link type="danger">删除</el-button>

            <el-dropdown class="ml-1" trigger="click">
              <el-button link type="primary">更多</el-button>
              <template #dropdown>
                <el-dropdown-item>分配角色</el-dropdown-item>
                <el-dropdown-item>分配岗位</el-dropdown-item>
              </template>
            </el-dropdown>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

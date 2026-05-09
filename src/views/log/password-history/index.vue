<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import useRemoteUserSearch from '@/shared/hooks/useRemoteUserSearch';
import usePasswordHistoryPageState from '@/views/log/password-history/hooks/usePasswordHistoryPageState';
import usePasswordHistoryTableAction from '@/views/log/password-history/hooks/usePasswordHistoryTableAction';
import usePasswordHistoryTableColumns from '@/views/log/password-history/hooks/usePasswordHistoryTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogPasswordHistory',
});

const { t } = useI18n();
const { columns } = usePasswordHistoryTableColumns();
const searchFormRef = ref<FormInstance>();
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
} = usePasswordHistoryPageState();
const { selectedRows, handleSelectionChange, openDetailDialog, deleteRow, deleteBatchRows } =
  usePasswordHistoryTableAction({ fetchTableData });

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'log.passwordHistory.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <!-- 用户 -->
      <el-form-item :label="t('log.passwordHistory.userId')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="t('log.passwordHistory.placeholder.userId')"
          :remote-method="loadUserListByKeyword"
          class="w-[200px]!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- 修改时间 -->
      <el-form-item :label="t('log.passwordHistory.changeTime')" prop="changeTime">
        <el-date-picker
          v-model="searchForm.changeTimeStart"
          :placeholder="t('log.passwordHistory.placeholder.changeTimeStart')"
          class="w-[160px]!"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.changeTimeEnd"
          :placeholder="t('log.passwordHistory.placeholder.changeTimeEnd')"
          class="w-[160px]!"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <!-- 修改IP地址 -->
      <el-form-item :label="t('log.passwordHistory.changeIp')" prop="changeIp">
        <el-input v-model="searchForm.changeIp" class="w-[160px]!" clearable />
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <!-- 搜索 -->
        <el-button type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <!-- 重置 -->
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('log.passwordHistory.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <el-dropdown-item :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows">
              <!-- 批量删除 -->
              {{ t('buttons.actionBatchDelete') }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
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
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handlePageCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center">
              <!-- 查看 -->
              <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
              <!-- 删除 -->
              <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

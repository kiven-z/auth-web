<script lang="ts" setup>
import { SYS_DEPT_PERMS } from '@/views/system/dept/constants/permissions';
import useDeptAdvancedAction from '@/views/system/dept/hooks/actions/useDeptAdvancedAction';
import useDeptTableAction from '@/views/system/dept/hooks/actions/useDeptTableAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptHeadButtons',
});

const { t } = useI18n();

const { searchForm, pagination, refresh, fetchTableData, fetchTreeData, viewMode, selectedRows } = useDeptPageState();

const tableActionDeps = {
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
};

const { openCreateDialog, batchUpdateStatus } = useDeptTableAction(tableActionDeps);

const { exporting, openExportDialog, openImportDialog, openClosureHealthDialog } = useDeptAdvancedAction({
  searchForm,
  pagination,
  refresh,
});

const hasSelection = computed(() => selectedRows.value.length > 0);
</script>

<template>
  <div class="dept-head-buttons">
    <el-button v-perms="SYS_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog()">
      {{ t('buttons.actionAdd') }}
    </el-button>

    <Perms :value="SYS_DEPT_PERMS.UPDATE">
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
      <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <Perms :value="SYS_DEPT_PERMS.IMPORT">
            <el-dropdown-item @click="openImportDialog()">
              {{ t('buttons.importExcel') }}
            </el-dropdown-item>
          </Perms>
          <Perms :value="SYS_DEPT_PERMS.EXPORT">
            <el-dropdown-item :disabled="exporting" @click="openExportDialog()">
              {{ t('buttons.exportExcel') }}
            </el-dropdown-item>
          </Perms>
          <Perms :value="SYS_DEPT_PERMS.DIAGNOSE">
            <el-dropdown-item @click="openClosureHealthDialog()">
              {{ t('dept.closureHealth.action') }}
            </el-dropdown-item>
          </Perms>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.dept-head-buttons {
  display: flex;
  gap: 12px;
  align-items: center;

  > .el-button + .el-button {
    margin-left: 0;
  }
}
</style>

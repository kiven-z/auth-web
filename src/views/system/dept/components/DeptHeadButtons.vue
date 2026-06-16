<script lang="ts" setup>
import { SYS_DEPT_PERMS } from '@/views/system/dept/constants/permissions';
import useDeptAdvancedAction from '@/views/system/dept/hooks/actions/useDeptAdvancedAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/actions/useDeptTableAction';
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

const { openCreateDialog } = useDeptTableAction(tableActionDeps);

const { exporting, openExportDialog, openImportDialog, openClosureHealthDialog } = useDeptAdvancedAction({
  searchForm,
  pagination,
  refresh,
});
</script>

<template>
  <el-button-group type="primary">
    <el-button v-perms="SYS_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog()">
      {{ t('buttons.actionAdd') }}
    </el-button>

    <el-dropdown trigger="click">
      <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 从 Excel 导入 -->
          <el-dropdown-item v-perms="SYS_DEPT_PERMS.IMPORT" @click="openImportDialog()">
            {{ t('buttons.importExcel') }}
          </el-dropdown-item>
          <el-dropdown-item v-perms="SYS_DEPT_PERMS.EXPORT" :disabled="exporting" @click="openExportDialog()">
            {{ t('buttons.exportExcel') }}
          </el-dropdown-item>
          <el-dropdown-item v-perms="SYS_DEPT_PERMS.DIAGNOSE" @click="openClosureHealthDialog()">
            {{ t('dept.closureHealth.action') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-button-group>
</template>

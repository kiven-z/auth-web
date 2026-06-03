<script lang="ts" setup>
import { hasAuth } from '@/shared/permission';
import { useI18n } from 'vue-i18n';
import useDeptAdvancedAction from '@/views/system/dept/hooks/useDeptAdvancedAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/useDeptTableAction';

defineOptions({
  name: 'DeptHeadButtons',
});

const { t } = useI18n();
const { openClosureHealthDialog } = useDeptAdvancedAction();

const { selectedRows, viewMode, fetchTableData, fetchTreeData, refresh } = useDeptPageState();

const { openCreateDialog } = useDeptTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
});
</script>

<template>
  <el-button-group type="primary">
    <el-button type="primary" @click="openCreateDialog()">{{ t('buttons.actionAdd') }}</el-button>

    <el-dropdown v-if="hasAuth(['sysDept:diagnose'])" trigger="click">
      <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="openClosureHealthDialog">
            {{ t('dept.closureHealthCheck') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-button-group>
</template>

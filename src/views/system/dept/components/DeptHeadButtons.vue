<script lang="ts" setup>
import { hasAuth } from '@/shared/permission';
import { useI18n } from 'vue-i18n';
import useDeptAdvancedAction from '@/views/system/dept/hooks/useDeptAdvancedAction';

defineOptions({
  name: 'DeptAdvancedDropdown',
});

const { t } = useI18n();
const { openClosureHealthDialog } = useDeptAdvancedAction();
</script>

<template>
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
</template>

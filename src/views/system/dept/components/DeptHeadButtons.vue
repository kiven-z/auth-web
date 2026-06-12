<script lang="ts" setup>
import { hasAuth } from '@/auth/permission';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptHeadButtons',
});

defineProps<{
  exporting?: boolean;
  openCreateDialog?: () => void;
  openExportDialog?: () => void;
  openImportDialog?: () => void;
  openClosureHealthDialog?: () => void;
}>();

const { t } = useI18n();
</script>

<template>
  <el-button-group type="primary">
    <el-button type="primary" @click="openCreateDialog?.()">{{ t('buttons.actionAdd') }}</el-button>

    <el-dropdown trigger="click">
      <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 从 Excel 导入 -->
          <el-dropdown-item @click="openImportDialog?.()">
            {{ t('buttons.importExcel') }}
          </el-dropdown-item>
          <el-dropdown-item :disabled="exporting" @click="openExportDialog?.()">
            {{ t('buttons.exportExcel') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="hasAuth(['sysDept:diagnose'])" @click="openClosureHealthDialog?.()">
            {{ t('dept.closureHealthCheck') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-button-group>
</template>

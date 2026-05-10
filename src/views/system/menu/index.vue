<script lang="ts" setup>
import MenuElTreeView from '@/views/system/menu/components/MenuElTreeView.vue';
import MenuTableTreeView from '@/views/system/menu/components/MenuTableTreeView.vue';
import MenuTableView from '@/views/system/menu/components/MenuTableView.vue';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemMenu',
});

export type MenuViewMode = 'table' | 'tableTree' | 'tree';

const { t } = useI18n();
const { tableColumns, treeColumns } = useMenuTableColumns();
const viewMode = ref<MenuViewMode>('table');

const segmentedOptions = computed(() => [
  { label: t('sysMenu.viewTableTitle'), value: 'table' as const },
  { label: t('sysMenu.viewTableTreeTitle'), value: 'tableTree' as const },
  { label: t('sysMenu.viewTreeTitle'), value: 'tree' as const },
]);

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
  treeData,
  fetchTreeData,
} = useMenuPageState();

watch(viewMode, (mode) => {
  if (mode === 'table') {
    void fetchTableData();
  } else {
    void fetchTreeData();
  }
});

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div>
    <div class="flex justify-center pt-3 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <MenuTableView
      v-if="viewMode === 'table'"
      :columns="tableColumns"
      :fetch-table-data="fetchTableData"
      :handle-page-current-change="handlePageCurrentChange"
      :handle-page-size-change="handlePageSizeChange"
      :handle-selection-change="handleSelectionChange"
      :loading="loading"
      :pagination="pagination"
      :reset-query="resetQuery"
      :search-form="searchForm"
      :selected-row-ids="selectedRows"
      :table-data="tableData"
    />

    <MenuTableTreeView
      v-else-if="viewMode === 'tableTree'"
      :columns="treeColumns"
      :fetch-tree-data="fetchTreeData"
      :loading="loading"
      :tree-data="treeData"
    />

    <MenuElTreeView v-else :fetch-tree-data="fetchTreeData" :loading="loading" :tree-data="treeData" />
  </div>
</template>

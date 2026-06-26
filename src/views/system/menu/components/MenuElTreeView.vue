<script lang="ts" setup>
import { AuthElTreePanel } from '@/components/business/AuthElTreePanel';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { transformI18n } from '@/plugins/i18n';
import MenuRowActions from '@/views/system/menu/components/MenuRowActions.vue';
import { MENU_TYPE_OPTIONS } from '@/views/system/menu/constants/menu-type';
import { SYS_MENU_PERMS } from '@/views/system/menu/constants/permissions';
import useMenuTableAction from '@/views/system/menu/hooks/actions/useMenuTableAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import { useMenuTreeDrag } from '@/views/system/menu/hooks/useMenuTreeDrag';
import { useMenuTreeFilter } from '@/views/system/menu/hooks/useMenuTreeFilter';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuElTreeView',
});

const treeProps = {
  label: 'title',
  children: 'children',
} as const;

const { t, locale } = useI18n();

const { loading, selectedRows, treeData, treeKeyword, viewMode, fetchTableData, fetchTreeData, refresh } =
  useMenuPageState();

const { filterMenuNode } = useMenuTreeFilter();
const panelRef = ref<{ filterTree: (keyword: string) => void } | null>(null);

// 监听树形视图关键词
watch(treeKeyword, (val) => {
  panelRef.value?.filterTree(val);
});

// 监听语言
watch(locale, () => {
  panelRef.value?.filterTree(treeKeyword.value);
});

const { openCreateDialog } = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
});

const { allowDrag, allowDrop, handleNodeDrop } = useMenuTreeDrag({
  treeData,
  onMoved: fetchTreeData,
});

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <AuthElTreePanel
    ref="panelRef"
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('sysMenu.collapseAll')"
    :draggable="true"
    :expand-all-label="t('sysMenu.expandAll')"
    :filter-node-method="(value, data) => filterMenuNode(value, data)"
    :loading="loading"
    :show-actions-on-hover="true"
    :title="t('sysMenu.tableTitle')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="fetchTreeData"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <el-button v-perms="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
        {{ t('buttons.actionAdd') }}
      </el-button>
    </template>

    <template #search>
      <el-input
        v-model="treeKeyword"
        :placeholder="t('sysMenu.treeKeyword')"
        :prefix-icon="useRenderIcon('ri/search-line')"
        clearable
      />
    </template>

    <template #meta="{ data }">
      <span class="font-medium">{{ transformI18n(data.title) }}</span>
      <el-text type="info">({{ data.name }})</el-text>
      <el-tag
        v-for="option in MENU_TYPE_OPTIONS.filter((item) => item.value === data.menuType)"
        :key="option.value"
        :type="option.tagType"
        effect="plain"
        size="small"
      >
        {{ t(option.labelKey) }}
      </el-tag>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <MenuRowActions :row="data" show-add-child />
    </template>
  </AuthElTreePanel>
</template>

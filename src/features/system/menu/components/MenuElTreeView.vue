<script lang="ts" setup>
import ElTreePanel from '@/components/table/ElTreePanel';
import { useRenderIcon } from '@/components/ui/Icon';
import { transformI18n } from '@/app/plugins/i18n';
import MenuRowActions from '@/features/system/menu/components/MenuRowActions.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import useMenuTableAction from '@/features/system/menu/hooks/actions/useMenuTableAction';
import useMenuPageState from '@/features/system/menu/hooks/useMenuPageState';
import { useMenuTreeDrag } from '@/features/system/menu/hooks/useMenuTreeDrag';
import { useMenuTreeFilter } from '@/features/system/menu/hooks/useMenuTreeFilter';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/useMenuTypeOptions';
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
const menuTypeOptions = useMenuTypeOptions();

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
  <ElTreePanel
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
      <el-button v-auth="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
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
        v-for="option in menuTypeOptions.filter((item) => item.value === data.menuType)"
        :key="option.value"
        :type="option.tagType"
        effect="plain"
        size="small"
      >
        {{ option.label }}
      </el-tag>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <MenuRowActions :row="data" show-add-child />
    </template>
  </ElTreePanel>
</template>

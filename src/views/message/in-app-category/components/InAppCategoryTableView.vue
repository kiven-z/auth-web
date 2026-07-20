<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import InAppCategorySearchForm from '@/views/message/in-app-category/components/InAppCategorySearchForm.vue';
import useInAppCategoryPageState from '@/views/message/in-app-category/hooks/useInAppCategoryPageState';
import useInAppCategoryTableColumns from '@/views/message/in-app-category/hooks/useInAppCategoryTableColumns';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryTableView',
});

const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
} as const;

const { t } = useI18n();
const { columns } = useInAppCategoryTableColumns();
const { loading, treeData, fetchTreeData } = useInAppCategoryPageState();

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <div>
    <InAppCategorySearchForm />

    <TableBar
      :columns="columns"
      :refresh-loading="loading"
      :title="t('inAppCategory.page.title')"
      @refresh="fetchTreeData"
    >
      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          :columns="dynamicColumns"
          :data="treeData"
          :loading="loading"
          :pagination="null"
          :size="size"
          :tree-props="treeProps"
          adaptive
          align-whole="center"
          border
          default-expand-all
          highlight-current-row
          row-key="id"
          show-overflow-tooltip
        />
      </template>
    </TableBar>
  </div>
</template>

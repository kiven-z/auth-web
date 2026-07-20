<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import InAppCategoryRowActions from '@/views/message/in-app-category/components/InAppCategoryRowActions.vue';
import InAppCategorySearchForm from '@/views/message/in-app-category/components/InAppCategorySearchForm.vue';
import { IN_APP_CATEGORY_PERMS } from '@/views/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/views/message/in-app-category/hooks/useInAppCategoryPageState';
import useInAppCategoryTableAction from '@/views/message/in-app-category/hooks/useInAppCategoryTableAction';
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
const { loading, treeData, fetchTreeData, refresh } = useInAppCategoryPageState();
const { openCreateDialog } = useInAppCategoryTableAction({ refresh });

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
      <template #buttons>
        <el-button-group type="primary">
          <!-- 新增分类 -->
          <el-button v-perms="IN_APP_CATEGORY_PERMS.CREATE" @click="openCreateDialog()">
            {{ t('buttons.actionAdd') }}
          </el-button>
        </el-button-group>
      </template>

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
        >
          <template #actions="{ row }">
            <InAppCategoryRowActions :row="row" />
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

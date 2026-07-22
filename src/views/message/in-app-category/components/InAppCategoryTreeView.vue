<script lang="ts" setup>
import AuthElTreePanel from '@/components/business/AuthElTreePanel';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import InAppCategoryRowActions from '@/views/message/in-app-category/components/InAppCategoryRowActions.vue';
import InAppCategorySearchForm from '@/views/message/in-app-category/components/InAppCategorySearchForm.vue';
import { IN_APP_CATEGORY_PERMS } from '@/views/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/views/message/in-app-category/hooks/useInAppCategoryPageState';
import useInAppCategoryTableAction from '@/views/message/in-app-category/hooks/useInAppCategoryTableAction';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryTreeView',
});

const treeProps = {
  label: 'name',
  children: 'children',
} as const;

const { t } = useI18n();
const { loading, treeData, selectedRows, fetchTreeData, refresh } = useInAppCategoryPageState();
const { openCreateDialog } = useInAppCategoryTableAction({ refresh, selectedRows });

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <div>
    <InAppCategorySearchForm />

    <AuthElTreePanel
      :collapse-all-label="t('inAppCategory.page.tree.collapseAll')"
      :expand-all-label="t('inAppCategory.page.tree.expandAll')"
      :loading="loading"
      :show-actions-on-hover="true"
      :title="t('inAppCategory.page.title')"
      :tree-data="treeData"
      :tree-props="treeProps"
      @refresh="fetchTreeData"
    >
      <template #toolbar>
        <el-button-group type="primary">
          <!-- 新增分类 -->
          <el-button v-perms="IN_APP_CATEGORY_PERMS.CREATE" @click="openCreateDialog()">
            {{ t('buttons.actionAdd') }}
          </el-button>
        </el-button-group>
      </template>

      <template #meta="{ data }">
        <span :class="{ 'text-(--el-text-color-secondary)': !data.status }" class="font-medium">{{ data.name }}</span>
        <el-text type="info">({{ data.code }})</el-text>
        <el-tag v-if="data.parentId === TREE_ROOT_PARENT_ID" effect="plain" size="small" type="primary">
          {{ t('inAppCategory.rootLabel') }}
        </el-tag>
        <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
          {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
        </el-tag>
      </template>

      <template #actions="{ data }">
        <InAppCategoryRowActions :row="data" />
      </template>
    </AuthElTreePanel>
  </div>
</template>

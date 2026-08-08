<script lang="ts" setup>
import ListTable from '@/components/table/ListTable';
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
const categoryState = useInAppCategoryPageState();
const { selectedRows, fetchTableData, refresh } = categoryState;
const { openCreateDialog, batchUpdateStatus, deleteBatchRows } = useInAppCategoryTableAction({
  refresh,
  selectedRows,
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <InAppCategorySearchForm />

    <ListTable
      :columns="columns"
      :default-expand-all="true"
      :state="categoryState"
      :title="t('inAppCategory.page.title')"
      :tree-props="treeProps"
    >
      <template #buttons>
        <el-button v-perms="IN_APP_CATEGORY_PERMS.CREATE" type="primary" @click="openCreateDialog()">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <Perms :value="IN_APP_CATEGORY_PERMS.UPDATE">
          <el-dropdown trigger="click">
            <el-button :disabled="selectedRows.length <= 0" type="warning">
              {{ t('buttons.actionBatchStatus') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, true)">
                {{ t('buttons.actionBatchEnable') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, false)">
                {{ t('buttons.actionBatchDisable') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>

        <Perms :value="IN_APP_CATEGORY_PERMS.DELETE">
          <el-dropdown trigger="click">
            <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>
      </template>

      <template #actions="{ row }">
        <InAppCategoryRowActions :row="row" />
      </template>
    </ListTable>
  </div>
</template>

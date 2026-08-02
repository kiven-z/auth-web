<script lang="ts" setup>
import type { InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
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
const { loading, treeData, selectedRows, fetchTreeData, refresh } = useInAppCategoryPageState();
const { openCreateDialog, batchUpdateStatus, deleteBatchRows } = useInAppCategoryTableAction({
  refresh,
  selectedRows,
});

onMounted(() => {
  fetchTreeData();
});

/** 表格多选 → id 列表（仅表格视图） */
const onSelectionChange = (rows: InAppMessageCategoryPageRow[]) => {
  selectedRows.value = rows.map((row) => row.id);
};
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
          <el-button v-perms="IN_APP_CATEGORY_PERMS.CREATE" @click="openCreateDialog()">
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
          @selection-change="onSelectionChange"
        >
          <template #actions="{ row }">
            <InAppCategoryRowActions :row="row" />
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

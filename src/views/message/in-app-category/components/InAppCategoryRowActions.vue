<script lang="ts" setup>
import type { InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { IN_APP_CATEGORY_PERMS } from '@/views/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/views/message/in-app-category/hooks/useInAppCategoryPageState';
import useInAppCategoryTableAction from '@/views/message/in-app-category/hooks/useInAppCategoryTableAction';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryRowActions',
});

/** 业务分类行操作 props */
interface InAppCategoryRowActionsProps {
  /** 表格行或树节点 */
  row: InAppMessageCategoryPageRow;
}

const props = defineProps<InAppCategoryRowActionsProps>();

const { t } = useI18n();
const { refresh, selectedRows } = useInAppCategoryPageState();
const { openCreateDialog, openEditDialog, openDetailDialog, batchUpdateStatus, deleteBatchRows } =
  useInAppCategoryTableAction({
    refresh,
    selectedRows,
  });

/** 仅启用中的大类可新增下级 */
const canAddChild = computed(() => props.row.parentId === TREE_ROOT_PARENT_ID && props.row.status);
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-1">
    <el-button v-perms="IN_APP_CATEGORY_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（仅大类） -->
    <el-button
      v-if="canAddChild"
      v-perms="IN_APP_CATEGORY_PERMS.CREATE"
      link
      type="primary"
      @click="openCreateDialog(row)"
    >
      {{ t('inAppCategory.action.addChild') }}
    </el-button>

    <el-button v-perms="IN_APP_CATEGORY_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <el-button v-perms="IN_APP_CATEGORY_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <Perms :value="IN_APP_CATEGORY_PERMS.UPDATE">
      <el-dropdown trigger="click">
        <el-button class="ml-1!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="row.status === true" @click="batchUpdateStatus([row.id], true)">
              {{ t('buttons.statusActiveText') }}
            </el-dropdown-item>
            <el-dropdown-item :disabled="row.status === false" @click="batchUpdateStatus([row.id], false)">
              {{ t('buttons.statusInactiveText') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </Perms>
  </div>
</template>

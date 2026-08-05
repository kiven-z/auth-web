<script lang="ts" setup>
import {
  getInAppSendTaskById,
  getInAppSendTaskPage,
  type InAppSendTaskPageQuery,
  type InAppSendTaskPageRow,
} from '@/api/message/in-app-message';
import type { InAppTemplateContentType } from '@/api/message/in-app-template';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import InAppSendTaskDetailView from '@/views/message/_shared/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/views/message/_shared/hooks/useInAppMessageDetailColumns';
import useInAppHistoryImportTableColumns from '@/views/message/compose/hooks/useInAppHistoryImportTableColumns';
import type { InAppHistoryImportPayload } from '@/views/message/compose/types/compose-import';
import { IN_APP_MESSAGE_PERMS } from '@/views/message/in-app-message/constants/permissions';
import useInAppMessageOptions from '@/views/message/in-app-message/hooks/options/useInAppMessageOptions';
import type { FormInstance } from 'element-plus';
import { h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppHistoryImportDialog',
});

const emit = defineEmits<{
  import: [payload: InAppHistoryImportPayload];
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();
const { columns } = useInAppHistoryImportTableColumns();
const { detailColumns } = useInAppMessageDetailColumns();
const searchFormRef = ref<FormInstance>();
const importingId = ref<string>('');

const historyImportState = usePaginationState<InAppSendTaskPageRow, InAppSendTaskPageQuery>({
  fetchApi: getInAppSendTaskPage,
  searchForm: reactive({
    title: undefined,
    status: undefined,
    sourceType: undefined,
    recipientScopeType: undefined,
    categoryId: undefined,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = historyImportState;

/**
 * 打开历史发送任务详情预览
 * @param row 表格行
 */
function openDetailDialog(row: InAppSendTaskPageRow): void {
  addDialog({
    title: t('inAppMessage.title.detail'),
    draggable: true,
    fullscreenIcon: true,
    hideFooter: true,
    contentRenderer: () =>
      h(InAppSendTaskDetailView, {
        taskId: row.id,
        columns: detailColumns.value,
        contentLabel: t('inAppMessage.field.content'),
      }),
  });
}

/**
 * 按历史任务详情导入定稿内容到撰写表单
 * @param row 表格行
 */
async function handleImport(row: InAppSendTaskPageRow): Promise<void> {
  try {
    importingId.value = row.id;
    const detail = await getInAppSendTaskById(row.id);

    emit('import', {
      templateCode: detail.sceneCode,
      title: detail.title,
      body: detail.content,
      contentType: detail.contentType as InAppTemplateContentType,
    });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    importingId.value = '';
  }
}

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="in-app-history-import-dialog">
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="w-full overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('inAppMessage.field.title')" prop="title">
        <el-input
          v-model="searchForm.title"
          :placeholder="ph.input('inAppMessage.field.title')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppMessage.field.status')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.recipientScopeType')" prop="recipientScopeType">
        <el-select
          v-model="searchForm.recipientScopeType"
          :placeholder="ph.selectFilter('inAppMessage.field.recipientScopeType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.sourceType')" prop="sourceType">
        <el-select
          v-model="searchForm.sourceType"
          :placeholder="ph.selectFilter('inAppMessage.field.sourceType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="IN_APP_MESSAGE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="IN_APP_MESSAGE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable
      :columns="columns"
      :state="historyImportState"
      :title="t('inAppCompose.importHistoryDialogTitle')"
      show-overflow-tooltip
    >
      <template #actions="{ row }">
        <el-button v-perms="IN_APP_MESSAGE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-perms="IN_APP_MESSAGE_PERMS.DETAIL"
          :loading="importingId === row.id"
          class="ml-2!"
          link
          type="primary"
          @click="handleImport(row)"
        >
          {{ t('inAppCompose.importTemplateConfirm') }}
        </el-button>
      </template>
    </PagedTable>
  </div>
</template>

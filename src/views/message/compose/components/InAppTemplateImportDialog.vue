<script lang="ts" setup>
import type { InAppTemplateContentType } from '@/api/message/in-app-template';
import {
  getMessageTemplateById,
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import MessageTemplateDetailView from '@/views/message/_shared/components/MessageTemplateDetailView.vue';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';
import { MESSAGE_TEMPLATE_CONTENT_TYPES } from '@/views/message/_shared/constants/content-type';
import useInAppTemplateImportTableColumns from '@/views/message/compose/hooks/useInAppTemplateImportTableColumns';
import type { InAppTemplateImportPayload } from '@/views/message/compose/types/compose-import';
import useInAppTemplateDetailColumns from '@/views/message/in-app-template/hooks/useInAppTemplateDetailColumns';
import type { FormInstance } from 'element-plus';
import { h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppTemplateImportDialog',
});

const emit = defineEmits<{
  import: [payload: InAppTemplateImportPayload];
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useInAppTemplateImportTableColumns();
const { detailColumns } = useInAppTemplateDetailColumns();
const searchFormRef = ref<FormInstance>();
const importingId = ref<string>('');

const templateImportState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive({
    channel: IN_APP_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    imMessageType: undefined,
    status: true,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = templateImportState;

/**
 * 打开模板详情预览
 * @param row 表格行
 */
function openDetailDialog(row: MessageTemplatePageRow): void {
  addDialog({
    title: t('inAppTemplate.detailDialogTitle'),
    draggable: true,
    fullscreenIcon: true,
    hideFooter: true,
    contentRenderer: () =>
      h(MessageTemplateDetailView, {
        id: row.id,
        channel: IN_APP_TEMPLATE_CHANNEL,
        columns: detailColumns.value,
        contentLabel: t('inAppTemplate.content'),
      }),
  });
}

/**
 * 按来源导入模板到撰写表单
 * @param row 表格行
 * @param bodySource 正文来源
 */
async function handleImport(row: MessageTemplatePageRow, bodySource: string): Promise<void> {
  try {
    importingId.value = row.id;
    const detail = await getMessageTemplateById(row.id, IN_APP_TEMPLATE_CHANNEL);

    emit('import', {
      templateCode: detail.templateCode,
      title: detail.subject ?? '',
      body: detail[bodySource] ?? '',
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
  <div class="in-app-template-import-dialog">
    <el-form ref="searchFormRef" :model="searchForm" class="w-full overflow-auto pl-8 pt-3" inline>
      <!-- 场景编码 -->
      <el-form-item :label="t('inAppTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('inAppTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 模板名称 -->
      <el-form-item :label="t('inAppTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('inAppTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 标题模板 -->
      <el-form-item :label="t('inAppTemplate.subject')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          :placeholder="ph.input('inAppTemplate.subject')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 正文类型 -->
      <el-form-item :label="t('inAppTemplate.contentType')" prop="imMessageType">
        <el-select
          v-model="searchForm.imMessageType"
          :placeholder="ph.selectFilter('inAppTemplate.contentType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="type in MESSAGE_TEMPLATE_CONTENT_TYPES" :key="type" :label="type" :value="type" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="templateImportState"
      :title="t('inAppCompose.importTemplateDialogTitle')"
      show-overflow-tooltip
    >
      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 导入（原文 / 预览） -->
        <el-dropdown trigger="click" @command="(command) => handleImport(row, command)">
          <el-button :loading="importingId === row.id" class="ml-2!" link type="primary">
            {{ t('inAppCompose.importTemplateConfirm') }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="content">{{ t('inAppCompose.importContent') }}</el-dropdown-item>
              <el-dropdown-item command="previewContent">{{ t('inAppCompose.importPreview') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

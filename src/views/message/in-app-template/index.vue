<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/in-app-template/constants/channel';
import { IN_APP_CONTENT_TYPES } from '@/views/message/in-app-template/constants/content-type';
import { IN_APP_TEMPLATE_PERMS } from '@/views/message/in-app-template/constants/permissions';
import useInAppTemplateTableAction from '@/views/message/in-app-template/hooks/useInAppTemplateTableAction';
import useInAppTemplateTableColumns from '@/views/message/in-app-template/hooks/useInAppTemplateTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemInAppTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useInAppTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const inAppTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive({
    channel: IN_APP_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    imMessageType: undefined,
    status: undefined,
  }),
  errorI18nKey: 'inAppTemplate.loadFailed',
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = inAppTemplateState;
const { openDetailDialog, deleteBatchRows, batchUpdateStatus } = useInAppTemplateTableAction({
  fetchTableData,
  selectedRows,
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 场景编码（scene_code） -->
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
      <!-- 标题模板（subject） -->
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
          <el-option v-for="type in IN_APP_CONTENT_TYPES" :key="type" :label="type" :value="type" />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('inAppTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppTemplate.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="IN_APP_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="IN_APP_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="inAppTemplateState"
      :title="t('inAppTemplate.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 高级功能 -->
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <!-- 批量删除 -->
              <Perms :value="IN_APP_TEMPLATE_PERMS.DELETE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </Perms>
              <!-- 批量启用 -->
              <Perms :value="IN_APP_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
              </Perms>
              <!-- 批量停用 -->
              <Perms :value="IN_APP_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(false)">
                  {{ t('buttons.actionBatchDisable') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

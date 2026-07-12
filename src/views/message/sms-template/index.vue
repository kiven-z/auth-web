<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/sms-template/constants/channel';
import { SMS_TEMPLATE_PERMS } from '@/views/message/sms-template/constants/permissions';
import useSmsTemplateTableAction from '@/views/message/sms-template/hooks/useSmsTemplateTableAction';
import useSmsTemplateTableColumns from '@/views/message/sms-template/hooks/useSmsTemplateTableColumns';
import { useSmsTemplateTableMoreAction } from '@/views/message/sms-template/hooks/useSmsTemplateTableMoreAction';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemSmsTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useSmsTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const smsTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive<MessageTemplatePageQuery>({
    channel: SMS_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    status: undefined,
  }),
  errorI18nKey: 'smsTemplate.loadFailed',
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = smsTemplateState;
const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useSmsTemplateTableAction({
    fetchTableData,
    selectedRows,
  });
const { openRequireFields, openTestSend } = useSmsTemplateTableMoreAction({ fetchTableData });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('smsTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('smsTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 模板名称 -->
      <el-form-item :label="t('smsTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('smsTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('smsTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('smsTemplate.status')"
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
          <el-button v-perms="SMS_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SMS_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :adaptive-config="{ offsetBottom: 96 }"
      :columns="columns"
      :state="smsTemplateState"
      :title="t('smsTemplate.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button v-perms="SMS_TEMPLATE_PERMS.CREATE" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <!-- 高级功能 -->
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <!-- 批量删除 -->
              <Perms :value="SMS_TEMPLATE_PERMS.DELETE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </Perms>
              <!-- 批量启用 -->
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
              </Perms>
              <!-- 批量停用 -->
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
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
        <el-button v-perms="SMS_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 编辑 -->
        <el-button v-perms="SMS_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="SMS_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <!-- 更多 -->
        <el-dropdown class="ml-1" trigger="click">
          <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 必填变量 -->
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openRequireFields(row)">
                  {{ t('messageTemplate.requireFieldsMenu') }}
                </el-dropdown-item>
              </Perms>
              <!-- 测试发送 -->
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTestSend(row)">
                  {{ t('messageTemplate.testSendMenu') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';
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
const booleanStatusOptions = useCommonBooleanStatusOptions();
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
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('smsTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('smsTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('smsTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('smsTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('smsTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('smsTemplate.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-perms="SMS_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-perms="SMS_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="smsTemplateState" :title="t('smsTemplate.tableTitle')">
      <template #buttons>
        <el-button v-perms="SMS_TEMPLATE_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <Perms :value="SMS_TEMPLATE_PERMS.DELETE">
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(true)">
                {{ t('buttons.actionBatchEnable') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(false)">
                {{ t('buttons.actionBatchDisable') }}
              </el-dropdown-item>
            </Perms>
          </template>
        </el-dropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SMS_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SMS_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SMS_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openRequireFields(row)">
                  {{ t('messageTemplate.requireFieldsMenu') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SMS_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTestSend(row)">
                  {{ t('messageTemplate.testSendMenu') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ListTable>
  </div>
</template>

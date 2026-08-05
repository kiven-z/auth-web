<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import useEmailTemplateTableAction from '@/views/message/email-template/hooks/useEmailTemplateTableAction';
import useEmailTemplateTableColumns from '@/views/message/email-template/hooks/useEmailTemplateTableColumns';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EMAIL_TEMPLATE_PERMS } from '@/views/message/email-template/constants/permissions';
import { useEmailTemplateTableMoreAction } from '@/views/message/email-template/hooks/useEmailTemplateTableMoreAction';
import { EMAIL_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';

defineOptions({
  name: 'SystemEmailTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useEmailTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const emailTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive<MessageTemplatePageQuery>({
    channel: EMAIL_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    status: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = emailTemplateState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useEmailTemplateTableAction({ fetchTableData, selectedRows });
const { openRequireFields, openTestSend, openTemplateContentEdit } = useEmailTemplateTableMoreAction({
  fetchTableData,
});

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
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('emailTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('emailTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.subject')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          :placeholder="ph.input('emailTemplate.subject')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('emailTemplate.status')"
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
        <el-button-group>
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable
      :columns="columns"
      :state="emailTemplateState"
      :title="t('emailTemplate.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.CREATE" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <Perms :value="EMAIL_TEMPLATE_PERMS.DELETE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(false)">
                  {{ t('buttons.actionBatchDisable') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openRequireFields(row)">
                  {{ t('messageTemplate.requireFieldsMenu') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTestSend(row)">
                  {{ t('messageTemplate.testSendMenu') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTemplateContentEdit(row)">
                  {{ t('emailTemplate.templateEditMenu') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </PagedTable>
  </div>
</template>

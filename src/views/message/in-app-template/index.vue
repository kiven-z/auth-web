<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';
import { MESSAGE_TEMPLATE_CONTENT_TYPES } from '@/views/message/_shared/constants/content-type';
import { IN_APP_TEMPLATE_PERMS } from '@/views/message/in-app-template/constants/permissions';
import useInAppTemplateTableAction from '@/views/message/in-app-template/hooks/useInAppTemplateTableAction';
import useInAppTemplateTableColumns from '@/views/message/in-app-template/hooks/useInAppTemplateTableColumns';
import { useInAppTemplateTableMoreAction } from '@/views/message/in-app-template/hooks/useInAppTemplateTableMoreAction';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemInAppTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
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
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = inAppTemplateState;
const { openCreateDrawer, openEditDrawer, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useInAppTemplateTableAction({
    fetchTableData,
    selectedRows,
  });
const { openRequireFields, openTestSend } = useInAppTemplateTableMoreAction({ fetchTableData });

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
      <el-form-item :label="t('inAppTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('inAppTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
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
      <el-form-item :label="t('inAppTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppTemplate.status')"
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
          <el-button v-perms="IN_APP_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="IN_APP_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="columns" :state="inAppTemplateState" :title="t('inAppTemplate.tableTitle')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="IN_APP_TEMPLATE_PERMS.CREATE" @click="openCreateDrawer">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <Perms :value="IN_APP_TEMPLATE_PERMS.DELETE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="IN_APP_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
              </Perms>
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
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDrawer(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="IN_APP_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openRequireFields(row)">
                  {{ t('messageTemplate.requireFieldsMenu') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="IN_APP_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTestSend(row)">
                  {{ t('messageTemplate.testSendMenu') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </PagedTable>
  </div>
</template>

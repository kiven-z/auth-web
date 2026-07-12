<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useEmailTemplateTableAction from '@/views/message/email-template/hooks/useEmailTemplateTableAction';
import useEmailTemplateTableColumns from '@/views/message/email-template/hooks/useEmailTemplateTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';
import { EMAIL_TEMPLATE_PERMS } from '@/views/message/email-template/constants/permissions';
import { useEmailTemplateTableMoreAction } from '@/views/message/email-template/hooks/useEmailTemplateTableMoreAction';
import { EMAIL_TEMPLATE_CHANNEL } from '@/views/message/email-template/constants/channel';

defineOptions({
  name: 'SystemEmailTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
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
  errorI18nKey: 'emailTemplate.loadFailed',
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = emailTemplateState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useEmailTemplateTableAction({ fetchTableData, selectedRows });
const { openPreview, openRequireFields, openTestSend, openTemplateContentEdit } = useEmailTemplateTableMoreAction({
  fetchTableData,
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('emailTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 模板名称 -->
      <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('emailTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 邮件主题 -->
      <el-form-item :label="t('emailTemplate.subject')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          :placeholder="ph.input('emailTemplate.subject')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('emailTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('emailTemplate.status')"
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
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :adaptive-config="{ offsetBottom: 96 }"
      :columns="columns"
      :state="emailTemplateState"
      :title="t('emailTemplate.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button v-perms="EMAIL_TEMPLATE_PERMS.CREATE" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <!-- 修改状态 -->
          <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
            <el-dropdown trigger="click">
              <el-button :disabled="selectedRows.length <= 0" type="warning">
                {{ t('buttons.actionBatchStatus') }}
              </el-button>

              <template #dropdown>
                <!-- 批量启用 -->
                <el-dropdown-item @click="batchUpdateStatus(selectedRows, true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>

                <!-- 批量停用 -->
                <el-dropdown-item @click="batchUpdateStatus(selectedRows, false)">
                  {{ t('buttons.actionBatchDisable') }}
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </Perms>

          <!-- 高级功能 -->
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <!-- 批量删除 -->
              <Perms :value="EMAIL_TEMPLATE_PERMS.DELETE">
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 编辑 -->
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="EMAIL_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <!-- 更多 -->
        <el-dropdown class="ml-1" trigger="click">
          <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 预览 -->
              <Perms :value="EMAIL_TEMPLATE_PERMS.DETAIL">
                <el-dropdown-item @click="openPreview(row)">
                  {{ t('emailTemplate.preview') }}
                </el-dropdown-item>
              </Perms>
              <!-- 必填字段 -->
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openRequireFields(row)">
                  {{ t('emailTemplate.requireFieldsMenu') }}
                </el-dropdown-item>
              </Perms>
              <!-- 测试发送 -->
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTestSend(row)">
                  {{ t('emailTemplate.testSendMenu') }}
                </el-dropdown-item>
              </Perms>
              <!-- 模板编辑 -->
              <Perms :value="EMAIL_TEMPLATE_PERMS.UPDATE">
                <el-dropdown-item @click="openTemplateContentEdit(row)">
                  {{ t('emailTemplate.templateEditMenu') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

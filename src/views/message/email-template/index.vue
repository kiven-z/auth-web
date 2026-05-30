<script lang="ts" setup>
import { getEmailTemplatePage } from '@/api/system/email-template';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import { emailTemplateStatusFilterOptions } from '@/views/message/email-template/constants/email-template-search-options';
import useEmailTemplateTableAction from '@/views/message/email-template/hooks/useEmailTemplateTableAction';
import useEmailTemplateTableColumns from '@/views/message/email-template/hooks/useEmailTemplateTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemEmailTemplate',
});

const { t } = useI18n();
const { columns } = useEmailTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const emailTemplateState = usePaginationState({
  fetchApi: getEmailTemplatePage,
  searchForm: reactive({
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    status: undefined,
  }),
  errorI18nKey: 'emailTemplate.loadFailed',
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = emailTemplateState;

const {
  openCreateDialog,
  openEditDialog,
  openDetailDialog,
  openPreview,
  openRequireFields,
  openTestSend,
  openTemplateContentEdit,
  deleteBatchRows,
  batchUpdateStatus,
} = useEmailTemplateTableAction({ fetchTableData, selectedRows });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-alert class="mb-3" closable show-icon type="primary">
      数据表 sys_message_template，仅管理与发送渠道 EMAIL 对应的行；下列「场景编码」即库字段 scene_code，与发送接口
      templateCode 一致。
    </el-alert>

    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
        <el-input v-model="searchForm.templateCode" class="w-45!" clearable />
      </el-form-item>
      <!-- 模板名称 -->
      <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
        <el-input v-model="searchForm.templateName" class="w-45!" clearable />
      </el-form-item>
      <!-- 邮件主题 -->
      <el-form-item :label="t('emailTemplate.subject')" prop="subject">
        <el-input v-model="searchForm.subject" class="w-45!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('emailTemplate.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('emailTemplate.status')" class="w-45!" clearable>
          <el-option
            v-for="opt in emailTemplateStatusFilterOptions"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
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
          <el-button @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <!-- 修改状态 -->
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

          <!-- 高级功能 -->
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <!-- 批量删除 -->
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
        <!-- 编辑 -->
        <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
        <!-- 删除 -->
        <el-button link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <!-- 更多 -->
        <el-dropdown class="ml-1" trigger="click">
          <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 预览 -->
              <el-dropdown-item @click="openPreview(row)">{{ t('emailTemplate.preview') }}</el-dropdown-item>
              <!-- 必填字段 -->
              <el-dropdown-item @click="openRequireFields(row)">
                {{ t('emailTemplate.requireFieldsMenu') }}
              </el-dropdown-item>
              <!-- 测试发送 -->
              <el-dropdown-item @click="openTestSend(row)">
                {{ t('emailTemplate.testSendMenu') }}
              </el-dropdown-item>
              <!-- 模板编辑 -->
              <el-dropdown-item @click="openTemplateContentEdit(row)">
                {{ t('emailTemplate.templateEditMenu') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

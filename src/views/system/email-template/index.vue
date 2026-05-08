<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import useEmailTemplatePageState from '@/views/system/email-template/hooks/useEmailTemplatePageState';
import useEmailTemplateTableAction from '@/views/system/email-template/hooks/useEmailTemplateTableAction';
import useEmailTemplateTableColumns from '@/views/system/email-template/hooks/useEmailTemplateTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EMAIL_TEMPLATE_STATUS_FILTER_OPTIONS } from '@/views/system/email-template/constants/email-template-search-options';

defineOptions({
  name: 'SystemEmailTemplate',
});

const { t } = useI18n();
const { columns } = useEmailTemplateTableColumns();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  selectedRows,
  searchForm,
  onSearch,
  onReset,
  onPageSizeChange,
  onPageCurrentChange,
  onSelectionChange,
} = useEmailTemplatePageState();

const {
  openAdd,
  openEdit,
  openDetail,
  openPreview,
  openRequireFields,
  openTestSend,
  openTemplateContentEdit,
  removeBatch,
  batchUpdateStatus,
} = useEmailTemplateTableAction({ onSearch });

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <!-- 模板编码 -->
      <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
        <el-input v-model="searchForm.templateCode" class="w-[220px]!" clearable />
      </el-form-item>
      <!-- 模板名称 -->
      <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
        <el-input v-model="searchForm.templateName" class="w-[220px]!" clearable />
      </el-form-item>
      <!-- 邮件主题 -->
      <el-form-item :label="t('emailTemplate.subject')" prop="subject">
        <el-input v-model="searchForm.subject" class="w-[220px]!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('emailTemplate.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('emailTemplate.status')" class="w-[220px]!" clearable>
          <el-option
            v-for="opt in EMAIL_TEMPLATE_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSearch">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="onReset(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('emailTemplate.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button @click="openAdd">{{ t('buttons.actionAdd') }}</el-button>

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
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="removeBatch(selectedRows)">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
          :adaptive-config="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="tableData"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="loading"
          :pagination="pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          show-overflow-tooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @page-current-change="onPageCurrentChange"
          @selection-change="onSelectionChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center flex-wrap gap-x-1">
              <!-- 查看 -->
              <el-button link type="primary" @click="openDetail(row)">{{ t('buttons.actionView') }}</el-button>
              <!-- 编辑 -->
              <el-button link type="primary" @click="openEdit(row)">{{ t('buttons.actionEdit') }}</el-button>
              <!-- 删除 -->
              <el-button link type="danger" @click="removeBatch([row.id])">{{ t('buttons.actionDelete') }}</el-button>
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
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

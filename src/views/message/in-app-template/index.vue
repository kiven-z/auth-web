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
    status: undefined,
  }),
  errorI18nKey: 'inAppTemplate.loadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = inAppTemplateState;
const { openDetailDialog } = useInAppTemplateTableAction();

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
      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="IN_APP_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

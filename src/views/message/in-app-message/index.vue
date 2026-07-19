<script lang="ts" setup>
import { getInAppSendTaskPage, type InAppSendTaskPageQuery } from '@/api/message/in-app-message';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { IN_APP_MESSAGE_PERMS } from '@/views/message/in-app-message/constants/permissions';
import {
  IN_APP_MESSAGE_DELETABLE_STATUS,
  IN_APP_MESSAGE_DELIVERY_OPTIONS,
  IN_APP_MESSAGE_RECALLABLE_STATUS,
  IN_APP_MESSAGE_RETRYABLE_STATUS,
  IN_APP_MESSAGE_SCOPE_OPTIONS,
  IN_APP_MESSAGE_SOURCE_OPTIONS,
  IN_APP_MESSAGE_STATUS_ITEMS,
} from '@/views/message/in-app-message/constants/task-enums';
import useInAppMessageTableAction from '@/views/message/in-app-message/hooks/useInAppMessageTableAction';
import useInAppMessageTableColumns from '@/views/message/in-app-message/hooks/useInAppMessageTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppMessage',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useInAppMessageTableColumns();
const searchFormRef = ref<FormInstance>();

const inAppMessageState = usePaginationState({
  fetchApi: getInAppSendTaskPage,
  searchForm: reactive<InAppSendTaskPageQuery>({
    title: undefined,
    status: undefined,
    sourceType: undefined,
    recipientScopeType: undefined,
    deliveryMode: undefined,
    bizType: undefined,
  }),
});
const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = inAppMessageState;
const { openDetailDialog, retryTask, recallTask, deleteBatchRows } = useInAppMessageTableAction({
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
      <!-- 标题关键字 -->
      <el-form-item :label="t('inAppMessage.field.title')" prop="title">
        <el-input
          v-model="searchForm.title"
          :placeholder="ph.input('inAppMessage.field.title')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 任务状态 -->
      <el-form-item :label="t('inAppMessage.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppMessage.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in IN_APP_MESSAGE_STATUS_ITEMS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 接收范围 -->
      <el-form-item :label="t('inAppMessage.field.recipientScopeType')" prop="recipientScopeType">
        <el-select
          v-model="searchForm.recipientScopeType"
          :placeholder="ph.selectFilter('inAppMessage.field.recipientScopeType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in IN_APP_MESSAGE_SCOPE_OPTIONS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 投递模式 -->
      <el-form-item :label="t('inAppMessage.field.deliveryMode')" prop="deliveryMode">
        <el-select
          v-model="searchForm.deliveryMode"
          :placeholder="ph.selectFilter('inAppMessage.field.deliveryMode')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in IN_APP_MESSAGE_DELIVERY_OPTIONS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 来源 -->
      <el-form-item :label="t('inAppMessage.field.sourceType')" prop="sourceType">
        <el-select
          v-model="searchForm.sourceType"
          :placeholder="ph.selectFilter('inAppMessage.field.sourceType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in IN_APP_MESSAGE_SOURCE_OPTIONS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 业务分类 -->
      <el-form-item :label="t('inAppMessage.field.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="ph.input('inAppMessage.field.bizType')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="IN_APP_MESSAGE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="IN_APP_MESSAGE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="inAppMessageState"
      :title="t('inAppMessage.title.table')"
      show-overflow-tooltip
    >
      <template #buttons>
        <Perms :value="IN_APP_MESSAGE_PERMS.DELETE">
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
                <!-- 批量删除 -->
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="IN_APP_MESSAGE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 补发：管理端编排 + PUSH + 可恢复状态 -->
        <el-button
          v-if="
            row.sourceType === 'ADMIN_COMPOSE' &&
            row.deliveryMode === 'PUSH' &&
            IN_APP_MESSAGE_RETRYABLE_STATUS.has(row.status)
          "
          v-perms="IN_APP_MESSAGE_PERMS.SEND"
          link
          type="warning"
          @click="retryTask(row)"
        >
          {{ t('buttons.actionRetry') }}
        </el-button>
        <!-- 撤回：SUCCESS / PARTIAL / NO_RECIPIENTS -->
        <el-button
          v-if="IN_APP_MESSAGE_RECALLABLE_STATUS.has(row.status)"
          v-perms="IN_APP_MESSAGE_PERMS.RECALL"
          link
          type="warning"
          @click="recallTask(row)"
        >
          {{ t('buttons.actionRecall') }}
        </el-button>
        <!-- 删除：仅终态（排除 PENDING / SENDING） -->
        <el-button
          v-if="IN_APP_MESSAGE_DELETABLE_STATUS.has(row.status)"
          v-perms="IN_APP_MESSAGE_PERMS.DELETE"
          link
          type="danger"
          @click="deleteBatchRows([row.id])"
        >
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

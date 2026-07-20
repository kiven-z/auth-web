<script lang="ts" setup>
import { type ChannelDeliveryPageQuery, getChannelDeliveryPage } from '@/api/message/channel-delivery';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import {
  SEND_RECORD_CHANNEL_FILTER_OPTIONS,
  SEND_RECORD_STATUS_ITEMS,
} from '@/views/message/send-record/constants/delivery-enums';
import { SEND_RECORD_PERMS } from '@/views/message/send-record/constants/permissions';
import useSendRecordTableAction from '@/views/message/send-record/hooks/useSendRecordTableAction';
import useSendRecordTableColumns from '@/views/message/send-record/hooks/useSendRecordTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageSendRecord',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useSendRecordTableColumns();
const searchFormRef = ref<FormInstance>();

const sendRecordState = usePaginationState({
  fetchApi: getChannelDeliveryPage,
  searchForm: reactive<ChannelDeliveryPageQuery>({
    taskId: undefined,
    channel: undefined,
    status: undefined,
  }),
});
const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = sendRecordState;

const { openDetailDialog, deleteBatchRows } = useSendRecordTableAction({
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
      <!-- 任务/批次 ID -->
      <el-form-item :label="t('sendRecord.field.taskId')" prop="taskId">
        <el-input
          v-model="searchForm.taskId"
          :placeholder="ph.input('sendRecord.field.taskId')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 消息渠道 -->
      <el-form-item :label="t('sendRecord.field.channel')" prop="channel">
        <el-select
          v-model="searchForm.channel"
          :placeholder="ph.selectFilter('sendRecord.field.channel')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in SEND_RECORD_CHANNEL_FILTER_OPTIONS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 投递状态 -->
      <el-form-item :label="t('sendRecord.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('sendRecord.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in SEND_RECORD_STATUS_ITEMS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SEND_RECORD_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SEND_RECORD_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="sendRecordState"
      :title="t('sendRecord.title.table')"
      show-overflow-tooltip
    >
      <template #buttons>
        <Perms :value="SEND_RECORD_PERMS.DELETE">
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
        <el-button v-perms="SEND_RECORD_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="SEND_RECORD_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

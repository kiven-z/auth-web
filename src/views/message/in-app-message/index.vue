<script lang="ts" setup>
import { getInAppSendTaskPage, type InAppSendTaskPageQuery } from '@/api/message/in-app-message';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { IN_APP_MESSAGE_PERMS } from '@/views/message/in-app-message/constants/permissions';
import {
  IN_APP_MESSAGE_DELIVERY_OPTIONS,
  IN_APP_MESSAGE_SCOPE_OPTIONS,
  IN_APP_MESSAGE_SOURCE_OPTIONS,
  IN_APP_MESSAGE_STATUS_ITEMS,
} from '@/views/message/in-app-message/constants/task-enums';
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
const { loading, searchForm, fetchTableData, resetQuery } = inAppMessageState;

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
    />
  </div>
</template>

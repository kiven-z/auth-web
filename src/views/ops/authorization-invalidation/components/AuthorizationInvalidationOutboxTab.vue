<script lang="ts" setup>
import { getAuthorizationInvalidationOutboxPage } from '@/api/ops/authorization-invalidation-outbox';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import {
  AUTHORIZATION_CHANGE_KINDS,
  OUTBOX_STATUSES,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import useAuthorizationInvalidationOutboxTableAction from '@/views/ops/authorization-invalidation/hooks/useAuthorizationInvalidationOutboxTableAction';
import useAuthorizationInvalidationOutboxTableColumns from '@/views/ops/authorization-invalidation/hooks/useAuthorizationInvalidationOutboxTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationOutboxTab',
});

const { t } = useI18n();
const { columns } = useAuthorizationInvalidationOutboxTableColumns();
const searchFormRef = ref<FormInstance>();

const outboxState = usePaginationState({
  fetchApi: getAuthorizationInvalidationOutboxPage,
  searchForm: reactive({
    eventId: undefined as string | undefined,
    changeKind: undefined as string | undefined,
    status: undefined as string | undefined,
    sourceModule: undefined as string | undefined,
    sourceBizId: undefined as string | undefined,
    createTimeStart: undefined as string | undefined,
    createTimeEnd: undefined as string | undefined,
    processedAtStart: undefined as string | undefined,
    processedAtEnd: undefined as string | undefined,
  }),
  errorI18nKey: 'authorizationInvalidation.outboxLoadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = outboxState;

const { openDetailDialog } = useAuthorizationInvalidationOutboxTableAction();

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <el-form-item :label="t('authorizationInvalidation.eventId')" prop="eventId">
        <el-input
          v-model="searchForm.eventId"
          :placeholder="t('authorizationInvalidation.placeholder.eventId')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.changeKind')" prop="changeKind">
        <el-select
          v-model="searchForm.changeKind"
          :placeholder="t('authorizationInvalidation.placeholder.changeKind')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="kind in AUTHORIZATION_CHANGE_KINDS"
            :key="kind"
            :label="t(`authorizationInvalidation.changeKindEnum.${kind}`)"
            :value="kind"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.outboxStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="t('authorizationInvalidation.placeholder.outboxStatus')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="status in OUTBOX_STATUSES"
            :key="status"
            :label="t(`authorizationInvalidation.outboxStatusEnum.${status}`)"
            :value="status"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.sourceModule')" prop="sourceModule">
        <el-input
          v-model="searchForm.sourceModule"
          :placeholder="t('authorizationInvalidation.placeholder.sourceModule')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.sourceBizId')" prop="sourceBizId">
        <el-input
          v-model="searchForm.sourceBizId"
          :placeholder="t('authorizationInvalidation.placeholder.sourceBizId')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('table.createTime')" prop="createTime">
        <el-date-picker
          v-model="searchForm.createTimeStart"
          :placeholder="t('authorizationInvalidation.createTimeStart')"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.createTimeEnd"
          :placeholder="t('authorizationInvalidation.createTimeEnd')"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.processedAt')" prop="processedAt">
        <el-date-picker
          v-model="searchForm.processedAtStart"
          :placeholder="t('authorizationInvalidation.processedAtStart')"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.processedAtEnd"
          :placeholder="t('authorizationInvalidation.processedAtEnd')"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="outboxState"
      :title="t('authorizationInvalidation.outboxTableTitle')"
      show-overflow-tooltip
    >
      <template #actions="{ row }">
        <div class="flex justify-center">
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

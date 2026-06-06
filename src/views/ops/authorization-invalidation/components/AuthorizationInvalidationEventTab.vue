<script lang="ts" setup>
import { getAuthorizationInvalidationEventPage } from '@/api/ops/authorization-invalidation-event';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { hasAuth } from '@/auth/permission';
import {
  AUTHORIZATION_CHANGE_KINDS,
  PROCESSING_FILTER_OPTIONS,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import useAuthorizationInvalidationEventTableAction from '@/views/ops/authorization-invalidation/hooks/useAuthorizationInvalidationEventTableAction';
import useAuthorizationInvalidationEventTableColumns from '@/views/ops/authorization-invalidation/hooks/useAuthorizationInvalidationEventTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationEventTab',
});

const { t } = useI18n();
const { columns } = useAuthorizationInvalidationEventTableColumns();
const searchFormRef = ref<FormInstance>();

const eventState = usePaginationState({
  fetchApi: getAuthorizationInvalidationEventPage,
  searchForm: reactive({
    eventId: undefined as string | undefined,
    changeKind: undefined as string | undefined,
    processing: undefined as boolean | undefined,
    processedAtStart: undefined as string | undefined,
    processedAtEnd: undefined as string | undefined,
  }),
  errorI18nKey: 'authorizationInvalidation.loadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = eventState;

const { openDetailDialog, releaseClaimRow } = useAuthorizationInvalidationEventTableAction({
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

      <el-form-item :label="t('authorizationInvalidation.processing')" prop="processing">
        <el-select
          v-model="searchForm.processing"
          :placeholder="t('authorizationInvalidation.placeholder.processing')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in PROCESSING_FILTER_OPTIONS"
            :key="String(option)"
            :label="t(`authorizationInvalidation.processingEnum.${String(option)}`)"
            :value="option"
          />
        </el-select>
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
      :state="eventState"
      :title="t('authorizationInvalidation.tableTitle')"
      show-overflow-tooltip
    >
      <template #actions="{ row }">
        <div class="flex justify-center gap-1">
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <el-button
            v-if="hasAuth('sysAuthInvalidationEvent:releaseClaim') && row.processing"
            link
            type="warning"
            @click="releaseClaimRow(row)"
          >
            {{ t('authorizationInvalidation.releaseClaimAction') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

<script lang="ts" setup>
import { getAuthorizationInvalidationEventPage } from '@/api/ops/authorization-invalidation-event';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import {
  AUTHORIZATION_CHANGE_KIND_ITEMS,
  PROCESSING_FILTER_ITEMS,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { SYS_AUTH_INVALIDATION_EVENT_PERMS } from '@/views/ops/authorization-invalidation/constants/permissions';
import useAuthorizationInvalidationEventTableAction from '@/views/ops/authorization-invalidation/hooks/actions/useAuthorizationInvalidationEventTableAction';
import useAuthorizationInvalidationEventTableColumns from '@/views/ops/authorization-invalidation/hooks/columns/useAuthorizationInvalidationEventTableColumns';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationEventTab',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useAuthorizationInvalidationEventTableColumns();
const searchFormRef = ref<FormInstance>();

const eventState = usePaginationState({
  fetchApi: getAuthorizationInvalidationEventPage,
  searchForm: reactive({
    eventId: undefined,
    changeKind: undefined,
    processing: undefined,
    processedAtStart: undefined,
    processedAtEnd: undefined,
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
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <el-form-item :label="t('authorizationInvalidation.eventId')" prop="eventId">
        <el-input
          v-model="searchForm.eventId"
          :placeholder="ph.prefix('authorizationInvalidation.eventId')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.changeKind')" prop="changeKind">
        <el-select
          v-model="searchForm.changeKind"
          :placeholder="ph.selectFilter('authorizationInvalidation.changeKind')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in AUTHORIZATION_CHANGE_KIND_ITEMS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.processing')" prop="processing">
        <el-select
          v-model="searchForm.processing"
          :placeholder="ph.selectFilter('authorizationInvalidation.processing')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in PROCESSING_FILTER_ITEMS"
            :key="String(option.value)"
            :label="t(option.labelKey)"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.processedAt')" prop="processedAt">
        <el-date-picker
          v-model="searchForm.processedAtStart"
          :placeholder="ph.rangeStart()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.processedAtEnd"
          :placeholder="ph.rangeEnd()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button
            v-perms="SYS_AUTH_INVALIDATION_EVENT_PERMS.QUERY"
            :loading="loading"
            type="primary"
            @click="fetchTableData"
          >
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_AUTH_INVALIDATION_EVENT_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
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
          <el-button
            v-perms="SYS_AUTH_INVALIDATION_EVENT_PERMS.DETAIL"
            link
            type="primary"
            @click="openDetailDialog(row)"
          >
            {{ t('buttons.actionView') }}
          </el-button>
          <el-button
            v-if="row.processing"
            v-perms="SYS_AUTH_INVALIDATION_EVENT_PERMS.RELEASE_CLAIM"
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

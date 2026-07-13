<script lang="ts" setup>
import { getAuthorizationInvalidationOutboxPage } from '@/api/ops/authorization-invalidation-outbox';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import {
  AUTHORIZATION_CHANGE_KIND_ITEMS,
  isOutboxRetryable,
  OUTBOX_STATUS_ITEMS,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/views/ops/authorization-invalidation/constants/permissions';
import useAuthorizationInvalidationOutboxTableAction from '@/views/ops/authorization-invalidation/hooks/actions/useAuthorizationInvalidationOutboxTableAction';
import useAuthorizationInvalidationOutboxTableColumns from '@/views/ops/authorization-invalidation/hooks/columns/useAuthorizationInvalidationOutboxTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationOutboxTab',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useAuthorizationInvalidationOutboxTableColumns();
const searchFormRef = ref<FormInstance>();

const outboxState = usePaginationState({
  fetchApi: getAuthorizationInvalidationOutboxPage,
  searchForm: reactive({
    eventId: undefined,
    changeKind: undefined,
    status: undefined,
    sourceModule: undefined,
    sourceBizId: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
    processedAtStart: undefined,
    processedAtEnd: undefined,
  }),
  errorI18nKey: 'authorizationInvalidation.outboxLoadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = outboxState;

const { openDetailDialog, retryOutboxRow } = useAuthorizationInvalidationOutboxTableAction({ fetchTableData });

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(7);

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

      <el-form-item :label="t('authorizationInvalidation.outboxStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('authorizationInvalidation.outboxStatus')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in OUTBOX_STATUS_ITEMS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.sourceModule')" prop="sourceModule">
        <el-input
          v-model="searchForm.sourceModule"
          :placeholder="ph.input('authorizationInvalidation.sourceModule')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('authorizationInvalidation.sourceBizId')" prop="sourceBizId">
          <el-input
            v-model="searchForm.sourceBizId"
            :placeholder="ph.prefix('authorizationInvalidation.sourceBizId')"
            class="w-45!"
            clearable
          />
        </el-form-item>

        <el-form-item v-show="searchExpanded" :label="t('table.createTime')" prop="createTime">
          <el-date-picker
            v-model="searchForm.createTimeStart"
            :placeholder="ph.rangeStart()"
            class="w-40!"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
          <span class="mx-2">-</span>
          <el-date-picker
            v-model="searchForm.createTimeEnd"
            :placeholder="ph.rangeEnd()"
            class="w-40!"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>

        <el-form-item v-show="searchExpanded" :label="t('authorizationInvalidation.processedAt')" prop="processedAt">
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
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button
            v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY"
            :loading="loading"
            type="primary"
            @click="fetchTableData"
          >
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <!-- 高级搜索 -->
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="outboxState"
      :title="t('authorizationInvalidation.outboxTableTitle')"
      show-overflow-tooltip
    >
      <template #actions="{ row }">
        <el-button
          v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.DETAIL"
          link
          type="primary"
          @click="openDetailDialog(row)"
        >
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-if="isOutboxRetryable(row.status)"
          v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.RETRY"
          link
          type="warning"
          @click="retryOutboxRow(row)"
        >
          {{ t('authorizationInvalidation.retryAction') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>

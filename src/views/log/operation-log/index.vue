<script lang="ts" setup>
import { getOperationLogPage } from '@/api/log/operation-log';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { OPERATION_TYPES, REQUEST_METHODS } from '@/views/log/operation-log/constants/operation-log-enums';
import { SYS_LOG_OPERATION_PERMS } from '@/views/log/operation-log/constants/permissions';
import useOperationLogTableAction from '@/views/log/operation-log/hooks/useOperationLogTableAction';
import useOperationLogTableColumns from '@/views/log/operation-log/hooks/useOperationLogTableColumns';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogOperationLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOperationLogTableColumns();
const searchFormRef = ref<FormInstance>();

const operationLogState = usePaginationState({
  fetchApi: getOperationLogPage,
  searchForm: reactive({
    userId: undefined,
    operationType: undefined,
    module: undefined,
    targetType: undefined,
    targetId: undefined,
    requestMethod: undefined,
  }),
  errorI18nKey: 'operationLog.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = operationLogState;

const { openDetailDialog, deleteBatchRows } = useOperationLogTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'operationLog.loadFailed',
});

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 操作用户 -->
      <el-form-item :label="t('operationLog.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('operationLog.user')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <!-- 操作类型 -->
      <el-form-item :label="t('operationLog.operationType')" prop="operationType">
        <el-select
          v-model="searchForm.operationType"
          :placeholder="ph.selectFilter('operationLog.operationType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="type in OPERATION_TYPES"
            :key="type"
            :label="t(`operationLog.operationTypeEnum.${type}`)"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <!-- 操作模块 -->
      <el-form-item :label="t('operationLog.module')" prop="module">
        <el-input v-model="searchForm.module" :placeholder="ph.input('operationLog.module')" class="w-45!" clearable />
      </el-form-item>

      <!-- 目标类型 -->
      <el-form-item :label="t('operationLog.targetType')" prop="targetType">
        <el-input
          v-model="searchForm.targetType"
          :placeholder="ph.input('operationLog.targetType')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <!-- 目标 ID -->
        <el-form-item v-show="searchExpanded" :label="t('operationLog.targetId')" prop="targetId">
          <el-input
            v-model="searchForm.targetId"
            :placeholder="ph.input('operationLog.targetId')"
            class="w-45!"
            clearable
          />
        </el-form-item>

        <!-- HTTP 方法 -->
        <el-form-item v-show="searchExpanded" :label="t('operationLog.requestMethod')" prop="requestMethod">
          <el-select
            v-model="searchForm.requestMethod"
            :placeholder="ph.selectFilter('operationLog.requestMethod')"
            class="w-45!"
            clearable
          >
            <el-option v-for="rm in REQUEST_METHODS" :key="rm" :label="rm" :value="rm" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SYS_LOG_OPERATION_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_LOG_OPERATION_PERMS.QUERY" @click="resetQuery(searchFormRef)">
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
      :state="operationLogState"
      :title="t('operationLog.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <Perms :value="SYS_LOG_OPERATION_PERMS.DELETE">
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button v-perms="SYS_LOG_OPERATION_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
            {{ t('buttons.actionView') }}
          </el-button>
          <!-- 删除 -->
          <el-button v-perms="SYS_LOG_OPERATION_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

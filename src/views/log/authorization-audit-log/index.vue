<script lang="ts" setup>
import { getAuthorizationAuditPage } from '@/api/log/authorization-audit';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { AUDIT_EVENT_TYPE_ITEMS } from '@/views/log/authorization-audit-log/constants/authorization-audit-enums';
import { SYS_LOG_AUTHORIZATION_AUDIT_PERMS } from '@/views/log/authorization-audit-log/constants/permissions';
import useAuthorizationAuditTableAction from '@/views/log/authorization-audit-log/hooks/useAuthorizationAuditTableAction';
import useAuthorizationAuditTableColumns from '@/views/log/authorization-audit-log/hooks/useAuthorizationAuditTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogAuthorizationAudit',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useAuthorizationAuditTableColumns();
const searchFormRef = ref<FormInstance>();

const auditState = usePaginationState({
  fetchApi: getAuthorizationAuditPage,
  searchForm: reactive({
    eventType: undefined,
    decisionReason: undefined,
    className: undefined,
    createUserId: undefined,
  }),
  errorI18nKey: 'authorizationAudit.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = auditState;

const { openDetailDialog, deleteBatchRows } = useAuthorizationAuditTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'authorizationAudit.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 事件类型 -->
      <el-form-item :label="t('authorizationAudit.eventType')" prop="eventType">
        <el-select
          v-model="searchForm.eventType"
          :placeholder="ph.selectFilter('authorizationAudit.eventType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in AUDIT_EVENT_TYPE_ITEMS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.decisionReason')" prop="decisionReason">
        <el-input
          v-model="searchForm.decisionReason"
          :placeholder="ph.input('authorizationAudit.decisionReason')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.className')" prop="className">
        <el-input
          v-model="searchForm.className"
          :placeholder="ph.input('authorizationAudit.className')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('table.createUsername')" prop="createUserId">
        <el-select
          v-model="searchForm.createUserId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('authorizationAudit.createUser')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button
            v-perms="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.QUERY"
            :loading="loading"
            type="primary"
            @click="fetchTableData"
          >
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="auditState"
      :title="t('authorizationAudit.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <Perms :value="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DELETE">
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
        <!-- 查看 -->
        <el-button
          v-perms="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DETAIL"
          link
          type="primary"
          @click="openDetailDialog(row)"
        >
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 删除 -->
        <el-button
          v-perms="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DELETE"
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

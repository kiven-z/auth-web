<script lang="ts" setup>
import { getPasswordHistoryPage } from '@/api/log/password-history';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { SYS_LOG_PASSWORD_HISTORY_PERMS } from '@/views/log/password-history/constants/permissions';
import usePasswordHistoryTableAction from '@/views/log/password-history/hooks/usePasswordHistoryTableAction';
import usePasswordHistoryTableColumns from '@/views/log/password-history/hooks/usePasswordHistoryTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogPasswordHistory',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = usePasswordHistoryTableColumns();
const searchFormRef = ref<FormInstance>();

const passwordHistoryState = usePaginationState({
  fetchApi: getPasswordHistoryPage,
  searchForm: reactive({
    userId: undefined,
    changeTimeStart: undefined,
    changeTimeEnd: undefined,
    changeIp: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = passwordHistoryState;

const { openDetailDialog, deleteBatchRows } = usePasswordHistoryTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <!-- 搜索表单 -->
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 用户 -->
      <el-form-item :label="t('passwordHistory.userId')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('passwordHistory.username')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- 修改时间 -->
      <el-form-item :label="t('passwordHistory.changeTime')" prop="changeTime">
        <el-date-picker
          v-model="searchForm.changeTimeStart"
          :placeholder="ph.rangeStart()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.changeTimeEnd"
          :placeholder="ph.rangeEnd()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>
      <!-- 修改IP地址 -->
      <el-form-item :label="t('passwordHistory.changeIp')" prop="changeIp">
        <el-input
          v-model="searchForm.changeIp"
          :placeholder="t('passwordHistory.placeholder.changeIp')"
          class="w-40!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button
            v-perms="SYS_LOG_PASSWORD_HISTORY_PERMS.QUERY"
            :loading="loading"
            type="primary"
            @click="fetchTableData"
          >
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_LOG_PASSWORD_HISTORY_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="passwordHistoryState"
      :title="t('passwordHistory.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <Perms :value="SYS_LOG_PASSWORD_HISTORY_PERMS.DELETE">
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
        <el-button v-perms="SYS_LOG_PASSWORD_HISTORY_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 删除 -->
        <el-button
          v-perms="SYS_LOG_PASSWORD_HISTORY_PERMS.DELETE"
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

<script lang="ts" setup>
import { getInAppInboxPage, type InAppInboxPageQuery, type InAppInboxPageRow } from '@/api/message/in-app-inbox';
import { usePaginationState } from '@/components/business/AuthPagedTable';
import { DEFAULT_PAGE_SIZES, DEFAULT_PAGINATION_LAYOUT } from '@/components/ui/AuthDataTable/src/constants';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useHomePageNavigation } from '@/shared/composables/layout/useHomePageNavigation';
import { useInAppInboxStore } from '@/store/modules/message/inAppInbox';
import HomePageToolbar from '@/views/home/_shared/components/HomePageToolbar.vue';
import InboxMessageList from '@/views/home/inbox/components/InboxMessageList.vue';
import useInboxTableAction from '@/views/home/inbox/hooks/useInboxTableAction';
import useInAppCategorySubOptions from '@/views/message/_shared/hooks/useInAppCategorySubOptions';
import type { FormInstance } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'HomeInbox',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { backWithReturn } = useHomePageNavigation();
const inboxStore = useInAppInboxStore();
const { majors, loadingMajors } = storeToRefs(inboxStore);

const { subOptions, loadingSubs, loadSubs } = useInAppCategorySubOptions(true);

const searchFormRef = ref<FormInstance>();

const {
  loading,
  tableData,
  selectedRows,
  searchForm,
  pagination,
  fetchTableData,
  resetQuery,
  handlePageCurrentChange,
  handlePageSizeChange,
} = usePaginationState<InAppInboxPageRow, InAppInboxPageQuery>({
  fetchApi: getInAppInboxPage,
  searchForm: reactive({
    majorCategoryId: undefined,
    categoryId: undefined,
    isRead: undefined,
    title: undefined,
  }),
});

const { deleteBatchRows, markReadBatchRows, markAllRead, deleteAll } = useInboxTableAction({
  fetchTableData,
  selectedRows,
});

const selectedCountOnPage = computed(
  () => tableData.value.filter((row) => selectedRows.value.includes(row.id!)).length
);
const isAllCurrentPageSelected = computed(
  () => tableData.value.length > 0 && selectedCountOnPage.value === tableData.value.length
);
const isCurrentPageIndeterminate = computed(
  () => selectedCountOnPage.value > 0 && selectedCountOnPage.value < tableData.value.length
);

/**
 * 切换大类 Tab
 * @param name Tab name
 */
async function handleMajorTabChange(name: string | number) {
  searchForm.majorCategoryId = String(name);
  searchForm.categoryId = undefined;
  selectedRows.value = [];
  subOptions.value = [];
  await fetchTableData();
}

onMounted(async () => {
  try {
    await inboxStore.refreshUnreadCount();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'inAppInbox.loadMajorsFailed' });
    return;
  }

  const firstMajorId = majors.value[0]?.majorCategoryId;
  if (!firstMajorId) {
    return;
  }
  searchForm.majorCategoryId = firstMajorId;
  await fetchTableData();
});
</script>

<template>
  <div class="inbox-page">
    <div class="inbox-page__header">
      <HomePageToolbar @back="backWithReturn('HomeInbox')" />

      <!-- 大类 Tab：数据来自未读接口 majors -->
      <el-tabs
        v-loading="loadingMajors"
        :model-value="searchForm.majorCategoryId"
        class="inbox-page__tabs"
        @tab-change="handleMajorTabChange"
      >
        <el-tab-pane v-for="major in majors" :key="major.majorCategoryId" :name="major.majorCategoryId">
          <template #label>
            <el-badge :hidden="major.unreadCount <= 0" :max="99" :value="major.unreadCount">
              <span>{{ major.majorCategoryName }}</span>
            </el-badge>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="inbox-page__body">
      <el-empty v-if="!loadingMajors && majors.length === 0" :description="t('inAppInbox.emptyMajors')" />

      <template v-else>
        <el-form ref="searchFormRef" :model="searchForm" class="inbox-page__filter" inline>
          <!-- 已读状态筛选 -->
          <el-form-item :label="t('inAppInbox.field.readStatus')" prop="isRead">
            <el-select
              v-model="searchForm.isRead"
              :placeholder="ph.selectFilter('inAppInbox.field.readStatus')"
              class="inbox-page__field"
              clearable
            >
              <el-option :label="t('inAppInbox.unread')" :value="false" />
              <el-option :label="t('inAppInbox.read')" :value="true" />
            </el-select>
          </el-form-item>

          <!-- 业务小类 -->
          <el-form-item :label="t('inAppInbox.field.categoryId')" prop="categoryId">
            <el-select
              v-model="searchForm.categoryId"
              :disabled="!searchForm.majorCategoryId"
              :loading="loadingSubs"
              :placeholder="ph.selectFilter('inAppInbox.field.categoryId')"
              class="inbox-page__field"
              clearable
              filterable
              @focus="loadSubs(searchForm.majorCategoryId!)"
            >
              <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <!-- 标题关键字 -->
          <el-form-item :label="t('inAppInbox.field.title')" prop="title">
            <el-input
              v-model="searchForm.title"
              :placeholder="ph.input('inAppInbox.field.title')"
              class="inbox-page__field"
              clearable
              @keyup.enter="fetchTableData"
            />
          </el-form-item>

          <el-form-item>
            <el-button-group>
              <el-button :loading="loading" type="primary" @click="fetchTableData">
                {{ t('buttons.actionSearch') }}
              </el-button>
              <el-button @click="resetQuery(searchFormRef)">
                {{ t('buttons.actionReset') }}
              </el-button>
            </el-button-group>
          </el-form-item>
        </el-form>

        <div class="inbox-page__toolbar">
          <el-checkbox
            :indeterminate="isCurrentPageIndeterminate"
            :model-value="isAllCurrentPageSelected"
            @change="(checked) => (selectedRows = checked ? tableData.map((row) => row.id!) : [])"
          >
            {{ t('inAppInbox.selectAll') }}
          </el-checkbox>

          <el-button :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
            {{ t('buttons.actionDelete') }}
          </el-button>
          <el-button :disabled="selectedRows.length <= 0" @click="markReadBatchRows()">
            {{ t('inAppInbox.action.markRead') }}
          </el-button>
          <el-button type="primary" @click="markAllRead">
            {{ t('inAppInbox.action.markAllRead') }}
          </el-button>
          <el-button @click="deleteAll">
            {{ t('inAppInbox.action.deleteAll') }}
          </el-button>
        </div>

        <InboxMessageList
          v-model:selected-rows="selectedRows"
          :loading="loading"
          :rows="tableData"
          @row-delete="(id) => deleteBatchRows([id])"
          @row-mark-read="(id) => markReadBatchRows([id])"
        />

        <div class="inbox-page__pagination">
          <el-pagination
            :background="true"
            :current-page="pagination.currentPage"
            :layout="DEFAULT_PAGINATION_LAYOUT"
            :page-size="pagination.pageSize"
            :page-sizes="DEFAULT_PAGE_SIZES"
            :total="pagination.total"
            @current-change="handlePageCurrentChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inbox-page {
  min-height: 100%;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
  }

  &__tabs {
    padding: 8px 50px 0;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-badge) {
      padding-right: 10px;
    }
  }

  &__body {
    padding: 16px 50px 24px;
  }

  &__filter {
    margin-bottom: 8px;
  }

  &__field {
    width: 200px;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 0 0 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>

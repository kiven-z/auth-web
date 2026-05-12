<script lang="ts" setup>
import { getPostPage } from '@/api/system/post';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import usePostTableAction from '@/views/system/post/hooks/usePostTableAction';
import usePostTableColumns from '@/views/system/post/hooks/usePostTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemPost',
});

const { t } = useI18n();

const { columns } = usePostTableColumns();

const searchFormRef = ref<FormInstance>();

// 表格实例（含 setAdaptive，供全屏后调用）
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  selectedRows,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange,
} = usePaginationState({
  fetchApi: getPostPage,
  searchForm: reactive({
    postCode: undefined as string | undefined,
    postName: undefined as string | undefined,
    deptName: undefined as string | undefined,
    status: undefined as boolean | undefined,
  }),
  errorI18nKey: 'post.loadFailed',
  selection: true,
});

const { openCreateDialog, openDetailDialog, handleDelete } = usePostTableAction({ fetchTableData });

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
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <!-- 岗位编码 -->
      <el-form-item :label="t('post.postCode')" prop="postCode">
        <el-input v-model="searchForm.postCode" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 岗位名称 -->
      <el-form-item :label="t('post.postName')" prop="postName">
        <el-input v-model="searchForm.postName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item :label="t('post.deptName')" prop="deptName">
        <el-input v-model="searchForm.deptName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('post.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('post.status')" class="w-[180px]!" clearable>
          <el-option
            v-for="opt in POST_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <!-- 搜索 -->
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <!-- 重置 -->
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('post.pageTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
          :columns="dynamicColumns"
          :data="tableData"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="loading"
          :pagination="pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          table-layout="auto"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handlePageCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center">
              <!-- 查看 -->
              <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
              <!-- 修改 -->
              <el-button link type="primary">{{ t('buttons.actionEdit') }}</el-button>
              <!-- 删除 -->
              <el-button link type="danger" @click="handleDelete(row)">{{ t('buttons.actionDelete') }}</el-button>

              <el-dropdown class="ml-1" trigger="click">
                <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
                <template #dropdown>
                  <el-dropdown-item>分配角色</el-dropdown-item>
                </template>
              </el-dropdown>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

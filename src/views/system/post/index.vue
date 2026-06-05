<script lang="ts" setup>
import { getPostPage } from '@/api/system/post';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import usePostAdvanceAction from '@/views/system/post/hooks/usePostAdvanceAction';
import usePostMoreAction from '@/views/system/post/hooks/usePostMoreAction';
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

const postState = usePaginationState({
  fetchApi: getPostPage,
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    deptName: undefined,
    status: undefined,
  }),
  errorI18nKey: 'post.loadFailed',
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = postState;

const { exporting, exportCurrentPage } = usePostAdvanceAction({ searchForm, pagination });

const tableActionDeps = { fetchTableData };

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = usePostTableAction(tableActionDeps);

const { openAssignRoleDrawer } = usePostMoreAction({
  ...tableActionDeps,
  refresh: fetchTableData,
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
      <!-- 岗位编码 -->
      <el-form-item :label="t('post.postCode')" prop="postCode">
        <el-input v-model="searchForm.postCode" class="w-45!" clearable />
      </el-form-item>
      <!-- 岗位名称 -->
      <el-form-item :label="t('post.postName')" prop="postName">
        <el-input v-model="searchForm.postName" class="w-45!" clearable />
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item :label="t('post.deptName')" prop="deptName">
        <el-input v-model="searchForm.deptName" class="w-45!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('post.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('post.status')" class="w-45!" clearable>
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

    <AuthPagedTable :columns="columns" :state="postState" :title="t('post.pageTitle')">
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item disabled>从 Excel 导入（敬请期待）</el-dropdown-item>
              <el-dropdown-item :disabled="exporting" @click="exportCurrentPage">
                {{ t('buttons.exportExcel') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 删除 -->
          <el-button link type="danger" @click="deleteRow(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>

          <el-dropdown class="ml-1" trigger="click">
            <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-item @click="openAssignRoleDrawer(row)">
                {{ t('post.assignRole') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

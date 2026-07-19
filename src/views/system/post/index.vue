<script lang="ts" setup>
import { getPostPage } from '@/api/system/post';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_POST_PERMS } from '@/views/system/post/constants/permissions';
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
const ph = useFormPlaceholder();

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
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = postState;

const { exporting, openExportDialog, openImportDialog } = usePostAdvanceAction({
  searchForm,
  pagination,
  fetchTableData,
});

const tableActionDeps = { fetchTableData };

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow } = usePostTableAction(tableActionDeps);

const { openAssignRoleDrawer } = usePostMoreAction({ fetchTableData });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 岗位编码 -->
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 岗位名称 -->
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item :label="t('post.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('post.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('post.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('post.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in POST_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SYS_POST_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_POST_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="postState" :title="t('post.page.title')">
      <template #buttons>
        <el-button-group type="primary">
          <!-- 添加 -->
          <el-button v-perms="SYS_POST_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <!-- 从 Excel 导入 -->
              <Perms :value="SYS_POST_PERMS.IMPORT">
                <el-dropdown-item @click="openImportDialog">
                  {{ t('buttons.importExcel') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_POST_PERMS.EXPORT">
                <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                  {{ t('buttons.exportExcel') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 查看 -->
        <el-button v-perms="SYS_POST_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 修改 -->
        <el-button v-perms="SYS_POST_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="SYS_POST_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
          {{ t('buttons.actionDelete') }}
        </el-button>

        <el-dropdown trigger="click">
          <el-button link type="primary" class="ml-2!">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <Perms :value="SYS_POST_PERMS.UPDATE">
              <el-dropdown-item @click="openAssignRoleDrawer(row)">
                {{ t('assign.role') }}
              </el-dropdown-item>
            </Perms>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

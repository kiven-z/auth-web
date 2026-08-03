<script lang="ts" setup>
import { getPostPage } from '@/api/system/post/post';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_POST_PERMS } from '@/views/system/post/constants/permissions';
import usePostAdvanceAction from '@/views/system/post/hooks/actions/usePostAdvanceAction';
import usePostMoreAction from '@/views/system/post/hooks/actions/usePostMoreAction';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import usePostTableAction from '@/views/system/post/hooks/actions/usePostTableAction';
import usePostTableColumns from '@/views/system/post/hooks/columns/usePostTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemPost',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();

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

const { loading, searchForm, pagination, selectedRows, fetchTableData, resetQuery } = postState;

const { exporting, openExportDialog, openImportDialog } = usePostAdvanceAction({
  searchForm,
  pagination,
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow, batchUpdateStatus } = usePostTableAction({
  fetchTableData,
});

const { openPostAuthorizationSurface, openAssignRoleDrawer } = usePostMoreAction({ fetchTableData });

const hasSelection = computed(() => selectedRows.value.length > 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('post.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('post.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="SYS_POST_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_POST_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="postState" :title="t('post.page.title')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_POST_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <Perms :value="SYS_POST_PERMS.UPDATE">
            <el-dropdown trigger="click">
              <el-button :disabled="!hasSelection" type="warning">
                {{ t('buttons.actionBatchStatus') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
                <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, false)">
                  {{ t('buttons.actionBatchDisable') }}
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </Perms>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
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
        <el-button v-perms="SYS_POST_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_POST_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_POST_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
          {{ t('buttons.actionDelete') }}
        </el-button>

        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="SYS_POST_PERMS.QUERY">
                <el-dropdown-item
                  @click="
                    openPostAuthorizationSurface({
                      postId: row.id,
                      postCode: row.postCode,
                      postName: row.postName,
                    })
                  "
                >
                  {{ t('post.menu.authorizationSurface') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_POST_PERMS.UPDATE">
                <el-dropdown-item @click="openAssignRoleDrawer(row)">
                  {{ t('assign.role') }}
                </el-dropdown-item>
              </Perms>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>

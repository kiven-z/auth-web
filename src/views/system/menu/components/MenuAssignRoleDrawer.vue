<script lang="ts" setup>
import { getRolePage } from '@/api/system/role';
import AssignManagePanel from '@/components/business/AssignManagePanel';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/components/ui/AuthPagedTable/src/usePaginationState';
import { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const panelRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);
const tableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);
const searchFormRef = ref<FormInstance>();
const { roleDrawerDataColumns } = useMenuTableColumns();

const {
  tableData,
  loading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
} = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
    roleType: 2,
  }),
  errorI18nKey: 'roles.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="leftSpan">
      <el-card shadow="never">
        <template #header>
          <div>
            <div class="font-semibold">菜单管理</div>
            <div v-if="leftSubtitle" class="text-[13px] text-(--el-text-color-secondary)">分配菜单角色</div>
          </div>
        </template>

        <div class="flex justify-between">
          <div class="text-xs font-semibold text-(--el-text-color-secondary)">分配角色</div>
          <el-button :disabled="saving || !canClearRemovable" link type="danger" @click="clearRemovable">
            {{ t('sysMenu.assignClearAll') }}
          </el-button>
        </div>

        <!-- <div v-if="assignedTags.length" class="assign-manage-panel__tags"> -->
        <!--   <el-tag -->
        <!--     v-for="tag in assignedTags" -->
        <!--     :key="tag.key" -->
        <!--     :closable="!isLocked(tag.key) && !saving" -->
        <!--     effect="light" -->
        <!--     type="success" -->
        <!--     @close="removeKey(tag.key)" -->
        <!--   > -->
        <!--     <el-tooltip :content="tag.key" :show-after="400" placement="top"> -->
        <!--       <span>{{ tag.label }}</span> -->
        <!--     </el-tooltip> -->
        <!--   </el-tag> -->
        <!-- </div> -->
        <div class="assign-manage-panel__tags flex items-center justify-center">
          <el-text type="info">
            {{ t('sysMenu.assignEmptySelected') }}
          </el-text>
        </div>
      </el-card>
    </el-col>

    <el-col :span="24">
      <div v-loading="loading" class="flex w-full flex-1 flex-col">
        <el-form
          ref="searchFormRef"
          :inline="true"
          :model="searchForm"
          class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
        >
          <!-- 角色编码 -->
          <el-form-item :label="t('roles.roleCode')" prop="roleCode">
            <el-input v-model="searchForm.roleCode" class="w-45!" clearable />
          </el-form-item>
          <!-- 角色名称 -->
          <el-form-item :label="t('roles.roleName')" prop="roleName">
            <el-input v-model="searchForm.roleName" class="w-45!" clearable />
          </el-form-item>

          <!-- 表单搜索 -->
          <el-form-item>
            <!-- 搜索 -->
            <el-button :loading="loading" type="primary" @click="fetchTableData">
              {{ t('buttons.actionSearch') }}
            </el-button>
            <!-- 重置 -->
            <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
          </el-form-item>
        </el-form>

        <TableBar
          :columns="roleDrawerDataColumns"
          :title="t('roles.pageTitle')"
          @fullscreen="tableRef?.setAdaptive()"
          @refresh="fetchTableData"
        >
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
            />
          </template>
        </TableBar>
      </div>
    </el-col>
  </el-row>
</template>

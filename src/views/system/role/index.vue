<script lang="ts" setup>
import PureTableBar from '@/components/ui/PureTableBar/src/bar';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import PureTable from '@pureadmin/table';
import '@pureadmin/table/dist/style.css';
import { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useRolePageState from './hooks/useRolePageState';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();
const tableRef = ref();

const {
  tableData,
  loading,
  pagination,
  searchForm,
  onSearch,
  onReset,
  onPageSizeChange,
  onPageCurrentChange,
  onSelectionChange,
} = useRolePageState();

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form :inline="true" class="bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto">
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.roleCode')">
        <el-input v-model="searchForm.roleCode" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.roleName')">
        <el-input v-model="searchForm.roleName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('roles.status')">
        <el-select v-model="searchForm.status" :placeholder="t('roles.status')" class="w-[140px]!" clearable>
          <el-option :label="t('roles.statusNormal')" :value="0" />
          <el-option :label="t('roles.statusDisabled')" :value="1" />
        </el-select>
      </el-form-item>
      <!-- 角色类型 -->

      <el-form-item :label="t('roles.roleType')">
        <el-select v-model="searchForm.roleType" :placeholder="t('roles.roleType')" class="w-[160px]!" clearable>
          <el-option :label="t('roles.roleTypeSystem')" :value="1" />
          <el-option :label="t('roles.roleTypeMenu')" :value="2" />
          <el-option :label="t('roles.roleTypeBusiness')" :value="3" />
          <el-option :label="t('roles.roleTypeCustom')" :value="4" />
        </el-select>
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <el-button type="primary" @click="onSearch">{{ t('roles.query') }}</el-button>
        <el-button @click="onReset(searchFormRef as FormInstance)">{{ t('roles.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :columns="columns"
      :title="t('roles.pageTitle')"
      @fullscreen="tableRef.setAdaptive()"
      @refresh="onSearch"
    >
      <template #title>
        <div class="w-full flex justify-between">
          <h3>{{ t('roles.pageTitle') }}</h3>

          <div class="mx-1">
            <el-button type="primary">新增</el-button>
            <el-button type="danger">批量删除</el-button>
          </div>
        </div>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
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
          @page-size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
          @page-current-change="onPageCurrentChange"
        >
          <template #actions>
            <div class="flex justify-center">
              <el-button link type="primary">{{ t('roles.actionEdit') }}</el-button>
              <el-button link type="primary">修改</el-button>
              <el-button link type="danger">{{ t('roles.actionDelete') }}</el-button>

              <el-dropdown class="ml-1">
                <el-button class="el-dropdown-link" link type="primary">更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>{{ t('roles.actionAssignPermission') }}</el-dropdown-item>
                    <el-dropdown-item>数据范围配置</el-dropdown-item>
                    <el-dropdown-item>策略绑定</el-dropdown-item>
                    <el-dropdown-item>授权对象管理（反向）</el-dropdown-item>
                    <el-dropdown-item>影响分析与刷新</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

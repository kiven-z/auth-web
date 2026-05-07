<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import useJobGroupPageState from '@/views/schedule/schedule-group/hooks/useJobGroupPageState';
import useJobGroupTableAction from '@/views/schedule/schedule-group/hooks/useJobGroupTableAction';
import useJobGroupTableColumns from '@/views/schedule/schedule-group/hooks/useJobGroupTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleJobGroup',
});

const { t } = useI18n();
const { columns } = useJobGroupTableColumns();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  searchForm,
  onSearch,
  onQuery,
  onReset,
  onPageSizeChange,
  onPageCurrentChange,
} = useJobGroupPageState();
const { openAdd, openEdit, openDetail, removeOne } = useJobGroupTableAction({ onSearch });

onMounted(() => {
  onSearch();
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
      <!-- 分组编码 -->
      <el-form-item :label="t('scheduleGroup.code')" prop="groupCode">
        <el-input v-model="searchForm.groupCode" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 分组名称 -->
      <el-form-item :label="t('scheduleGroup.name')" prop="groupName">
        <el-input v-model="searchForm.groupName" class="w-[180px]!" clearable />
      </el-form-item>
      <!-- 分组状态 -->
      <el-form-item :label="t('scheduleGroup.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('scheduleGroup.status')" class="w-[140px]!" clearable>
          <el-option :label="t('scheduleGroup.statusEnabled')" :value="1" />
          <el-option :label="t('scheduleGroup.statusDisabled')" :value="0" />
        </el-select>
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <!-- 搜索 -->
        <el-button type="primary" @click="onQuery">{{ t('buttons.actionSearch') }}</el-button>
        <!-- 重置 -->
        <el-button @click="onReset(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('scheduleGroup.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 添加 -->
        <el-button type="primary" @click="openAdd">{{ t('buttons.actionAdd') }}</el-button>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
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
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @page-current-change="onPageCurrentChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center">
              <!-- 查看 -->
              <el-button link type="primary" @click="openDetail(row)">{{ t('buttons.actionView') }}</el-button>
              <!-- 修改/编辑 -->
              <el-button link type="primary" @click="openEdit(row)">{{ t('buttons.actionEdit') }}</el-button>
              <!-- 删除 -->
              <el-button :disabled="row.isSystem === 1" link type="danger" @click="removeOne(row)">
                {{ t('buttons.actionDelete') }}
              </el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

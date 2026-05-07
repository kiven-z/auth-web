<script lang="ts" setup>
import { columns } from './config/job-group-columns';
import { ButtonIcons } from '@/constant/iconEnums';
import { transformI18n } from '@/plugins/i18n';
import { useJobGroupStoreHook } from '@/store/modules/schedule/jobGroup';
import PureTable from '@pureadmin/table';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import { useScheduleGroupHook } from '@/views/schedule/schedule-group/hooks/use-schedult-group';

const { t } = useI18n();
const store = useJobGroupStoreHook();
const tableRef = ref();
const formRef = ref<FormInstance>();

const { onSearch, openAdd, openEdit, openDetail, removeOne } = useScheduleGroupHook();

/**
 * 重置搜索表单
 * @param el 搜索表单实例
 */
const resetForm = async (el?: FormInstance) => {
  el?.resetFields();
  await onSearch();
};

/**
 * 分页切换
 * @param p 当前页码
 */
const onPage = async (p: number) => {
  store.pagination.currentPage = p;
  await onSearch();
};

/**
 * 每页条数切换
 * @param s 每页条数
 */
const onSize = async (s: number) => {
  store.pagination.pageSize = s;
  await onSearch();
};

onMounted(() => onSearch());
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="store.form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <!-- 分组编码 -->
      <el-form-item :label="transformI18n('schedule.group.code')" prop="groupCode">
        <el-input v-model="store.form.groupCode" class="!w-[200px]" clearable />
      </el-form-item>

      <!-- 分组名称 -->
      <el-form-item :label="transformI18n('schedule.group.name')" prop="groupName">
        <el-input v-model="store.form.groupName" class="!w-[200px]" clearable />
      </el-form-item>

      <!-- 分组状态 -->
      <el-form-item :label="transformI18n('schedule.group.status')" prop="status">
        <el-select v-model="store.form.status" class="!w-[160px]" clearable>
          <el-option :label="transformI18n('schedule.status.enabled')" :value="1" />
          <el-option :label="transformI18n('schedule.status.disabled')" :value="0" />
        </el-select>
      </el-form-item>

      <!-- 搜索按钮 -->
      <el-form-item>
        <!-- 搜索按钮 -->
        <el-button :icon="useRenderIcon(ButtonIcons.SEARCH)" :loading="store.loading" type="primary" @click="onSearch">
          {{ t('common.buttons.search') }}
        </el-button>
        <!-- 重置按钮 -->
        <el-button :icon="useRenderIcon(ButtonIcons.RESET)" @click="resetForm(formRef)">
          {{ t('common.buttons.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :columns="columns"
      :title="transformI18n('schedule.group.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button :icon="useRenderIcon(ButtonIcons.ADD)" type="primary" @click="openAdd">
          {{ t('common.buttons.addText') }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="store.datalist"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="store.loading"
          :pagination="store.pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-current-change="onPage"
          @page-size-change="onSize"
        >
          <template #operation="{ row }">
            <!-- 查看按钮 -->
            <el-button
              :icon="useRenderIcon(ButtonIcons.VIEW)"
              :size="size"
              link
              type="primary"
              @click="openDetail(row)"
            >
              {{ t('common.buttons.viewText') }}
            </el-button>
            <!-- 编辑按钮 -->
            <el-button :icon="useRenderIcon(ButtonIcons.EDIT)" :size="size" link type="primary" @click="openEdit(row)">
              {{ t('common.buttons.editText') }}
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              :disabled="row.isSystem === 1"
              :icon="useRenderIcon(ButtonIcons.DELETE)"
              :size="size"
              link
              type="danger"
              @click="removeOne(row)"
            >
              {{ t('common.buttons.delete') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

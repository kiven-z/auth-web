<script lang="ts" setup>
import PagedTable from '@/components/table/PagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import DeptHeadButtons from '@/views/system/dept/components/DeptHeadButtons.vue';
import useDeptTableColumns from '@/views/system/dept/hooks/columns/useDeptTableColumns';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTableView',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const searchFormRef = ref<FormInstance>();

const { tableColumns } = useDeptTableColumns();
const deptState = useDeptPageState();
const { loading, searchForm, fetchTableData, resetQuery } = deptState;

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
      <el-form-item :label="t('dept.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('dept.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
        <el-input
          v-model="searchForm.deptCode"
          :placeholder="ph.input('dept.field.deptCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('dept.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('dept.field.status')"
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
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="tableColumns" :state="deptState" :title="t('dept.page.title')" show-overflow-tooltip>
      <template #buttons>
        <DeptHeadButtons />
      </template>

      <template #actions="{ row }">
        <DeptRowActions :row="row" />
      </template>
    </PagedTable>
  </div>
</template>

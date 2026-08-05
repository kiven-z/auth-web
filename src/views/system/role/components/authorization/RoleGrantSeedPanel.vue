<script lang="ts" setup>
import type { RoleGrantSubjectPageQuery } from '@/api/system/role/role-authorization';
import type { GrantSubjectItem } from '@/api/system/role/role-grant-subjects';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleGrantSeedPanel' });

/** 搜索表单不含 subjectType（由父组件闭包注入） */
type GrantSeedSearchQuery = Omit<RoleGrantSubjectPageQuery, 'subjectType'>;

/** 角色授权对象种子分页面板 */
type RoleGrantSeedPanelProps = AuthorizationSurfacePanelProps<GrantSubjectItem, GrantSeedSearchQuery>;

const props = defineProps<RoleGrantSeedPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const searchFormRef = ref<FormInstance>();

const grantSubjectColumns = computed<TableColumnList>(() => [
  {
    label: t('roles.authorizationSurface.subjectLabel'),
    prop: 'label',
    minWidth: 220,
    showOverflowTooltip: true,
  },
  {
    label: t('roles.authorizationSurface.subjectId'),
    prop: 'id',
    minWidth: 180,
    showOverflowTooltip: true,
  },
]);

const subjectState = usePaginationState<GrantSubjectItem, GrantSeedSearchQuery>({
  searchForm: reactive({
    keyword: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = subjectState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="role-grant-seed-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('roles.authorizationSurface.keyword')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="ph.input('roles.authorizationSurface.keyword')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('roles.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in booleanStatusOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button v-perms="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="queryPerm" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="grantSubjectColumns" :state="subjectState" :title="title" show-overflow-tooltip />
  </div>
</template>

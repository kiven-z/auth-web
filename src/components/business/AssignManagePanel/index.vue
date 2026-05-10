<script lang="tsx" setup>
import type { AuthDataTablePagination } from '@/components/ui/AuthDataTable';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { useDebounceFn } from '@vueuse/core';
import { ElCheckbox, ElTag, ElTooltip } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AssignManageFetchAll, AssignManageFetchPage, AssignManageSeedItem } from './types';

defineOptions({ name: 'AssignManagePanel' });

const props = withDefaults(
  defineProps<{
    /** page：服务端分页；all：一次拉全量后本地筛选 */
    mode: AssignManageMode;
    leftTitle: string;
    leftSubtitle?: string;
    /** 左侧「已分配」小标题；默认走 i18n sysMenu.assigned */
    assignedSectionLabel?: string;
    searchPlaceholder?: string;
    /** 数据列（不含「是否分配」勾选列，由本组件追加） */
    columns: TableColumnList;
    rowKey: string;
    /** 外层附加 loading（与内部请求合并） */
    loading?: boolean;
    saving?: boolean;
    /** 初始化已选与标签文案（如菜单已分配角色） */
    assignedSeed?: AssignManageSeedItem[];
    fetchPage?: AssignManageFetchPage;
    fetchAllRows?: AssignManageFetchAll;
    initialPageSize?: number;
    /** 标签与行展示名；缺省依次尝试 roleName、permissionName、name、rowKey */
    getRowLabel?: (row: any) => string;
    /** 候选表格 max-height，传给 ElTable */
    candidateTableMaxHeight?: string | number;
  }>(),
  {
    initialPageSize: 30,
    candidateTableMaxHeight: '55vh',
    assignedSectionLabel: '',
  }
);

const { t } = useI18n();

const keyword = ref('');
const internalLoading = ref(false);
const tableData = ref<any[]>([]);
const pagination = reactive<AuthDataTablePagination>({
  total: 0,
  pageSize: props.initialPageSize,
  currentPage: 1,
});

const selectedKeys = ref<string[]>([]);
const keyLabels = ref<Record<string, string>>({});
const nonRemovableKeys = ref<Set<string>>(new Set());

const combinedLoading = computed(() => props.loading || internalLoading.value);

function getKey(row: any): string {
  return String(row?.[props.rowKey] ?? '');
}

function defaultLabel(row: any): string {
  if (props.getRowLabel) {
    return props.getRowLabel(row);
  }
  return row?.roleName ?? row?.permissionName ?? row?.name ?? getKey(row);
}

function applyAssignedSeed() {
  const nr = new Set<string>();
  const seed = props.assignedSeed;
  if (!seed?.length) {
    nonRemovableKeys.value = nr;
    selectedKeys.value = [];
    return;
  }
  selectedKeys.value = seed.map((s) => s.key);
  const nextLabels = { ...keyLabels.value };
  for (const s of seed) {
    nextLabels[s.key] = s.label;
    if (s.removable === false) {
      nr.add(s.key);
    }
  }
  keyLabels.value = nextLabels;
  nonRemovableKeys.value = nr;
}

watch(
  () => props.assignedSeed,
  () => applyAssignedSeed(),
  { deep: true, immediate: true }
);

function isRowSelected(row: any): boolean {
  return selectedKeys.value.includes(getKey(row));
}

function rememberRowLabel(row: any) {
  const k = getKey(row);
  if (!k) {
    return;
  }
  keyLabels.value = { ...keyLabels.value, [k]: defaultLabel(row) };
}

function toggleRow(row: any) {
  if (props.saving) {
    return;
  }
  const key = getKey(row);
  if (!key || nonRemovableKeys.value.has(key)) {
    return;
  }
  rememberRowLabel(row);
  const idx = selectedKeys.value.indexOf(key);
  if (idx >= 0) {
    selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
  } else {
    selectedKeys.value = [...selectedKeys.value, key];
  }
}

const columnsWithAssign = computed<TableColumnList>(() => [
  ...props.columns,
  {
    label: t('sysMenu.assigned'),
    prop: '__assign',
    align: 'center' as const,
    width: 100,
    formatter: (row: any) => (
      <ElCheckbox
        modelValue={isRowSelected(row)}
        disabled={props.saving || nonRemovableKeys.value.has(getKey(row))}
        onChange={() => toggleRow(row)}
      />
    ),
  },
]);

const assignedTags = computed(() =>
  selectedKeys.value.map((k) => ({
    key: k,
    label: keyLabels.value[k] ?? k,
    closable: !nonRemovableKeys.value.has(k),
  }))
);

function onTagClose(key: string) {
  if (props.saving || nonRemovableKeys.value.has(key)) {
    return;
  }
  selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
}

const loadPage = async () => {
  if (props.mode !== 'page' || !props.fetchPage) {
    return;
  }
  internalLoading.value = true;
  try {
    const page = await props.fetchPage({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: keyword.value.trim(),
    });
    const list = page.list ?? [];
    tableData.value = list;
    pagination.total = page.total;
    pagination.currentPage = page.pageNo;
    pagination.pageSize = page.pageSize;
    for (const row of list) {
      rememberRowLabel(row);
    }
  } finally {
    internalLoading.value = false;
  }
};

const debouncedReloadPage = useDebounceFn(() => {
  pagination.currentPage = 1;
  void loadPage();
}, 300);

watch(keyword, () => {
  if (props.mode === 'page') {
    debouncedReloadPage();
  }
});

const handlePageSizeChange = async (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  await loadPage();
};

async function handlePageCurrentChange(page: number) {
  pagination.currentPage = page;
  await loadPage();
}

const filteredAllRows = computed(() => {
  if (props.mode !== 'all') {
    return tableData.value;
  }
  const k = keyword.value.trim().toLowerCase();
  if (!k) {
    return tableData.value;
  }
  return tableData.value.filter((row) => {
    const key = getKey(row).toLowerCase();
    const label = defaultLabel(row).toLowerCase();
    return key.includes(k) || label.includes(k);
  });
});

async function loadAll() {
  if (props.mode !== 'all' || !props.fetchAllRows) {
    return;
  }
  internalLoading.value = true;
  try {
    const rows = await props.fetchAllRows();
    tableData.value = rows ?? [];
    for (const row of tableData.value) {
      rememberRowLabel(row);
    }
    const fromApi = tableData.value.filter((r) => r.assigned === true).map((r) => getKey(r));
    selectedKeys.value = [...fromApi];
  } finally {
    internalLoading.value = false;
  }
}

onMounted(() => {
  if (props.mode === 'page') {
    void loadPage();
  } else {
    void loadAll();
  }
});

const tableRows = computed(() => (props.mode === 'page' ? tableData.value : filteredAllRows.value));

function getSelectedKeys(): string[] {
  return [...selectedKeys.value];
}

defineExpose({ getSelectedKeys });
</script>

<template>
  <div class="assign-manage-panel flex h-full min-h-0 flex-1 flex-col gap-3 md:flex-row md:pb-2">
    <div
      class="flex min-h-0 w-full shrink-0 flex-col rounded border border-(--el-border-color) p-3 md:w-56 md:max-w-[260px]"
    >
      <div class="text-sm font-semibold">{{ leftTitle }}</div>
      <div v-if="leftSubtitle" class="mt-2 text-sm wrap-break-word">{{ leftSubtitle }}</div>
      <div class="mt-2 shrink-0 text-xs text-(--el-text-color-secondary)">{{ assignedSectionLabel }}</div>
      <div class="mt-1 grid min-h-48 flex-1 grid-cols-2 gap-1 content-start overflow-y-auto md:min-h-0">
        <template v-if="assignedTags.length">
          <el-tag
            v-for="tag in assignedTags"
            :key="tag.key"
            :closable="tag.closable && !saving"
            class="mr-0! justify-center"
            effect="plain"
            type="success"
            @close="onTagClose(tag.key)"
          >
            <el-tooltip :content="tag.key" placement="top">
              <span class="block max-w-full truncate">{{ tag.label }}</span>
            </el-tooltip>
          </el-tag>
        </template>
        <div v-else class="col-span-2 py-2 text-xs text-(--el-text-color-placeholder)">
          {{ t('sysMenu.assignEmptySelected') }}
        </div>
      </div>
    </div>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <el-input v-model="keyword" :placeholder="searchPlaceholder" class="mb-2 shrink-0" clearable />
      <AuthDataTable
        :columns="columnsWithAssign"
        :data="tableRows"
        :loading="combinedLoading"
        :max-height="candidateTableMaxHeight"
        :pagination="mode === 'page' ? pagination : null"
        :row-key="rowKey"
        border
        @page-current-change="handlePageCurrentChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

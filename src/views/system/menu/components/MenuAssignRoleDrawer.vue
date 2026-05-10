<script lang="tsx" setup>
import { getMenuRoles, putMenuRoles } from '@/api/system/menu';
import { getRolePage } from '@/api/system/role';
import { errorMessage, message } from '@/shared/messaging/message';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { transformI18n } from '@/plugins/i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const loading = ref(false);
const saving = ref(false);
const keyword = ref('');

const { roleDrawerColumns } = useMenuTableColumns();

type Row = { roleCode: string; roleName: string; assigned: boolean };
const rows = ref<Row[]>([]);

/**
 * 过滤数据
 */
const filteredRows = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) {
    return rows.value;
  }
  return rows.value.filter((r) => r.roleCode.toLowerCase().includes(k) || r.roleName.toLowerCase().includes(k));
});

/**
 * 加载数据
 */
const loadData = async () => {
  loading.value = true;
  try {
    const assignedList = await getMenuRoles(props.menuId);
    const assignedCodes = new Set(assignedList.filter((r) => r.assigned).map((r) => r.roleCode));
    const page = await getRolePage({ pageIndex: 1, pageSize: 500 });
    const list = page.list ?? [];
    rows.value = list.map((r) => ({
      roleCode: r.roleCode,
      roleName: r.roleName,
      assigned: assignedCodes.has(r.roleCode),
    }));
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
  } finally {
    loading.value = false;
  }
};

/**
 * 保存分配
 */
const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const roleCodes = rows.value.filter((r) => r.assigned).map((r) => r.roleCode);
    await putMenuRoles(props.menuId, { roleCodes });
    message(t('sysMenu.assignSaveSuccess'), { type: 'success' });
    return true;
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignSaveFailed' });
    return false;
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  void loadData();
});

defineExpose({ saveData });
</script>

<template>
  <div v-loading="loading" class="flex flex-col gap-4 md:flex-row">
    <div class="md:w-56 shrink-0 rounded border border-(--el-border-color) p-3">
      <div class="text-sm font-semibold">{{ t('sysMenu.assignCurrentMenu') }}</div>
      <div class="mt-2 text-sm">{{ transformI18n(menuTitle) }}</div>
      <div class="text-xs text-(--el-text-color-secondary)">{{ menuName }}</div>
    </div>
    <div class="min-w-0 flex-1">
      <el-input v-model="keyword" :placeholder="t('sysMenu.assignRoleSearch')" class="mb-2" clearable />
      <AuthDataTable :columns="roleDrawerColumns" :data="filteredRows" border max-height="420" row-key="roleCode" />
    </div>
  </div>
</template>

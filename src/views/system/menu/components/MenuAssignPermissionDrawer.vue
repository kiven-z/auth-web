<script lang="ts" setup>
import { getMenuPermissions, putMenuPermissions } from '@/api/system/menu';
import { errorMessage, message } from '@/shared/messaging/message';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';
import { transformI18n } from '@/plugins/i18n';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const loading = ref(false);
const saving = ref(false);
const keyword = ref('');

type Row = { permissionCode: string; permissionName: string; assigned: boolean };
const rows = ref<Row[]>([]);

const { permissionDrawerColumns } = useMenuTableColumns();

const filteredRows = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) {
    return rows.value;
  }
  return rows.value.filter(
    (r) => r.permissionCode.toLowerCase().includes(k) || r.permissionName.toLowerCase().includes(k)
  );
});

const loadData = async () => {
  loading.value = true;
  try {
    rows.value = await getMenuPermissions(props.menuId);
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
  } finally {
    loading.value = false;
  }
};

const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const permissionCodes = rows.value.filter((r) => r.assigned).map((r) => r.permissionCode);
    await putMenuPermissions(props.menuId, { permissionCodes });
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
  <div v-loading="loading">
    <div class="md:w-56 shrink-0 rounded border border-(--el-border-color) p-3">
      <div class="text-sm font-semibold">{{ t('sysMenu.assignCurrentMenu') }}</div>
      <div class="mt-2 text-sm">{{ transformI18n(props.menuTitle) }}</div>
      <div class="text-xs text-(--el-text-color-secondary)">{{ props.menuName }}</div>
    </div>
    <el-input v-model="keyword" :placeholder="t('sysMenu.assignPermissionSearch')" class="mb-2" clearable />
    <AuthDataTable
      :columns="permissionDrawerColumns"
      :data="filteredRows"
      border
      max-height="480"
      row-key="permissionCode"
    />
  </div>
</template>

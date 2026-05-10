<script lang="ts" setup>
import { getMenuPermissions, putMenuPermissions } from '@/api/system/menu';
import { errorMessage, message } from '@/shared/messaging/message';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
}>();

const { t } = useI18n();
const loading = ref(false);
const saving = ref(false);
const keyword = ref('');

type Row = { permissionCode: string; permissionName: string; assigned: boolean };
const rows = ref<Row[]>([]);

const filteredRows = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) {
    return rows.value;
  }
  return rows.value.filter(
    (r) => r.permissionCode.toLowerCase().includes(k) || r.permissionName.toLowerCase().includes(k)
  );
});

const load = async () => {
  loading.value = true;
  try {
    rows.value = await getMenuPermissions(props.menuId);
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
  } finally {
    loading.value = false;
  }
};

const toggle = (row: Row) => {
  row.assigned = !row.assigned;
};

const save = async (): Promise<boolean> => {
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
  void load();
});

defineExpose({ save });
</script>

<template>
  <div v-loading="loading">
    <el-input v-model="keyword" :placeholder="t('sysMenu.assignPermissionSearch')" class="mb-2" clearable />
    <el-table :data="filteredRows" border max-height="480" row-key="permissionCode" size="small">
      <el-table-column :label="t('sysMenu.permissionName')" prop="permissionName" min-width="160" />
      <el-table-column :label="t('sysMenu.permissionCode')" prop="permissionCode" min-width="160" />
      <el-table-column :label="t('sysMenu.assigned')" width="100" align="center">
        <template #default="{ row }">
          <el-checkbox :model-value="row.assigned" @change="() => toggle(row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

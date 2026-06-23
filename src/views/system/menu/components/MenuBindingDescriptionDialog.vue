<script lang="tsx" setup>
import type { SysMenuDetailVO } from '@/api/system/menu';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { transformI18n } from '@/plugins/i18n';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuBindingDescriptionDialog',
});

interface MenuBindingDescriptionDialogProps {
  data: SysMenuDetailVO;
}

const props = defineProps<MenuBindingDescriptionDialogProps>();
const { t } = useI18n();

const { roleColumns } = useRoleColumns();
const { permissionColumns } = usePermissionColumns();

const descriptionColumns = computed(() => [
  {
    label: t('sysMenu.menuTitle'),
    prop: 'title',
    labelWidth: 120,
    cellRenderer: () => <span>{transformI18n(props.data.title)}</span>,
  },
  {
    label: t('sysMenu.routeName'),
    prop: 'name',
    labelWidth: 120,
    copy: true,
    cellRenderer: () => <span>{transformI18n(props.data.name)}</span>,
  },
  { label: t('sysMenu.path'), prop: 'path', labelWidth: 120, copy: true },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="[data]" />

    <el-divider />

    <DetailRelationListSection
      :columns="roleColumns"
      :empty-text="t('sysMenu.bound.roles.empty')"
      :items="data.boundRoles"
      :title="t('sysMenu.bound.roles.title')"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="permissionColumns"
      :empty-text="t('sysMenu.bound.permissions.empty')"
      :items="data.boundPermissions"
      :title="t('sysMenu.bound.permissions.title')"
      class="mt-4"
      row-key="id"
    />
  </div>
</template>

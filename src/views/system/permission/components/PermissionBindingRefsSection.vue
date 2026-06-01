<script lang="ts" setup>
import type { SysPermissionBoundMenuItem, SysPermissionBoundRoleItem } from '@/api/system/permission';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/permission/constants/permission-search-options';
import usePermissionBindingMenuColumns from '@/views/system/permission/hooks/usePermissionBindingMenuColumns';
import usePermissionBindingRoleColumns from '@/views/system/permission/hooks/usePermissionBindingRoleColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionBindingRefsSection',
});

interface PermissionBindingRefsSectionProps {
  permissionType: number;
  boundRoles: SysPermissionBoundRoleItem[];
  boundMenus: SysPermissionBoundMenuItem[];
}

const props = defineProps<PermissionBindingRefsSectionProps>();

const { t } = useI18n();

const { columns: roleBindingColumns } = usePermissionBindingRoleColumns();
const { columns: menuBindingColumns } = usePermissionBindingMenuColumns();

const buttonPermissionType = PERMISSION_TYPE_FILTER_OPTIONS[0].value;

const isButtonPermission = computed(() => props.permissionType === buttonPermissionType);

const boundRoles = computed(() => props.boundRoles ?? []);
const boundMenus = computed(() => props.boundMenus ?? []);
</script>

<template>
  <div class="permission-binding-refs">
    <el-divider />

    <DetailRelationListSection
      :columns="roleBindingColumns"
      :empty-text="t('permissions.boundRolesEmpty')"
      :items="boundRoles"
      :title="t('permissions.boundRolesTitle')"
      row-key="roleCode"
    />

    <DetailRelationListSection
      :columns="menuBindingColumns"
      :empty-text="t('permissions.boundMenusEmpty')"
      :items="boundMenus"
      :show-badge="isButtonPermission"
      :title="t('permissions.boundMenusTitle')"
      class="permission-binding-refs__section-gap"
      row-key="id"
    >
      <template v-if="!isButtonPermission" #body>
        <el-text class="permission-binding-refs__empty" type="info">
          {{ t('permissions.boundMenusNotApplicable') }}
        </el-text>
      </template>
    </DetailRelationListSection>
  </div>
</template>

<style scoped>
.permission-binding-refs__section-gap {
  margin-top: 16px;
}

.permission-binding-refs__empty {
  display: block;
  padding: 8px 0;
}
</style>

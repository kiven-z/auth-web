<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/shared/composables/table/auditColumns';
import { getUserDetail, type SysUserDetail } from '@/api/system/user/user-base';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { errorMessage } from '@/services/feedback/message';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { ElAvatar } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'UserWorkstationOverviewPanel',
});

const route = useRoute();
const { t } = useI18n();
const loading = ref(false);
const detail = ref<SysUserDetail | null>(null);

const { renderUserAccountStatus, renderUserGender } = useUserProfileDisplay();
const { userDeptBindingColumns, userPostBindingColumns } = useUserProfileColumns();
const { roleColumns } = useRoleColumns();
const { permissionColumns } = usePermissionColumns();

const descriptionColumns = computed(() => [
  { label: t('users.field.username'), prop: 'username', labelWidth: 120, copy: true },
  { label: t('users.field.nickname'), prop: 'nickname', labelWidth: 120, copy: true },
  { label: t('users.field.email'), prop: 'email', labelWidth: 120, copy: true },
  { label: t('users.field.phone'), prop: 'phone', labelWidth: 120, copy: true },
  { label: t('relation.employeeNo'), prop: 'employeeNo', labelWidth: 120, copy: true },
  {
    label: t('users.field.avatarURL'),
    prop: 'avatar',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: string }) => <ElAvatar src={value} size={40} />,
  },
  {
    label: t('users.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserAccountStatus(value),
  },
  {
    label: t('users.field.gender'),
    prop: 'gender',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserGender(value),
  },
  { label: t('users.field.birthday'), prop: 'birthday', labelWidth: 120 },
  { label: t('users.field.introduction'), prop: 'introduction', labelWidth: 120, span: 2 },
  { label: t('users.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

/**
 * 拉取用户详情
 */
async function loadDetail() {
  const userId = String(route.params.userId ?? '');
  if (!userId) {
    detail.value = null;
    return;
  }

  loading.value = true;
  try {
    detail.value = await getUserDetail(userId);
  } catch (error: unknown) {
    errorMessage(error);
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.userId,
  () => void loadDetail(),
  { immediate: true }
);
</script>

<template>
  <div v-loading="loading" class="overview-panel">
    <template v-if="detail">
      <Description :column="2" :columns="descriptionColumns" :data="detail" />

      <el-divider />

      <DetailRelationListSection
        :columns="userDeptBindingColumns"
        :empty-text="t('users.bound.depts.empty')"
        :items="detail.deptList"
        :title="t('users.bound.depts.title')"
        row-key="id"
      />

      <DetailRelationListSection
        :columns="userPostBindingColumns"
        :empty-text="t('users.bound.posts.empty')"
        :items="detail.postList"
        :title="t('users.bound.posts.title')"
        class="mt-4"
        row-key="id"
      />

      <DetailRelationListSection
        :columns="roleColumns"
        :empty-text="t('users.effective.roles.empty')"
        :items="detail.effectiveRoles"
        :title="t('users.effective.roles.title')"
        class="mt-4"
        row-key="id"
      />

      <DetailRelationListSection
        :columns="permissionColumns"
        :empty-text="t('users.effective.permissions.empty')"
        :items="detail.effectivePermissions"
        :title="t('users.effective.permissions.title')"
        class="mt-4"
        row-key="id"
      />
    </template>
  </div>
</template>

<style scoped>
.overview-panel {
  height: 100%;
  padding: 1.2rem;
  overflow: auto;
}
</style>

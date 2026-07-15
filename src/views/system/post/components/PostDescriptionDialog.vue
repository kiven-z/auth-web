<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPostDetail } from '@/api/system/post';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import useDeptColumns from '@/views/system/_shared/columns/useDeptColumns';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostDetail>;

defineProps<PostDetailDialogProps>();
const { t } = useI18n();

const { userRelationBindingColumns } = useUserProfileColumns();
const { roleColumns } = useRoleColumns();
const { deptDescriptionColumns } = useDeptColumns();

const descriptionColumns = computed(() => [
  { label: t('post.field.postCode'), prop: 'postCode', labelWidth: 120, copy: true },
  { label: t('post.field.postName'), prop: 'postName', labelWidth: 120, copy: true },
  {
    label: t('post.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => {
      const option = POST_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
      const labelKey = option?.labelKey ?? (value ? 'post.enums.status.normal' : 'post.enums.status.disabled');
      return (
        <ElTag type={value ? 'success' : 'danger'} effect="plain">
          {t(labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('post.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('post.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <p class="mb-2 text-sm font-medium text-(--el-text-color-primary)">
      {{ t('post.bound.dept.title') }}
    </p>
    <Description :column="2" :columns="deptDescriptionColumns" :data="data.boundDept ?? {}" />

    <el-divider />

    <DetailRelationListSection
      :columns="userRelationBindingColumns"
      :empty-text="t('post.bound.users.empty')"
      :items="data.boundUsers"
      :title="t('post.bound.users.title')"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="roleColumns"
      :empty-text="t('post.bound.roles.empty')"
      :items="data.boundRoles"
      :title="t('post.bound.roles.title')"
      class="mt-4"
      row-key="id"
    />
  </div>
</template>

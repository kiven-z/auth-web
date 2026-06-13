<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPostDetail } from '@/api/system/post';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import usePostBindingColumns from '@/views/system/post/hooks/usePostBindingColumns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useBindingColumns from '@/views/system/_shared/columns/useBindingColumns';

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostDetail>;

const props = defineProps<PostDetailDialogProps>();
const { t } = useI18n();

const { userBindingColumns, deptSnapshotColumns } = usePostBindingColumns();
const { roleBindingColumns } = useBindingColumns();

const boundUsers = computed(() => props.data?.boundUsers ?? []);
const boundRoles = computed(() => props.data?.boundRoles ?? []);

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
    <Description :column="2" :columns="descriptionColumns" :data="[data]" />

    <el-divider />

    <p class="mb-2 text-sm font-medium text-(--el-text-color-primary)">
      {{ t('post.bound.dept.title') }}
    </p>
    <Description :column="2" :columns="deptSnapshotColumns" :data="[data.boundDept]" />

    <el-divider />

    <DetailRelationListSection
      :columns="userBindingColumns"
      :empty-text="t('post.bound.users.empty')"
      :items="boundUsers"
      :title="t('post.bound.users.title')"
      row-key="userId"
    />

    <DetailRelationListSection
      :columns="roleBindingColumns"
      :empty-text="t('post.bound.roles.empty')"
      :items="boundRoles"
      :title="t('post.bound.roles.title')"
      class="mt-4"
      row-key="roleCode"
    />
  </div>
</template>

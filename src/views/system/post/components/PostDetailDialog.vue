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

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostDetail>;

const props = defineProps<PostDetailDialogProps>();
const { t } = useI18n();

const { userBindingColumns, roleBindingColumns, deptSnapshotColumns } = usePostBindingColumns();

const boundUsers = computed(() => props.data?.boundUsers ?? []);
const boundRoles = computed(() => props.data?.boundRoles ?? []);

const descriptionColumns = computed(() => [
  { label: t('post.postCode'), prop: 'postCode', labelWidth: 120, copy: true },
  { label: t('post.postName'), prop: 'postName', labelWidth: 120, copy: true },
  {
    label: t('post.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => {
      const option = POST_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
      const labelKey = option?.labelKey ?? (value ? 'post.statusNormal' : 'post.statusDisabled');
      return (
        <ElTag type={value ? 'success' : 'danger'} effect="plain">
          {t(labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('post.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('post.remark'), prop: 'remark', labelWidth: 120, span: 2 },
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
      {{ t('post.boundDeptTitle') }}
    </p>
    <Description :column="2" :columns="deptSnapshotColumns" :data="[data.boundDept]" />

    <el-divider />

    <DetailRelationListSection
      :columns="userBindingColumns"
      :empty-text="t('post.boundUsersEmpty')"
      :items="boundUsers"
      :title="t('post.boundUsersTitle')"
      row-key="userId"
    />

    <DetailRelationListSection
      :columns="roleBindingColumns"
      :empty-text="t('post.boundRolesEmpty')"
      :items="boundRoles"
      :title="t('post.boundRolesTitle')"
      class="mt-4"
      row-key="roleCode"
    />
  </div>
</template>

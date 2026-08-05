<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/shared/composables/table/auditColumns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysDeptDetail } from '@/api/system/dept/dept';
import DetailRelationCountBar from '@/components/domain/detail/DetailRelationCountBar';
import Description from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree/tree';
import useOpenDeptAuthorizationSurface from '@/views/system/dept/hooks/authorization/useOpenDeptAuthorizationSurface';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptDescriptionDialog',
});

type DeptDescriptionDialogProps = DetailDialog<SysDeptDetail> & {
  /** 父部门展示名（由调用方根据扁平列表解析） */
  parentDeptLabel?: string;
};

const props = defineProps<DeptDescriptionDialogProps>();
const { t } = useI18n();
const { openDeptAuthorizationSurface } = useOpenDeptAuthorizationSurface();

const parentLabel = computed(() => {
  if (props.parentDeptLabel) {
    return props.parentDeptLabel;
  }
  const parentId = props.data?.parentId;
  if (!parentId || parentId === TREE_ROOT_PARENT_ID) {
    return t('dept.field.parentTopLevel');
  }
  return parentId;
});

const descriptionColumns = computed(() => [
  { label: t('dept.field.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
  { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
  {
    label: t('dept.field.parentDept'),
    prop: 'parentId',
    labelWidth: 120,
    cellRenderer: () => <span>{parentLabel.value}</span>,
  },
  {
    label: t('dept.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  { label: t('dept.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('dept.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('dept.binding.users.title'), count: props.data?.boundUserCount },
  { label: t('dept.binding.posts.title'), count: props.data?.boundPostCount },
  { label: t('dept.binding.roles.title'), count: props.data?.boundRoleCount },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <DetailRelationCountBar
      :items="relationCountItems"
      @view-authorization="
        openDeptAuthorizationSurface({
          deptId: data.id,
          deptCode: data.deptCode,
          deptName: data.deptName,
        })
      "
    />
  </div>
</template>

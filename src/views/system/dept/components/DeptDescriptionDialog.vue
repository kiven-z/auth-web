<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysDeptDetail } from '@/api/system/dept';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useDeptBindingColumns from '@/views/system/dept/hooks/columns/useDeptBindingColumns';
import useBindingColumns from '@/views/system/_shared/columns/useBindingColumns';

defineOptions({
  name: 'DeptDescriptionDialog',
});

type DeptDescriptionDialogProps = DetailDialog<SysDeptDetail> & {
  /** 父部门展示名（由调用方根据扁平列表解析） */
  parentDeptLabel?: string;
};

const props = defineProps<DeptDescriptionDialogProps>();
const { t } = useI18n();

// 绑定用户、岗位、角色表格列
const { userBindingColumns, postBindingColumns } = useDeptBindingColumns();
const { roleBindingColumns } = useBindingColumns();

// 绑定用户、岗位、角色数据
const boundUsers = computed(() => props.data?.boundUsers ?? []);
const boundPosts = computed(() => props.data?.boundPosts ?? []);
const boundRoles = computed(() => props.data?.boundRoles ?? []);

// 父部门展示名
const parentLabel = computed(() => {
  if (props.parentDeptLabel) {
    return props.parentDeptLabel;
  }
  const parentId = props.data?.parentId;
  if (!parentId || parentId === '0') {
    return t('dept.field.parentTopLevel');
  }
  return parentId;
});

// 部门基础信息表格列
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
    cellRenderer: ({ value }: { value: boolean }) => {
      const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
      const labelKey = option?.labelKey ?? (value ? 'dept.enum.status.normal' : 'dept.enum.status.disabled');
      return (
        <ElTag type={value ? 'success' : 'danger'} effect="plain">
          {t(labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('dept.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('dept.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
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

    <!-- 绑定用户 -->
    <DetailRelationListSection
      :columns="userBindingColumns"
      :empty-text="t('dept.binding.users.empty')"
      :items="boundUsers"
      :title="t('dept.binding.users.title')"
      row-key="userId"
    />

    <!-- 绑定岗位 -->
    <DetailRelationListSection
      :columns="postBindingColumns"
      :empty-text="t('dept.binding.posts.empty')"
      :items="boundPosts"
      :title="t('dept.binding.posts.title')"
      class="mt-4"
      row-key="id"
    />

    <!-- 绑定角色 -->
    <DetailRelationListSection
      :columns="roleBindingColumns"
      :empty-text="t('dept.binding.roles.empty')"
      :items="boundRoles"
      :title="t('dept.binding.roles.title')"
      class="mt-4"
      row-key="roleCode"
    />
  </div>
</template>

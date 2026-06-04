<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysDeptDetail } from '@/api/system/dept';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useDeptBindingColumns from '@/views/system/dept/hooks/useDeptBindingColumns';
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
    return t('dept.parentTopLevel');
  }
  return parentId;
});

// 部门基础信息表格列
const descriptionColumns = computed(() => [
  { label: t('dept.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
  { label: t('dept.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
  {
    label: t('dept.parentDept'),
    prop: 'parentId',
    labelWidth: 120,
    cellRenderer: () => <span>{parentLabel.value}</span>,
  },
  {
    label: t('dept.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => {
      const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
      const labelKey = option?.labelKey ?? (value ? 'dept.statusNormal' : 'dept.statusDisabled');
      return (
        <ElTag type={value ? 'success' : 'danger'} effect="plain">
          {t(labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('dept.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('dept.remark'), prop: 'remark', labelWidth: 120, span: 2 },
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
      :empty-text="t('dept.boundUsersEmpty')"
      :items="boundUsers"
      :title="t('dept.boundUsersTitle')"
      row-key="userId"
    />

    <!-- 绑定岗位 -->
    <DetailRelationListSection
      :columns="postBindingColumns"
      :empty-text="t('dept.boundPostsEmpty')"
      :items="boundPosts"
      :title="t('dept.boundPostsTitle')"
      class="mt-4"
      row-key="id"
    />

    <!-- 绑定角色 -->
    <DetailRelationListSection
      :columns="roleBindingColumns"
      :empty-text="t('dept.boundRolesEmpty')"
      :items="boundRoles"
      :title="t('dept.boundRolesTitle')"
      class="mt-4"
      row-key="roleCode"
    />
  </div>
</template>

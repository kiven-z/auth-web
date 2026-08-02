<script lang="ts" setup>
import type { GrantTableSubjectType } from '@/api/system/_shared/grant-table';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DeptGrantSubjectPanel from './DeptGrantSubjectPanel.vue';
import PostGrantSubjectPanel from './PostGrantSubjectPanel.vue';
import UserGrantSubjectPanel from './UserGrantSubjectPanel.vue';

defineOptions({ name: 'RoleGrantSubjectsAssignDrawer' });

defineProps<{
  leftTitle: string;
  leftSubtitle: string;
  roleId: string;
}>();

const { t } = useI18n();
const activeType = ref<GrantTableSubjectType>('USER');
</script>

<template>
  <div>
    <el-tabs v-model="activeType">
      <el-tab-pane :label="t('roles.bound.users.title')" lazy name="USER">
        <UserGrantSubjectPanel :left-subtitle="leftSubtitle" :left-title="leftTitle" :role-id="roleId" />
      </el-tab-pane>
      <el-tab-pane :label="t('roles.bound.depts.title')" lazy name="DEPT">
        <DeptGrantSubjectPanel :left-subtitle="leftSubtitle" :left-title="leftTitle" :role-id="roleId" />
      </el-tab-pane>
      <el-tab-pane :label="t('roles.bound.posts.title')" lazy name="POST">
        <PostGrantSubjectPanel :left-subtitle="leftSubtitle" :left-title="leftTitle" :role-id="roleId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

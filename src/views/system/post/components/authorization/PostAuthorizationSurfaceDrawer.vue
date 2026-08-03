<script lang="ts" setup>
import {
  getPostAuthorizationSummary,
  getPostRolesPage,
  getPostUsersPage,
  type PostAuthorizationSummary,
} from '@/api/system/post/post-authorization';
import { errorMessage } from '@/services/feedback/message';
import AuthorizationSurfaceShell from '@/views/system/_shared/authorization/AuthorizationSurfaceShell.vue';
import SubjectBoundRolesPanel from '@/views/system/_shared/authorization/SubjectBoundRolesPanel.vue';
import SubjectBoundUsersPanel from '@/views/system/_shared/authorization/SubjectBoundUsersPanel.vue';
import { SYS_POST_PERMS } from '@/views/system/post/constants/permissions';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PostAuthorizationSurfaceDrawer' });

/** 岗位授权面抽屉入参 */
interface PostAuthorizationSurfaceDrawerProps {
  postId: string;
}

type AuthorizationSurfaceTab = 'users' | 'roles';

const props = defineProps<PostAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const summaryLoading = ref(false);
const summary = ref<PostAuthorizationSummary | null>(null);
const activeTab = ref<AuthorizationSurfaceTab>('users');

const relationCountItems = computed(() => [
  { label: t('post.bound.users.title'), count: summary.value?.boundUserCount },
  { label: t('post.bound.roles.title'), count: summary.value?.boundRoleCount },
]);

/**
 * 拉取岗位授权面摘要计数
 */
async function loadSummary() {
  summaryLoading.value = true;
  try {
    summary.value = await getPostAuthorizationSummary(props.postId);
  } catch (error: unknown) {
    errorMessage(error);
    summary.value = null;
  } finally {
    summaryLoading.value = false;
  }
}

onMounted(() => {
  void loadSummary();
});
</script>

<template>
  <AuthorizationSurfaceShell :items="relationCountItems" :loading="summaryLoading">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('post.bound.users.title')" lazy name="users">
        <SubjectBoundUsersPanel
          :fetch-page="(query) => getPostUsersPage(postId, query)"
          :query-perm="SYS_POST_PERMS.QUERY"
          :title="t('post.bound.users.title')"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('post.bound.roles.title')" lazy name="roles">
        <SubjectBoundRolesPanel
          :fetch-page="(query) => getPostRolesPage(postId, query)"
          :query-perm="SYS_POST_PERMS.QUERY"
          :title="t('post.bound.roles.title')"
        />
      </el-tab-pane>
    </el-tabs>
  </AuthorizationSurfaceShell>
</template>

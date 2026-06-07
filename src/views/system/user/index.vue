<script lang="ts" setup>
import UserDeptTreePanel from '@/views/system/user/components/UserDeptTreePanel.vue';
import UserTablePanel from '@/views/system/user/components/UserTablePanel.vue';

defineOptions({
  name: 'SystemUser',
});
</script>

<template>
  <div class="user-page flex min-h-0 gap-2">
    <aside class="user-page__dept w-68 min-w-68 shrink-0">
      <UserDeptTreePanel />
    </aside>
    <main class="user-page__main min-w-[45%] flex-1">
      <UserTablePanel />
    </main>
  </div>
</template>

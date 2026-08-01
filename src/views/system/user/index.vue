<script lang="ts" setup>
import UserDeptTreePanel from '@/views/system/user/list/components/UserDeptTreePanel.vue';
import UserTablePanel from '@/views/system/user/list/components/UserTablePanel.vue';

defineOptions({
  name: 'SystemUser',
});
</script>

<template>
  <div class="user-page main-content--fill">
    <aside class="user-page__aside">
      <UserDeptTreePanel />
    </aside>
    <main class="user-page__main">
      <UserTablePanel />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  display: flex;
  gap: 8px;
  flex: 1;

  &__aside {
    display: flex;
    width: 17rem;
    min-height: 0;
    overflow: hidden;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}
</style>

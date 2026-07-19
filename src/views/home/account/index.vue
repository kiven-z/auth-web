<script lang="ts" setup>
import { useHomePageNavigation } from '@/shared/composables/layout/useHomePageNavigation';
import HomePageToolbar from '@/views/home/_shared/components/HomePageToolbar.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'AccountLayout',
});

const route = useRoute();
const { backWithReturn } = useHomePageNavigation();
const { t } = useI18n();

const activeTab = computed(() => String(route.name));
</script>

<template>
  <div class="account-layout">
    <div class="account-layout__header">
      <HomePageToolbar @back="backWithReturn('AccountProfile')" />

      <el-tabs
        :model-value="activeTab"
        class="account-layout__tabs"
        type="card"
        @tab-change="(name: string) => $router.replace({ name })"
      >
        <el-tab-pane :label="t('account.profile')" name="AccountProfile" />
        <el-tab-pane :label="t('account.security')" name="AccountSecurity" />
        <el-tab-pane :label="t('account.loginLog')" name="AccountLoginLog" />
      </el-tabs>
    </div>

    <div class="account-layout__content">
      <router-view v-slot="{ Component, route }">
        <Transition mode="out-in" name="fade-transform">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-layout {
  min-height: 100%;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
  }

  &__tabs {
    padding: 8px 16px 0;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }

  &__content {
    padding: 0 16px 16px;
  }
}
</style>

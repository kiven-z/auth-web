<script lang="ts" setup>
import { useAccountNavigation } from '@/shared/composables/layout/useAccountNavigation';
import { ArrowLeft } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'AccountLayout',
});

const route = useRoute();
const router = useRouter();
const { backFromAccount } = useAccountNavigation();
const { t } = useI18n();

const activeTab = computed(() => String(route.name));
</script>

<template>
  <div class="account-layout">
    <div class="account-layout__header">
      <div class="account-layout__toolbar">
        <el-button :icon="ArrowLeft" link type="primary" @click="backFromAccount">
          {{ t('account.back') }}
        </el-button>

        <el-button link type="primary" @click="router.push({ name: 'Welcome' })">
          {{ t('account.backHome') }}
        </el-button>
      </div>

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
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-layout {
  min-height: 100%;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
  }

  &__toolbar {
    display: flex;
    align-items: center;
    padding: 12px 16px;
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

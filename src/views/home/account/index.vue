<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountNavigation } from '@/shared/composables/layout/useAccountNavigation';
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
  <div class="account-layout bg-bg_color min-h-full">
    <div class="account-layout-toolbar flex items-center gap-2 px-4 pt-3">
      <el-button :icon="ArrowLeft" link type="primary" @click="backFromAccount">
        {{ t('account.back') }}
      </el-button>

      <el-button link type="primary" @click="router.push({ name: 'Welcome' })">
        {{ t('account.backHome') }}
      </el-button>
    </div>

    <el-tabs
      :model-value="activeTab"
      class="account-layout-tabs px-4 pt-2"
      type="card"
      @tab-change="(name: string) => $router.replace({ name })"
    >
      <el-tab-pane :label="t('account.profile')" name="AccountProfile" />
      <el-tab-pane :label="t('account.loginLog')" name="AccountLoginLog" />
    </el-tabs>

    <div class="account-layout-content px-4 pb-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocaleDef } from '@/auth/config/locales';
import { AuthDialog, closeAllDialog } from '@/components/ui/Dialog';
import { AuthDrawer, closeAllDrawer } from '@/components/ui/Drawer';
import { useGlobal } from '@pureadmin/utils';
import { ElConfigProvider } from 'element-plus';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'App',
  inheritAttrs: false,
});

const router = useRouter();
const { $storage } = useGlobal<GlobalPropertiesApi>();

router.beforeEach(() => {
  closeAllDialog();
  closeAllDrawer();
});

const currentLocale = computed(() => getLocaleDef($storage.locale?.locale).el);

/** 仅一级路由切换动画，避免 Layout 内菜单跳转整页重挂 */
function topLevelRouteKey(route: { matched: { path: string }[]; path: string }): string {
  return route.matched[0]?.path ?? route.path;
}
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <router-view v-slot="{ Component, route }">
      <Transition mode="out-in" name="fade-transform">
        <component :is="Component" :key="topLevelRouteKey(route)" />
      </Transition>
    </router-view>
    <AuthDialog />
    <AuthDrawer />
  </el-config-provider>
</template>

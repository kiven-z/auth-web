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
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <AuthDialog />
    <AuthDrawer />
  </el-config-provider>
</template>

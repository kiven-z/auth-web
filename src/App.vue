<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <AuthDialog />
    <AuthDrawer />
  </el-config-provider>
</template>

<script lang="ts">
import { getLocaleDef } from '@/auth/config/locales';
import { AuthDialog, closeAllDialog } from '@/components/ui/Dialog';
import { ElConfigProvider } from 'element-plus';
import { defineComponent } from 'vue';
import { AuthDrawer, closeAllDrawer } from '@/components/ui/Drawer';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    AuthDrawer,
    AuthDialog,
  },
  inheritAttrs: false,
  setup() {
    const router = useRouter();

    router.beforeEach(() => {
      closeAllDialog();
      closeAllDrawer();
    });
  },
  computed: {
    currentLocale() {
      return getLocaleDef(this.$storage.locale?.locale).el;
    },
  },
});
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <AuthDialog />
    <AuthDrawer />
  </el-config-provider>
</template>

<script lang="ts">
import { AuthDialog, closeAllDialog } from '@/components/ui/Dialog';
import { ElConfigProvider } from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
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
      return this.$storage.locale?.locale === 'zh' ? zhCn : en;
    },
  },
});
</script>

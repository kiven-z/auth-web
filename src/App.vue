<template>
  <el-config-provider :locale="currentLocale">
    <div class="app-root">
      <router-view />
      <ReDialog />
    </div>
  </el-config-provider>
</template>

<script lang="ts">
import { ReDialog } from '@/components/ui/Dialog';
import { ElConfigProvider } from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
  },
  inheritAttrs: false,
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === 'zh' ? zhCn : en;
    },
  },
});
</script>

import { wireSessionStoreBridge } from '@/bootstrap';
import { useI18n } from '@/plugins/i18n';
import { setupStore } from '@/store';
import { MotionPlugin } from '@vueuse/motion';
import App from './App.vue';
import { getPlatformConfig } from './auth/config';
import router from './router';
import { useEcharts } from '@/plugins/echarts';
import { useElementPlus } from '@/plugins/elementPlus';
import { injectResponsiveStorage } from '@/bootstrap/responsive';
import { createApp, type Directive } from 'vue';

import { installAuthDataTable } from '@/components/ui/AuthDataTable';
import Description from '@/components/ui/Description';
// 引入重置样式
import './style/reset.scss';
// 导入公共样式
import './style/index.scss';
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import 'element-plus/dist/index.css';
import './style/tailwind.css';
// 导入字体图标
import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont.js';
// 自定义指令
import * as directives from '@/app/directives';
// 全局注册@iconify/vue图标库
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from './components/ui/Icon';
// 全局注册按钮级别权限组件
import { Perms } from '@/auth/permission';
// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import VueTippy from 'vue-tippy';

const app = createApp(App);

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.component('IconifyIconOffline', IconifyIconOffline);
app.component('IconifyIconOnline', IconifyIconOnline);
app.component('FontIcon', FontIcon);

app.component('Perms', Perms);

app.use(VueTippy);

getPlatformConfig(app).then(async (config) => {
  setupStore(app);
  wireSessionStoreBridge();
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  installAuthDataTable(app);
  app.use(MotionPlugin).use(useI18n).use(useElementPlus).use(Description).use(useEcharts);
  app.mount('#app');
});

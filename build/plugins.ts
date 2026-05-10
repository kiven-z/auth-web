import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';
import Icons from 'unplugin-icons/vite';
import type { PluginOption } from 'vite';
import { vitePluginFakeServer } from 'vite-plugin-fake-server';
import removeConsole from 'vite-plugin-remove-console';
import removeNoMatch from 'vite-plugin-router-warn';
import VueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';
import { cdn } from './cdn';
import { configCompressPlugin } from './compress';
import { viteBuildInfo } from './info';
import { pathResolve } from './utils';

import monacoEditorPluginImport from 'vite-plugin-monaco-editor';

const monacoEditorPlugin =
  typeof monacoEditorPluginImport === 'function'
    ? monacoEditorPluginImport
    : (monacoEditorPluginImport as { default: typeof monacoEditorPluginImport }).default;

export function getPluginsList(VITE_CDN: boolean, VITE_COMPRESSION: ViteCompression): PluginOption[] {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    tailwindcss(),
    vue(),
    VueDevTools(),
    // jsx、tsx语法支持
    vueJsx(),
    VueI18nPlugin({
      include: [pathResolve('../locales/**')],
    }),
    viteBuildInfo(),
    /**
     * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
     * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
     * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
     */
    removeNoMatch(),
    /**
     * Monaco worker 单一责任：默认由 vite-plugin-monaco-editor 提供。
     * 运行时仅在极端场景才走 UI bootstrap 的 fallback getWorker。
     */
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService',  'html', 'json'],
      customWorkers: [],
      publicPath: 'monacoeditorwork',
      globalAPI: false,
    }),
    // mock支持
    vitePluginFakeServer({
      logger: false,
      include: 'mock',
      infixName: false,
      enableProd: true,
    }),
    // svg组件化支持
    svgLoader(),
    // 自动按需加载图标
    Icons({
      compiler: 'vue3',
      scale: 1,
    }),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ['src/assets/iconfont/iconfont.js'] }),
    // 打包分析
    lifecycle === 'report' ? visualizer({ open: true, brotliSize: true, filename: 'report.html' }) : (null as any),
  ];
}

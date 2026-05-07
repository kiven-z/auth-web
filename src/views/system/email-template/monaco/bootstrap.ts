/**
 * Monaco 按需加载与 worker 初始化。
 *
 * 说明：
 * 1. 即使使用 monaco-editor-vue3，底层也需要明确 worker 解析策略；
 * 2. 这里使用动态 import + MonacoEnvironment.getWorker，避免静态引入 monaco 大包导致
 *    Vite 预构建压力过大（历史上常见 dev 500 或栈溢出）；
 * 3. 该初始化为幂等，仅首次加载时执行。
 */
let environmentReady = false;

/**
 * 配置 MonacoEnvironment 后动态加载 monaco-editor。
 */
export async function loadMonacoEditor(): Promise<typeof import('monaco-editor')> {
  if (!environmentReady) {
    const EditorWorker = (await import('monaco-editor/esm/vs/editor/editor.worker.js?worker')).default;
    const HtmlWorker = (await import('monaco-editor/esm/vs/language/html/html.worker.js?worker')).default;
    (
      globalThis as unknown as { MonacoEnvironment?: { getWorker: (moduleId: string, label: string) => Worker } }
    ).MonacoEnvironment = {
      getWorker(_moduleId: string, label: string) {
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new HtmlWorker();
        }
        return new EditorWorker();
      },
    };
    environmentReady = true;
  }
  return import('monaco-editor');
}

/**
 * Monaco 仅在打开「模板编辑」时动态加载，并配置 Worker，避免 Vite 预构建/同步拉取整包导致 dev 500 或栈溢出。
 */
let environmentReady = false;

/**
 * 配置全局 Worker 后再加载 monaco-editor（须先于首次 editor.create）
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

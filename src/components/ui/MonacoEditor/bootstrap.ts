/**
 * Monaco 通用引导：按需加载并配置 worker。
 * 该逻辑可被多个业务复用，避免重复初始化。
 */
let environmentReady = false;

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

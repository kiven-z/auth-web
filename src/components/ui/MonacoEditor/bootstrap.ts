/**
 * Monaco 通用引导：默认由 vite-plugin-monaco-editor 提供 worker。
 * 当插件路径不可用或显式开启兜底时，才安装手写 getWorker fallback。
 */
let fallbackInstalled = false;

type MonacoEnvironment = {
  getWorker?: (moduleId: string, label: string) => Worker;
};

interface LoadMonacoEditorOptions {
  /** 显式启用 fallback worker（默认 false） */
  forceFallbackWorker?: boolean;
}

async function installFallbackWorkerEnvironment() {
  if (fallbackInstalled) {
    return;
  }
  const EditorWorker = (await import('monaco-editor/esm/vs/editor/editor.worker.js?worker')).default;
  const HtmlWorker = (await import('monaco-editor/esm/vs/language/html/html.worker.js?worker')).default;
  const JsonWorker = (await import('monaco-editor/esm/vs/language/json/json.worker.js?worker')).default;

  const target = globalThis as typeof globalThis & { MonacoEnvironment?: MonacoEnvironment };
  target.MonacoEnvironment = {
    ...target.MonacoEnvironment,
    getWorker(_moduleId: string, label: string) {
      switch (label) {
        case 'html':
        case 'handlebars':
        case 'razor':
          return new HtmlWorker();
        case 'json':
          return new JsonWorker();
        default:
          return new EditorWorker();
      }
    },
  };
  fallbackInstalled = true;
}

export async function loadMonacoEditor(options?: LoadMonacoEditorOptions): Promise<unknown> {
  // const monaco = await import('monaco-editor');
  const monaco = await import('monaco-editor/esm/vs/editor/editor.api.js');
  const target = globalThis as typeof globalThis & { MonacoEnvironment?: MonacoEnvironment };
  const shouldInstallFallback = options?.forceFallbackWorker || !target.MonacoEnvironment?.getWorker;
  if (shouldInstallFallback) {
    await installFallbackWorkerEnvironment();
  }

  return monaco;
}

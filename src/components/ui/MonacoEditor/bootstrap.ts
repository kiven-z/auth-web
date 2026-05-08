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
  const CssWorker = (await import('monaco-editor/esm/vs/language/css/css.worker.js?worker')).default;
  const JsonWorker = (await import('monaco-editor/esm/vs/language/json/json.worker.js?worker')).default;
  const TsWorker = (await import('monaco-editor/esm/vs/language/typescript/ts.worker.js?worker')).default;

  const target = globalThis as typeof globalThis & { MonacoEnvironment?: MonacoEnvironment };
  target.MonacoEnvironment = {
    ...target.MonacoEnvironment,
    getWorker(_moduleId: string, label: string) {
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HtmlWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CssWorker();
      }
      if (label === 'json') {
        return new JsonWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker();
      }
      return new EditorWorker();
    },
  };
  fallbackInstalled = true;
}

export async function loadMonacoEditor(options?: LoadMonacoEditorOptions): Promise<typeof import('monaco-editor')> {
  const monaco = await import('monaco-editor');
  const target = globalThis as typeof globalThis & { MonacoEnvironment?: MonacoEnvironment };
  const shouldInstallFallback = options?.forceFallbackWorker || !target.MonacoEnvironment?.getWorker;
  if (shouldInstallFallback) {
    await installFallbackWorkerEnvironment();
  }

  return monaco;
}

import type { EmailTemplateRequireFieldRow } from '@/api/system/email-template';
import { EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS } from '@/views/system/email-template/config/monaco-config';
import { registerEmailTemplateProviders } from '@/views/system/email-template/monaco/providers';
import {
  applyRequireFieldsMarkers,
  clearRequireFieldsMarkers,
  type MonacoModule,
} from '@/views/system/email-template/monaco/validator';
import type { editor } from 'monaco-editor';

/**
 * 注册邮件模板 Monaco 能力：补全、悬浮、未声明变量标红。
 */
export function registerEmailTemplateMonaco(
  editorInstance: editor.IStandaloneCodeEditor,
  monacoApi: MonacoModule,
  getRequireFields: () => EmailTemplateRequireFieldRow[]
): { dispose: () => void; refreshMarkers: () => void } {
  const model = editorInstance.getModel();
  if (!model) {
    const noop = () => {};
    return { dispose: noop, refreshMarkers: noop };
  }

  const disposables: Array<{ dispose: () => void }> = [];
  const providers = registerEmailTemplateProviders(model, monacoApi, getRequireFields);
  disposables.push(providers);

  let markerTimer: ReturnType<typeof setTimeout> | null = null;
  let applyingMarkers = false;

  const refreshMarkers = () => {
    if (markerTimer) {
      clearTimeout(markerTimer);
    }
    markerTimer = setTimeout(() => {
      markerTimer = null;
      const keys = new Set(
        getRequireFields()
          .map((row) => row.key)
          .filter(Boolean)
      );
      applyingMarkers = true;
      try {
        applyRequireFieldsMarkers(model, monacoApi, keys);
      } finally {
        applyingMarkers = false;
      }
    }, EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS);
  };

  disposables.push(
    model.onDidChangeContent(() => {
      if (applyingMarkers) {
        return;
      }
      refreshMarkers();
    })
  );

  queueMicrotask(() => {
    if (!model.isDisposed()) {
      refreshMarkers();
    }
  });

  const dispose = () => {
    if (markerTimer) {
      clearTimeout(markerTimer);
      markerTimer = null;
    }
    clearRequireFieldsMarkers(model, monacoApi);
    disposables.forEach((item) => item.dispose());
  };

  return { dispose, refreshMarkers };
}

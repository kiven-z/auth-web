/**
 * 邮件模板 HTML 编辑器：注册 Monaco 补全/Hover，并对未在 require_fields 声明的 `${var}` 标红。
 */
import type { EmailTemplateRequireFieldRow } from '@/api/system/email-template';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';

/**
 * FreeMarker 内置/常用关键字：不作为自定义变量校验与补全对象
 */
const FREEMARKER_ROOT_KEYWORDS = new Set([
  'if',
  'else',
  'elseif',
  'list',
  'sep',
  'items',
  'break',
  'continue',
  'assign',
  'global',
  'local',
  'include',
  'import',
  'attempt',
  'recover',
  'macro',
  'function',
  'return',
  'nested',
  'switch',
  'case',
  'default',
  'true',
  'false',
  'as',
  'lt',
  'gt',
  'lte',
  'gte',
]);

/**
 * 从 ${ 后未闭合片段中取根变量名（第一段标识符）
 * @param inner ${ 之后的片段
 */
function getRootVariableName(inner: string): string | null {
  const m = inner.trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
  if (!m) {
    return null;
  }
  const name = m[1];
  if (FREEMARKER_ROOT_KEYWORDS.has(name)) {
    return null;
  }
  return name;
}

/**
 * 提取未在 require_fields 中声明的 ${var} 根变量
 * @param text 模板全文
 * @param keys 已声明 key
 */
function collectUnknownVariableMarkers(
  text: string,
  keys: Set<string>
): { start: number; end: number; name: string }[] {
  const out: { start: number; end: number; name: string }[] = [];
  const re = /\$\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const inner = m[1];
    const name = getRootVariableName(inner);
    if (!name) continue;
    if (!keys.has(name)) {
      const open = m.index + 2;
      out.push({ start: open, end: open + name.length, name });
    }
  }
  return out;
}

/**
 * 光标偏移 → Monaco Position
 */
function offsetToPosition(model: monaco.editor.ITextModel, offset: number): monaco.Position {
  const pos = model.getPositionAt(offset);
  return new monaco.Position(pos.lineNumber, pos.column);
}

/**
 * 注册邮件模板 Monaco：补全/Hover；未声明变量 setModelMarkers 标红
 * @param editor 编辑器实例
 * @param monacoApi monaco 命名空间
 * @param getRequireFields 当前模板变量列表
 */
export function registerEmailTemplateMonaco(
  editor: editor.IStandaloneCodeEditor,
  monacoApi: typeof monaco,
  getRequireFields: () => EmailTemplateRequireFieldRow[]
): { dispose: () => void; refreshMarkers: () => void } {
  const model = editor.getModel();
  if (!model) {
    const noop = () => {};
    return { dispose: noop, refreshMarkers: noop };
  }

  const disposables: monaco.IDisposable[] = [];

  const getFieldMap = () => {
    const map = new Map<string, EmailTemplateRequireFieldRow>();
    for (const r of getRequireFields()) {
      if (r?.key) {
        map.set(r.key, r);
      }
    }
    return map;
  };

  disposables.push(
    monacoApi.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['$', '{'],
      provideCompletionItems(m, position) {
        if (m !== model) {
          return { suggestions: [] };
        }
        const line = m.getLineContent(position.lineNumber);
        const before = line.substring(0, position.column - 1);
        const dollarIdx = before.lastIndexOf('${');
        if (dollarIdx < 0) {
          return { suggestions: [] };
        }
        const inner = before.slice(dollarIdx + 2);
        if (inner.includes('}')) {
          return { suggestions: [] };
        }
        const word = inner.trim();
        const range = new monacoApi.Range(position.lineNumber, dollarIdx + 3, position.lineNumber, position.column);
        const suggestions = getRequireFields()
          .filter((f) => f.key && f.key.startsWith(word))
          .map((f) => ({
            label: f.key,
            kind: monacoApi.languages.CompletionItemKind.Variable,
            insertText: `${f.key}}`,
            detail: f.description,
            range,
          }));
        return { suggestions };
      },
    })
  );

  const findHoverAt = (
    m: monaco.editor.ITextModel,
    position: monaco.Position,
    fieldMap: Map<string, EmailTemplateRequireFieldRow>
  ) => {
    const off = m.getOffsetAt(position);
    const text = m.getValue();
    const re = /\$\{([^}]*)\}/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      if (off < start || off > end) continue;
      const inner = match[1];
      const name = getRootVariableName(inner);
      if (!name) continue;
      const row = fieldMap.get(name);
      if (!row) continue;
      const openInner = start + 2;
      const range = monacoApi.Range.fromPositions(
        offsetToPosition(m, openInner),
        offsetToPosition(m, Math.min(openInner + name.length, text.length))
      );
      return { range, row };
    }
    return null;
  };

  disposables.push(
    monacoApi.languages.registerHoverProvider('html', {
      provideHover(m, position) {
        if (m !== model) {
          return null;
        }
        const info = findHoverAt(m, position, getFieldMap());
        if (!info) {
          return null;
        }
        const ex =
          info.row.exampleValue === undefined || info.row.exampleValue === null
            ? ''
            : JSON.stringify(info.row.exampleValue);
        const value = `${info.row.description ?? ''}\n\n示例字段值：${ex}`;
        return {
          range: info.range,
          contents: [{ value }],
        };
      },
    })
  );

  let markerTimer: ReturnType<typeof setTimeout> | null = null;
  const markerSource = 'email-template-require-fields';

  const scheduleMarkers = () => {
    if (markerTimer) clearTimeout(markerTimer);
    markerTimer = setTimeout(() => {
      markerTimer = null;
      const text = model.getValue();
      const keys = new Set(
        getRequireFields()
          .map((r) => r.key)
          .filter(Boolean)
      );
      const issues = collectUnknownVariableMarkers(text, keys);
      const markers: monaco.editor.IMarkerData[] = issues.map((it) => {
        const startPos = offsetToPosition(model, it.start);
        const endPos = offsetToPosition(model, Math.min(it.end, text.length));
        return {
          severity: monacoApi.MarkerSeverity.Error,
          message: `变量未在 require_fields 中声明: ${it.name}`,
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
        };
      });
      monacoApi.editor.setModelMarkers(model, markerSource, markers);
    }, 200);
  };

  disposables.push(model.onDidChangeContent(() => scheduleMarkers()));

  scheduleMarkers();

  const disposeAll = () => {
    if (markerTimer) clearTimeout(markerTimer);
    monacoApi.editor.setModelMarkers(model, markerSource, []);
    disposables.forEach((d) => d.dispose());
  };

  return { dispose: disposeAll, refreshMarkers: scheduleMarkers };
}

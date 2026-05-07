import type { editor } from 'monaco-editor';

/**
 * FreeMarker 保留关键字，不参与自定义变量匹配。
 */
export const FREEMARKER_ROOT_KEYWORDS = new Set([
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
 * 变量标红 marker 来源标识。
 */
export const EMAIL_TEMPLATE_MARKER_SOURCE = 'email-template-require-fields';

/**
 * 变量检测防抖时间。
 */
export const EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS = 200;

/**
 * 模板编辑器默认配置。
 */
export const EMAIL_TEMPLATE_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  language: 'html',
  theme: 'vs',
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
};

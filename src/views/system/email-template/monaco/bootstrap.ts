/**
 * 邮件模板 Monaco 引导兼容层。
 *
 * 说明：
 * 1. UI 层优先使用 `components/ui/MonacoEditor`（基于 monaco-editor-vue3）；
 * 2. worker 默认由 `vite-plugin-monaco-editor` 负责，UI bootstrap 仅提供 fallback；
 * 3. 当前文件保留历史路径兼容，避免业务 import 一次性迁移造成破坏。
 */
export { loadMonacoEditor } from '@/components/ui/MonacoEditor/bootstrap';

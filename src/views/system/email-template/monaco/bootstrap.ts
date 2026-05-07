/**
 * 邮件模板 Monaco 引导兼容层。
 *
 * 说明：
 * 1. UI 层优先使用 `components/ui/MonacoEditor`（基于 monaco-editor-vue3）；
 * 2. 底层 worker 配置仍需保留，因此统一收敛在 UI 组件 bootstrap；
 * 3. 当前文件作为历史路径兼容，避免业务 import 一次性迁移造成破坏。
 */
export { loadMonacoEditor } from '@/components/ui/MonacoEditor/bootstrap';

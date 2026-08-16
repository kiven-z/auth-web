import { config } from 'md-editor-v3';
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts';
import mermaid from 'mermaid';

import 'markdown-it-github-alerts/styles/github-base.css';
import 'markdown-it-github-alerts/styles/github-colors-light.css';
import '@/style/md/md-github-alerts.scss';

/**
 * 全局配置 md-editor-v3：本地扩展、Mermaid 主题、GitHub Alerts
 * @description 须在应用挂载前调用一次，勿在组件内重复 config
 */
export function setupMdEditor(): void {
  config({
    editorExtensions: {
      mermaid: {
        instance: mermaid,
      },
    },
    mermaidConfig(base) {
      return {
        ...base,
        logLevel: 'error',
      };
    },
    markdownItPlugins(plugins) {
      return [
        ...plugins,
        {
          type: 'githubAlerts',
          plugin: MarkdownItGitHubAlerts,
          options: {},
        },
      ];
    },
  });
}

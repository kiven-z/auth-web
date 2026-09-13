import type { ExportPreCheckResult } from '@/features/file/api/models/export-precheck';
import type { ExportPreCheckView } from './types';

/** i18n 翻译函数（仅本包前置检查文案） */
type PreCheckTranslate = (key: string, params?: Record<string, unknown>) => string;

/**
 * 将前置检查结果映射为 el-result 展示模型
 * @param result 前置检查结果
 * @param t i18n 翻译
 * @returns 图标与文案
 */
function resolvePreCheckView(result: ExportPreCheckResult, t: PreCheckTranslate): ExportPreCheckView {
  switch (result.status) {
    case 'NORMAL':
      return {
        icon: 'success',
        title: t('fileExport.normalTitle'),
        sub: t('fileExport.normalSub', { count: result.totalRows }),
      };
    case 'SHARDED':
      return {
        icon: 'warning',
        title: t('fileExport.shardedTitle'),
        sub: t('fileExport.shardedSub', {
          count: result.totalRows,
          shards: result.shardCount,
        }),
      };
    case 'EXCEEDED':
      return {
        icon: 'error',
        title: t('fileExport.exceededTitle'),
        sub: t('fileExport.exceededSub', {
          max: result.maxRows,
          current: result.totalRows,
        }),
      };
    default: {
      return result.status;
    }
  }
}

export default resolvePreCheckView;

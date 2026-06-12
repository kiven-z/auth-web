import type { QuartzTaskClassRow } from '@/api/schedule/job';

/**
 * 任务目录类展示文案：名称（说明）
 * @param item 白名单任务类
 * @returns 下拉选中态展示文本
 */
export function formatJobCatalogClassLabel(
  item: Pick<QuartzTaskClassRow, 'name' | 'className' | 'description'>
): string {
  const title = item.name || item.className;
  if (!item.description) {
    return title;
  }
  return `${title}（${item.description}）`;
}

/**
 * 按调度模式过滤白名单任务类
 * @param classes 全量目录
 * @param taskType 任务类型
 * @returns 当前模式可选类
 */
export function filterCatalogClassesByTaskType(
  classes: QuartzTaskClassRow[],
  taskType: 'BEAN_INVOKE' | 'CUSTOM_CLASS'
): QuartzTaskClassRow[] {
  return classes.filter((item) => item.invokeModes?.includes(taskType));
}

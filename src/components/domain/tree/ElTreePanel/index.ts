import { withInstall } from '@/shared/vue/withInstall';

import elTreePanel from './src/ElTreePanel.vue';

export { treeRowActionsLockKey } from './src/treeRowActionsLock';
export type { TreeRowActionsLockContext } from './src/treeRowActionsLock';

/** 模块树视图壳：TableBar + 展开收起 + el-tree 行布局样式 */
export const ElTreePanel = withInstall(elTreePanel);

export default ElTreePanel;

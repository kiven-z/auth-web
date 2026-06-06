import { withInstall } from '@pureadmin/utils';

import authElTreePanel from './src/AuthElTreePanel.vue';

/** 模块树视图壳：TableBar + 展开收起 + el-tree 行布局样式 */
export const AuthElTreePanel = withInstall(authElTreePanel);

export default AuthElTreePanel;

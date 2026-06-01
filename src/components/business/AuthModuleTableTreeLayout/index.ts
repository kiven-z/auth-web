import { withInstall } from '@pureadmin/utils';

import authElTreePanel from './src/AuthElTreePanel.vue';
import authModuleTableTreeLayout from './src/AuthModuleTableTreeLayout.vue';

/** 表格 / 树形双视图切换布局*/
export const AuthModuleTableTreeLayout = withInstall(authModuleTableTreeLayout);

/** 模块树视图壳：TableBar + 展开收起 + el-tree 行布局样式 */
export const AuthElTreePanel = withInstall(authElTreePanel);

export default AuthModuleTableTreeLayout;

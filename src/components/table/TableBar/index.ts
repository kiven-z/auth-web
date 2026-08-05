import { withInstall } from '@/shared/vue/withInstall';
import tableBar from './src/TableBar.vue';

/** 列表工具条：列显隐、密度、刷新、全屏等；表格主体请使用 `DataTable`。 */
export const TableBar = withInstall(tableBar);
export default TableBar;

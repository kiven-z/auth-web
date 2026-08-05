import { withInstall } from '@/shared/vue/withInstall';

import statMetricCard from './src/StatMetricCard.vue';

export type { StatMetricCardProps, StatMetricTone } from './src/types';
export { DEFAULT_STATISTIC_TRANSITION_MS, useAnimatedStatistic } from './src/hooks/useAnimatedStatistic';

/** 运维 / 列表 KPI 数字卡（el-statistic + 滚动动画） */
export const StatMetricCard = withInstall(statMetricCard);

export default StatMetricCard;

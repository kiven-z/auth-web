/** utils barrel file - re-exports all route utility functions */

export { addAsyncRoutes } from './async-routes';
export { getAuths, hasAuth, isOneOfArray } from './auth';
export { ascending, filterNoPermissionTree, filterTree } from './menu-sort';
export { addPathMatch, getHistoryMode, getTopMenu, handleAliveRoute, handleTopMenu } from './misc';
export { handleAsyncRoutes, initRouter } from './route-registry';
export { findRouteByPath, formatFlatteningRoutes, formatTwoStageRoutes, getParentPaths } from './route-tree';

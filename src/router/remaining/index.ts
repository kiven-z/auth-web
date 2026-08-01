import account from './routes/account';
import inbox from './routes/inbox';
import login from './routes/login';
import systemShell from './routes/system-shell';

/**
 * 不参与菜单树处理的边角静态路由（登录、个人中心、消息、全屏异常页等）。
 * 与 modules/ 平级，由 router/index 单独引入，勿放入 modules 以免被 glob 收进 constantRoutes。
 */
export default [...login, ...account, ...inbox, ...systemShell] satisfies Array<RouteConfigsTable>;

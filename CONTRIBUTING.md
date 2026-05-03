# auth-web 前端结构约定

本文说明 `src/` 下主要目录的职责，新增代码时请优先放入最贴合的一层，避免再出现「全部堆在 `utils`」的歧义。

## 目录职责

| 路径                                                                                          | 职责                                                                                 |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/api/domains/`                                                                            | 与后端域对齐的 HTTP API 封装；通过 `http` 发起请求。                                 |
| `src/infrastructure/`                                                                         | 与 **HTTP 拦截器、Pinia 会话、登录态、权限冲突处理** 强耦合的基础设施。              |
| `src/shared/`                                                                                 | **可复用、边界清晰** 的库与壳层工具（与具体业务页面弱耦合）。                        |
| `src/features/<domain>/`                                                                      | 按业务域收敛的页面与子模块（例如认证域 `features/auth/login`，路由懒加载指向此处）。 |
| `src/config/`、`src/layout/`、`src/router/`、`src/store/`、`src/views/`、`src/components/` 等 | 保持原有用途。                                                                       |

### `src/features/`（已落地示例）

- **`features/auth/login/`**：登录页及局部 `utils/`，与 [`src/api/domains/auth`](./src/api/domains/auth) 域对齐；路由 `/login` 见 [`src/router/modules/remaining.ts`](./src/router/modules/remaining.ts)。
- **`features/shell/error/`**：403 / 404 / 500 页面；全屏入口见 `remaining.ts`，菜单内 `/error/*` 见 [`src/router/modules/error.ts`](./src/router/modules/error.ts)，兜底 404 见 [`src/router/utils.ts`](./src/router/utils.ts)。
- **`features/home/welcome/`**：首页欢迎区；路由 `/welcome` 见 [`src/router/modules/home.ts`](./src/router/modules/home.ts)。
- **`features/permission/`**：权限演示页（页面权限、按钮权限等），由动态路由 [`src/router/utils.ts`](./src/router/utils.ts) 的 `import.meta.glob` 同时扫描 `src/views` 与 `src/features` 解析 `component` 路径（如 mock 中的 `permission/button/index`）。

`src/views/` 可继续作为遗留或第三方模板的落点；新增业务页优先放 `src/features/<domain>/`。

### `src/infrastructure/`（典型内容）

- `http/`：`http` 实例、`ApiResult`/`ApiBusinessError` 等与后端契约相关的类型与错误类。
- `session/`：Token、用户信息读写、`sso` 等会话侧逻辑。
- `permissionConflict.ts`：权限版本冲突（如 HTTP 409）时的统一处理。

### `src/shared/`（典型内容）

- `lib/`：树、propTypes 等通用工具。
- `messaging/`：`message`、`mitt`、**`dialog`**（`deleteConfirm` / `operationConfirm` / `multiConfirm`，多层确认勿直接使用 `ElMessageBox.confirm`）。
- `storage/localforage/`：离线存储封装。
- `bootstrap/`：全局 polyfill、可选的 `preventDefault` 等启动期脚本。
- `app/`：响应式存储注入、进度条、打印等与「壳层/全局体验」相关的工具。

业务侧统一使用：

- `import { http } from '@/infrastructure/http'`
- `import { message } from '@/shared/messaging/message'`
- `import { deleteConfirm, multiConfirm } from '@/shared/messaging/dialog'`（删除等危险操作）
- 会话与权限：`@/infrastructure/session/auth` 等。

## 本地校验

```bash
pnpm exec eslint .
pnpm build
```

# auth-web 前端结构约定

本文说明 `src/` 下主要目录的职责，新增代码时请优先放入最贴合的一层，避免再出现「全部堆在 `utils`」的歧义。

## 目录职责

| 路径 | 职责 |
|------|------|
| `src/api/domains/` | 与后端域对齐的 HTTP API 封装；通过 `http` 发起请求。 |
| `src/infrastructure/` | 与 **HTTP 拦截器、Pinia 会话、登录态、权限冲突处理** 强耦合的基础设施。 |
| `src/shared/` | **可复用、边界清晰** 的库与壳层工具（与具体业务页面弱耦合）。 |
| `src/config/`、`src/layout/`、`src/router/`、`src/store/`、`src/views/`、`src/components/` 等 | 保持原有用途。 |

### `src/infrastructure/`（典型内容）

- `http/`：`http` 实例、`ApiResult`/`ApiBusinessError` 等与后端契约相关的类型与错误类。
- `session/`：Token、用户信息读写、`sso` 等会话侧逻辑。
- `permissionConflict.ts`：权限版本冲突（如 HTTP 409）时的统一处理。

### `src/shared/`（典型内容）

- `lib/`：树、propTypes 等通用工具。
- `messaging/`：`message`、`mitt` 等消息与事件总线。
- `storage/localforage/`：离线存储封装。
- `bootstrap/`：全局 polyfill、可选的 `preventDefault` 等启动期脚本。
- `app/`：响应式存储注入、进度条、打印等与「壳层/全局体验」相关的工具。

业务侧统一使用：

- `import { http } from '@/infrastructure/http'`
- `import { message } from '@/shared/messaging/message'`
- 会话与权限：`@/infrastructure/session/auth` 等。

## 第二阶段（预告）

后续可引入 `src/features/<domain>/`，将登录等页面按域迁入并同步路由懒加载；待页面规模上升后再做，避免与地基迁移混杂。

## 本地校验

```bash
pnpm exec eslint .
pnpm build
```

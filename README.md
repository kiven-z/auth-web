# auth-web-pro

Auth 项目的前端工程，基于 Vue 3 + Vite + Element Plus + Tailwind CSS，TypeScript 全量接入。

> 设计说明、环境搭建、排障记录见姊妹仓库 [auth-docs](../auth-docs)。

s## 环境要求

- Node.js `^20.19.0` 或 `>=22.13.0`
- pnpm `>=9`（已通过 `preinstall` 强制 pnpm，npm/yarn 会被拒绝）

## 快速开始

```bash  
pnpm installpnpm dev            # 开发  
pnpm dev:test       # test 模式  
pnpm build          # 生产构建（rimraf dist + vite build）  
pnpm preview        # 预览构建产物  
```

## 常用脚本

| 命令                                                      | 用途                                 |
|---------------------------------------------------------|------------------------------------|
| `pnpm typecheck`                                        | `tsc` + `vue-tsc` 类型检查             |
| `pnpm lint`                                             | ESLint + Prettier + Stylelint 一次跑完 |
| `pnpm lint:eslint` / `lint:prettier` / `lint:stylelint` | 单独跑                                |
| `pnpm test` / `test:watch`                              | Vitest 单测                          |
| `pnpm test:e2e`                                         | Playwright E2E                     |
| `pnpm test:e2e:local`                                   | 用本机 Chrome 跑 E2E                   |
| `pnpm test:e2e:install`                                 | 安装 Playwright 浏览器                  |
| `pnpm clean:cache`                                      | 清 ESLint 缓存 + 重装依赖                 |

## 目录结构

```  
auth-web-pro  
├── src/  
│   ├── api/            # 接口封装  
│   ├── app/            # 应用级初始化  
│   ├── auth/           # 鉴权相关  
│   ├── components/     # 通用组件（含 ui/ 设计组件）  
│   ├── core/           # 核心运行时  
│   ├── features/       # 业务功能域（按域拆分）  
│   ├── layout/         # 布局  
│   ├── router/         # 路由  
│   ├── services/       # 服务层  
│   ├── shared/         # 跨模块复用  
│   ├── store/          # Pinia store  
│   └── style/          # 全局样式  
├── locales/           # i18n 文案  
├── mock/               # 本地 mock
├── e2e/                # Playwright 用例  
├── build/              # 构建脚本  
└── docker/             # 容器化  
```

## 代码规范

- ESLint + Prettier + Stylelint，提交前跑 `pnpm lint`。
- 禁止无意义 wrapper、双轨 API、Legacy 适配层，规则见 `.cursor/rules/`。
- 提交信息规范见 `.cursor/rules/commit-message.mdc`。

## 赞助

如果这个项目对你有帮助，欢迎打赏支持。

<table>
  <tr>
    <td align="center">
      <img src="./donate/WeChatPay.jpg" width="220" alt="微信" /><br/>
      微信
    </td>
    <td align="center">
      <img src="./donate/AliPay.jpg" width="220" alt="支付宝" /><br/>
      支付宝
    </td>
  </tr>
</table>

## 许可证

Copyright 2024-2026 Bunny。

源码基于 [PolyForm Noncommercial License 1.0.0](./LICENSE) 发布，**商业使用须另行购买授权**

详见 [COMMERCIAL.md](./COMMERCIAL.md)。

import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import * as parserVue from 'vue-eslint-parser';

/** 一级 feature（features 下目录） */
const FEATURES = ['system', 'file', 'home', 'message', 'schedule', 'log', 'ops'];

/** 各 feature 叶子（不含 _shared） */
const FEATURE_LEAVES = {
  system: ['dept', 'menu', 'online-user', 'permission', 'post', 'role', 'user'],
  file: ['export-task', 'record', 'recycle'],
  home: ['error', 'login', 'personal', 'welcome'],
  message: [
    'compose',
    'email-template',
    'in-app-category',
    'in-app-message',
    'in-app-template',
    'send-record',
    'sms-template',
  ],
  schedule: ['schedule-group', 'schedule-log', 'schedule-task'],
  log: ['authorization-audit-log', 'login-log', 'operation-log', 'password-history'],
  ops: ['authorization-invalidation-event', 'authorization-invalidation-outbox', 'authorization-invalidation-stats'],
};

const SOURCE_GLOB = '**/*.{ts,tsx,vue,js,jsx}';

const COMPONENT_DEEP_IMPORT_PATTERN = {
  group: ['@/components/**/src', '@/components/**/src/**'],
  message: '只允许从组件包根引入（index.ts），禁止 @/components/.../src/... 深路径',
};

const VIEWS_FORBIDDEN_PATTERN = {
  group: ['@/views', '@/views/**'],
  message: '禁止 @/views；路由页面位于 @/features/<domain>/<leaf>/pages/...',
};

const DOMAIN_API_MODULES = ['file', 'log', 'message', 'ops', 'schedule', 'system'];

const DOMAIN_API_AT_ROOT_PATTERN = {
  group: DOMAIN_API_MODULES.flatMap((domain) => [`@/api/${domain}`, `@/api/${domain}/**`]),
  message: '域 API 位于 @/features/<domain>/api/...；平台仅保留 @/api/common 与 @/api/auth',
};

/**
 * @param {Array<{ group: string[], message: string }>} patterns
 * @returns {[string, { patterns: object[] }]}
 */
function restrictedImports(patterns) {
  return [
    'error',
    {
      patterns: [COMPONENT_DEEP_IMPORT_PATTERN, VIEWS_FORBIDDEN_PATTERN, DOMAIN_API_AT_ROOT_PATTERN, ...patterns],
    },
  ];
}

/**
 * 禁止引用某 feature 的 UI（叶子 / _shared）；允许其 api
 * @param {string} feature
 */
function featureUiPatterns(feature) {
  const leaves = FEATURE_LEAVES[feature] ?? [];
  return [
    {
      group: [`@/features/${feature}/_shared`, `@/features/${feature}/_shared/**`],
      message: `禁止依赖 @/features/${feature}/_shared；跨域契约请用 @/features/${feature}/api`,
    },
    ...leaves.map((leaf) => ({
      group: [`@/features/${feature}/${leaf}`, `@/features/${feature}/${leaf}/**`],
      message: `禁止依赖 @/features/${feature}/${leaf}；跨域契约请用 @/features/${feature}/api`,
    })),
  ];
}

/**
 * 禁止引用其他一级 feature 的 UI（api 可跨域）
 * @param {string} feature
 * @param {string[]} [allowFeatures] 额外放行的 feature（仍需自行限制叶子）
 */
function crossFeaturePatterns(feature, allowFeatures = []) {
  const allow = new Set(allowFeatures);
  return FEATURES.filter((item) => item !== feature && !allow.has(item)).flatMap((other) => featureUiPatterns(other));
}

/**
 * 禁止引用同 feature 其他叶子
 * @param {string} feature
 * @param {string} leaf
 */
function siblingLeafPatterns(feature, leaf) {
  const leaves = FEATURE_LEAVES[feature] ?? [];
  return leaves
    .filter((item) => item !== leaf)
    .map((sibling) => ({
      group: [`@/features/${feature}/${sibling}`, `@/features/${feature}/${sibling}/**`],
      message: `禁止同 feature 叶子互引：不可引用 @/features/${feature}/${sibling}；请抽到 @/features/${feature}/_shared`,
    }));
}

/**
 * _shared 禁止依赖本 feature 叶子
 * @param {string} feature
 */
function sharedLeafPatterns(feature) {
  const leaves = FEATURE_LEAVES[feature] ?? [];
  return leaves.map((leaf) => ({
    group: [`@/features/${feature}/${leaf}`, `@/features/${feature}/${leaf}/**`],
    message: `_shared 禁止依赖叶子模块：不可引用 @/features/${feature}/${leaf}`,
  }));
}

/**
 * 叶子内路由页（pages）与叶子其它代码共用的跨界限制
 * @param {string} feature
 * @param {string} leaf
 */
function leafBoundaryPatterns(feature, leaf) {
  if (feature === 'home' && leaf === 'personal') {
    return [
      ...crossFeaturePatterns('home'),
      ...siblingLeafPatterns('home', 'personal'),
      {
        group: [
          '../../../file/record',
          '../../../file/record/**',
          '../../../file/recycle',
          '../../../file/recycle/**',
          '../../../file/export-task',
          '../../../file/export-task/**',
        ],
        message:
          '个人空间仅可依赖 file/api 与 components/domain/file；请使用 @/features/file/api 或 @/components/domain/file，禁止相对路径引用运维叶子',
      },
    ];
  }

  return [...crossFeaturePatterns(feature), ...siblingLeafPatterns(feature, leaf)];
}

/**
 * 生成 features feature / leaf / pages / _shared / api 边界配置块
 *
 * 叶子约定：`pages/` 为路由入口；`hooks` / `components` / `constants` 等为叶子内部能力。
 */
function buildFeatureBoundaryConfigs() {
  /** @type {object[]} */
  const configs = [];

  for (const feature of FEATURES) {
    const leaves = FEATURE_LEAVES[feature] ?? [];

    // feature 根与未单独覆盖的路径：禁止跨 feature UI
    configs.push({
      files: [`src/features/${feature}/${SOURCE_GLOB}`],
      rules: {
        'no-restricted-imports': restrictedImports(crossFeaturePatterns(feature)),
      },
    });

    // 域 api：不得依赖任何 feature UI（含本域 pages / 叶子）
    configs.push({
      files: [`src/features/${feature}/api/${SOURCE_GLOB}`],
      rules: {
        'no-restricted-imports': restrictedImports(FEATURES.flatMap((item) => featureUiPatterns(item))),
      },
    });

    if (leaves.length > 0) {
      configs.push({
        files: [`src/features/${feature}/_shared/${SOURCE_GLOB}`],
        rules: {
          'no-restricted-imports': restrictedImports([
            ...crossFeaturePatterns(feature),
            ...sharedLeafPatterns(feature),
          ]),
        },
      });
    }

    for (const leaf of leaves) {
      const boundary = leafBoundaryPatterns(feature, leaf);

      // 叶子整体（含 hooks / components / constants 等）
      configs.push({
        files: [`src/features/${feature}/${leaf}/${SOURCE_GLOB}`],
        rules: {
          'no-restricted-imports': restrictedImports(boundary),
        },
      });

      // pages：路由页面入口，边界与叶子一致（显式声明，便于后续单独收紧）
      configs.push({
        files: [`src/features/${feature}/${leaf}/pages/${SOURCE_GLOB}`],
        rules: {
          'no-restricted-imports': restrictedImports(boundary),
        },
      });
    }
  }

  return configs;
}

const PLATFORM_BAN_ALL_FEATURES = {
  group: ['@/features', '@/features/**'],
  message: 'api/common|auth 与 auth 运行时禁止依赖 features',
};

export default defineConfig([
  globalIgnores(['**/.*', 'dist/*', '*.d.ts', 'public/*', 'src/assets/**', 'src/**/iconfont/**']),
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        // types/index.d.ts
        RefType: 'readonly',
        EmitType: 'readonly',
        TargetContext: 'readonly',
        ComponentRef: 'readonly',
        ElRef: 'readonly',
        ForDataType: 'readonly',
        AnyFunction: 'readonly',
        PropType: 'readonly',
        Writable: 'readonly',
        Nullable: 'readonly',
        NonNullable: 'readonly',
        Recordable: 'readonly',
        ReadonlyRecordable: 'readonly',
        Indexable: 'readonly',
        DeepPartial: 'readonly',
        Without: 'readonly',
        Exclusive: 'readonly',
        TimeoutHandle: 'readonly',
        IntervalHandle: 'readonly',
        Effect: 'readonly',
        ChangeEvent: 'readonly',
        WheelEvent: 'readonly',
        ImportMetaEnv: 'readonly',
        Fn: 'readonly',
        PromiseFn: 'readonly',
        ComponentElRef: 'readonly',
        parseInt: 'readonly',
        parseFloat: 'readonly',
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      'no-debugger': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  ...tseslint.config({
    extends: [...tseslint.configs.recommended],
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
    rules: {
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-restricted-imports': restrictedImports([]),
    },
  }),
  {
    files: ['**/*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'import/no-duplicates': 'off',
      'no-restricted-syntax': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.?([cm])js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        $: 'readonly',
        $$: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $toRef: 'readonly',
      },
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      vue: pluginVue,
    },
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs.essential.rules,
      ...pluginVue.configs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/multi-word-component-names': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/no-setup-props-reactivity-loss': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-restricted-imports': restrictedImports([]),
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
  // components / shared / core：可引用域 api，禁止 feature UI
  {
    files: [`src/components/${SOURCE_GLOB}`, `src/shared/${SOURCE_GLOB}`, `src/core/${SOURCE_GLOB}`],
    rules: {
      'no-restricted-imports': restrictedImports(FEATURES.flatMap((feature) => featureUiPatterns(feature))),
    },
  },
  // 平台 api / auth：禁止依赖 features
  {
    files: [`src/api/${SOURCE_GLOB}`, `src/auth/${SOURCE_GLOB}`],
    rules: {
      'no-restricted-imports': restrictedImports([PLATFORM_BAN_ALL_FEATURES]),
    },
  },
  ...buildFeatureBoundaryConfigs(),
]);

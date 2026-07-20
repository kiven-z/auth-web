<script lang="ts" setup>
import type { MenuFormModel } from '@/api/system/menu';
import { getMenuList } from '@/api/system/menu';
import AnimateSelector from '@/components/ui/AnimateSelecto/src/index.vue';
import IconSelect from '@/components/ui/Icon/src/Select.vue';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { handleTree, TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { transformI18n } from '@/app/plugins/i18n';
import { errorMessage } from '@/services/feedback/message';
import MenuTypeIframeDialog from '@/views/system/menu/components/MenuTypeIframeDialog.vue';
import MenuTypeLinkDialog from '@/views/system/menu/components/MenuTypeLinkDialog.vue';
import MenuTypeMenuDialog from '@/views/system/menu/components/MenuTypeMenuDialog.vue';
import { MENU_TYPE_OPTIONS, MenuTypeEnums } from '@/views/system/menu/constants/menu-type';
import { findMenuIdPath } from '@/views/system/menu/utils/menu-tree';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface MenuDialogProps {
  isFormDisabled?: boolean;
  /** 预填字段；未传字段由弹窗内默认值补齐 */
  form?: Partial<MenuFormModel>;
}

type IconInputMode = 'select' | 'manual';

interface DeptNode {
  id: string;
  value: string;
  parentId: string | null;
  label: string;
  name: string;
  children?: DeptNode[];
}

const props = withDefaults(defineProps<MenuDialogProps>(), {
  isFormDisabled: false,
  form: () => ({}) as MenuFormModel,
});

// IconSelect 内置 Tab 前缀；其它 Iconify 集合默认走手动输入模式
const BUILTIN_ICON_PREFIXES = ['ep:', 'ri:', 'fa-solid:'] as const;
// Iconify 官网
const ICONIFY_ICON_SETS_URL = 'https://icon-sets.iconify.design/';

const animationType = ref<'all' | 'detail'>('all');

const iconModeSegmentOptions = computed(() => [
  { label: t('menus.iconPickerBuiltin'), value: 'select' as const },
  { label: t('menus.iconPickerManual'), value: 'manual' as const },
]);

/**
 * 根据图标字符串确定输入模式
 * @param icon 图标字符串
 * @returns 输入模式
 */
function deriveIconInputMode(icon: string | undefined | null): IconInputMode {
  const iconValue = (icon ?? '').trim();
  if (!iconValue) {
    return 'select';
  }
  const lower = iconValue.toLowerCase();
  return BUILTIN_ICON_PREFIXES.some((prefix) => lower.startsWith(prefix)) ? 'select' : 'manual';
}

const { t } = useI18n();

const formRef = ref<FormInstance>();
const form = ref<MenuFormModel>({
  parentId: TREE_ROOT_PARENT_ID,
  menuType: MenuTypeEnums.MENU,
  menuRank: 0,
  showLink: true,
  publicAccess: false,
  showParent: true,
  keepAlive: false,
  status: true,
  hiddenTag: false,
  fixedTag: false,
  frameLoading: true,
  dynamicLevel: 1,
  ...props.form,
} as MenuFormModel);

// 表单规则
const rules = computed<FormRules>(() => ({
  menuType: [{ required: true, message: t('menus.rules.menuType'), trigger: 'change' }],
  title: [{ required: true, message: t('menus.rules.title'), trigger: 'blur' }],
  name: [{ required: true, message: t('menus.rules.name'), trigger: 'blur' }],
  path: [{ required: true, message: t('menus.rules.path'), trigger: 'blur' }],
}));

const menuCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: true,
};

const deptTree = ref<DeptNode[]>([]);
const parentIdPath = ref<string[]>([]);

const typeSegmentOptions = computed(() =>
  MENU_TYPE_OPTIONS.map((item) => ({ label: t(String(item.labelKey)), value: item.value }))
);

const iconInputMode = ref<IconInputMode>(deriveIconInputMode(form.value.icon));
const extraIconInputMode = ref<IconInputMode>(deriveIconInputMode(form.value.extraIcon));

/**
 * 加载扁平菜单并构造父级级联树
 */
const loadMenuTree = async () => {
  try {
    const list = await getMenuList({});
    const nodes = (list ?? []).map((item) => ({
      id: item.id,
      value: item.id,
      parentId: item.parentId,
      label: transformI18n(item.title),
      name: item.name,
    }));
    deptTree.value = handleTree(nodes, 'id', 'parentId', 'children') as DeptNode[];
    parentIdPath.value = findMenuIdPath(deptTree.value, form.value.parentId ?? null);
  } catch (e: unknown) {
    errorMessage(e);
    deptTree.value = [];
  }
};

watch(parentIdPath, (path) => {
  const next = path.length ? path[path.length - 1]! : null;
  const cur = form.value.parentId ?? null;
  if (next !== cur) {
    form.value.parentId = next;
  }
});

onMounted(() => {
  loadMenuTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
    <el-form-item :label="t('menus.menuType')" prop="menuType">
      <el-segmented v-model="form.menuType" :options="typeSegmentOptions" class="w-full" />
    </el-form-item>

    <el-row :gutter="14">
      <el-col :span="24">
        <el-form-item :label="t('menus.parentId')" prop="parentId">
          <el-cascader
            v-model="parentIdPath"
            :debounce="400"
            :disabled="isFormDisabled"
            :options="deptTree"
            :placeholder="t('menus.placeholder.parentId')"
            :props="menuCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ node, data: { name } }">
              {{ node.label }}
              <el-text v-show="name" type="info">({{ name }})</el-text>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.dialogTitle')" prop="title">
          <el-input
            v-model="form.title"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.title')"
            clearable
          />
          <el-text type="info">🌐I18n：{{ transformI18n(form.title) }}</el-text>
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item
          v-if="form.menuType === MenuTypeEnums.EXTERNAL_LINK"
          :label="t('menus.outsideChainName')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.outsideChainName')"
            clearable
          />
        </el-form-item>

        <el-form-item v-else :label="t('menus.dialogName')" prop="name">
          <el-input
            v-model="form.name"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.routerName')"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.dialogPath')" prop="path">
          <el-input
            v-model="form.path"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.path')"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.menuRank')" prop="menuRank">
          <el-input-number
            v-model="form.menuRank"
            :disabled="isFormDisabled"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.icon')" prop="icon">
          <div class="flex w-full flex-col gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <component :is="useRenderIcon(form.icon)" v-if="form.icon" class="shrink-0 text-lg" />
              <el-link
                :href="ICONIFY_ICON_SETS_URL"
                rel="noopener noreferrer"
                target="_blank"
                type="primary"
                underline="never"
              >
                {{ t('menus.iconifyLibrary') }}
              </el-link>
              <el-segmented v-model="iconInputMode" :options="iconModeSegmentOptions" />
            </div>
            <IconSelect v-if="iconInputMode === 'select'" v-model="form.icon" class="w-full!" />
            <el-input
              v-else
              v-model="form.icon"
              :disabled="isFormDisabled"
              :placeholder="t('menus.placeholder.iconManual')"
              clearable
            />
          </div>
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.rightExtraIcon')" prop="extraIcon">
          <div class="flex w-full flex-col gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <component :is="useRenderIcon(form.extraIcon)" v-if="form.extraIcon" class="shrink-0 text-lg" />
              <el-link
                :href="ICONIFY_ICON_SETS_URL"
                rel="noopener noreferrer"
                target="_blank"
                type="primary"
                underline="never"
              >
                {{ t('menus.iconifyLibrary') }}
              </el-link>
              <el-segmented v-model="extraIconInputMode" :options="iconModeSegmentOptions" />
            </div>
            <IconSelect v-if="extraIconInputMode === 'select'" v-model="form.extraIcon" class="w-full!" />
            <el-input
              v-else
              v-model="form.extraIcon"
              :disabled="isFormDisabled"
              :placeholder="t('menus.placeholder.rightExtraIconManual')"
              clearable
            />
          </div>
        </el-form-item>
      </el-col>

      <menu-type-menu-dialog
        v-show="form.menuType === MenuTypeEnums.MENU"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <menu-type-iframe-dialog
        v-show="form.menuType === MenuTypeEnums.IFRAME"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <menu-type-link-dialog
        v-show="form.menuType === MenuTypeEnums.EXTERNAL_LINK"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <el-col :span="24">
        <el-form-item :label="t('menus.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.remark')"
            :rows="3"
            maxlength="200"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <el-space class="w-full" direction="vertical">
        <el-radio-group v-model="animationType">
          <el-radio-button value="all">{{ t('menus.tips.simpleAnimation') }}</el-radio-button>
          <el-radio-button value="detail">{{ t('menus.tips.detailAnimation') }}</el-radio-button>
        </el-radio-group>

        <div class="warning-container">
          <el-text
            class="warning-title animate__animated animate__headShake animate__infinite"
            size="large"
            type="danger"
          >
            {{ t('menus.tips.useAnimationCautionaryNotes') }}
          </el-text>

          <div class="warning-content">
            <el-text class="warning-item">
              <span class="warning-label">{{ t('menus.tips.displayProblem') }}</span>
              {{ t('menus.tips.displayProblemTips') }}
            </el-text>

            <el-text class="warning-item">
              <span class="warning-label">{{ t('menus.tips.performanceProblem') }}</span>
              {{ t('menus.tips.performanceProblemTips') }}
            </el-text>

            <el-text class="warning-item">
              <span class="warning-label">{{ t('menus.tips.functionException') }}</span>
              {{ t('menus.tips.functionExceptionTips') }}
            </el-text>
          </div>
        </div>

        <el-form-item v-show="animationType === 'all'" :label="t('menus.transitionName')" prop="transitionName">
          <el-input
            v-model="form.transitionName"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.transitionName')"
            clearable
          />
        </el-form-item>

        <el-row v-show="animationType === 'detail'" :gutter="16">
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.enterTransition')" prop="enterTransition">
              <AnimateSelector
                v-model="form.enterTransition"
                :placeholder="t('menus.placeholder.enterTransition')"
                class="w-[320px]!"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.leaveTransition')" prop="leaveTransition">
              <AnimateSelector
                v-model="form.leaveTransition"
                :placeholder="t('menus.placeholder.leaveTransition')"
                class="w-[320px]!"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-space>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.warning-container {
  padding: 16px;
  margin: 16px 0;
  background-color: var(--el-color-danger-light-9);
  border: 1px solid var(--el-color-danger-light-5);
  border-radius: 8px;

  .warning-title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-weight: bold;

    .warning-icon {
      margin-right: 8px;
      font-size: 20px;
    }
  }

  .warning-content {
    .warning-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .warning-label {
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>

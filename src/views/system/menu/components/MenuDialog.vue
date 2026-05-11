<script lang="ts" setup>
import { getMenuList } from '@/api/system/menu';
import AnimateSelector from '@/components/ui/AnimateSelecto/src/index.vue';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import IconSelect from '@/components/ui/ReIcon/src/Select.vue';
import { MenuTypeEnums } from '@/enums/menuEnums';
import { transformI18n } from '@/plugins/i18n';
import { handleTree } from '@/shared/lib/tree';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInline } from '@/types/commons/base';
import type { MenuForm } from '@/types/system';
import MenuTypeIframeDialog from '@/views/system/menu/components/MenuTypeIframeDialog.vue';
import MenuTypeLinkDialog from '@/views/system/menu/components/MenuTypeLinkDialog.vue';
import MenuTypeMenuDialog from '@/views/system/menu/components/MenuTypeMenuDialog.vue';
import { menuTypeSegmentItems } from '@/views/system/menu/constants/menu-type-segment';
import { createMenuFormRules } from '@/views/system/menu/utils/menu-columns';
import { createEmptyMenuForm } from '@/views/system/menu/utils/menu-form-mapper';
import { findMenuIdPath } from '@/views/system/menu/utils/menu-tree';
import type { CascaderProps, FormInstance } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface MenuFormInline extends FormInline<MenuForm> {
  isFormDisabled?: boolean;
}

const props = withDefaults(defineProps<MenuFormInline>(), {
  isFormDisabled: false,
  formInline: () => createEmptyMenuForm(),
});

const { t } = useI18n();

const formRef = ref<FormInstance>();
const form = ref<MenuForm>({ ...createEmptyMenuForm(), ...props.formInline });

const rules = computed(() => createMenuFormRules(t));

const menuCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: true,
};

type DeptNode = {
  id: string;
  value: string;
  parentId: string | null;
  label: string;
  name: string;
  children?: DeptNode[];
};

const deptTree = ref<DeptNode[]>([]);
const parentIdPath = ref<string[]>([]);

const typeSegmentOptions = computed(() =>
  menuTypeSegmentItems.map((item) => ({ label: t(item.labelKey), value: item.value }))
);

/**
 * 将当前表单的 parentId 同步为 cascader 路径
 */
const syncParentPath = () => {
  parentIdPath.value = findMenuIdPath(deptTree.value, form.value.parentId ?? null);
};

watch(parentIdPath, (path) => {
  const next = path.length ? path[path.length - 1]! : null;
  const cur = form.value.parentId ?? null;
  if (next !== cur) {
    form.value.parentId = next;
  }
});

watch(
  () => props.formInline,
  (v) => {
    form.value = { ...createEmptyMenuForm(), ...(v ?? {}) };
    syncParentPath();
  },
  { deep: true }
);

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
    syncParentPath();
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.loadFailed' });
    deptTree.value = [];
  }
};

onMounted(() => {
  void loadMenuTree();
});

const animationType = ref<'all' | 'detail'>('all');

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
          <div class="w-full flex items-center gap-2">
            <component :is="useRenderIcon(form.icon)" v-if="form.icon" class="shrink-0 text-lg" />
            <IconSelect v-model="form.icon" class="flex-1!" />
          </div>
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.rightExtraIcon')" prop="extraIcon">
          <div class="w-full flex items-center gap-2">
            <component :is="useRenderIcon(form.extraIcon)" v-if="form.extraIcon" class="shrink-0 text-lg" />
            <IconSelect v-model="form.extraIcon" class="flex-1!" />
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

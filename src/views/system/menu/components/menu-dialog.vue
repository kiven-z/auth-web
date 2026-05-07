<script lang="ts" setup>
import { queryMenuList } from '@/api/system/menu';
import ReAnimateSelector from '@/components/ReAnimateSelector/src/index.vue';
import IconSelect from '@/components/ReIcon/src/Select.vue';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { API_SUCCESS_CODE } from '@/config/http-config';
import { MenuTypeEnums } from '@/enums/menuEnums';
import { transformI18n } from '@/plugins/i18n';
import { useRoleStoreHook } from '@/store/modules/system/role';
import { FormInline } from '@/types/commons/base';
import { MenuForm } from '@/types/system';
import { loadMessage, message } from '@/utils/base/message';
import { handleTree } from '@/utils/tree';
import MenuTypeIframeDialog from '@/views/system/menu/components/menu-type-iframe-dialog.vue';
import MenuTypeLinkDialog from '@/views/system/menu/components/menu-type-link-dialog.vue';
import MenuTypeMenuDialog from '@/views/system/menu/components/menu-type-menu-dialog.vue';
import { rules } from '@/views/system/menu/utils/menu-columns';
import { CascaderProps, FormInstance } from 'element-plus';
import { isEmpty } from 'lodash';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface MenuFormInline extends FormInline<MenuForm> {
  isFormDisabled?: boolean;
}

const props = withDefaults(defineProps<MenuFormInline>(), {
  isFormDisabled: () => false,
  formInline: () => ({
    /**
     * 父菜单ID(0表示一级菜单)
     */
    parentId: undefined,
    /**
     * 菜单类型(0=菜单,1=iframe,2=外链)
     */
    menuType: undefined,
    /**
     * 路由路径(唯一)
     */
    path: undefined,
    /**
     * 路由名称(必须唯一)
     */
    name: undefined,
    /**
     * 路由重定向
     */
    redirect: undefined,
    /**
     * 组件路径
     */
    component: undefined,
    /**
     * 菜单标题(显示用)
     */
    title: undefined,
    /**
     * 菜单图标
     */
    icon: undefined,
    /**
     * 是否在菜单中显示(0=否,1=是)
     */
    showLink: undefined,
    /**
     * 菜单排序(值越高排的越后)
     */
    menuRank: undefined,
    /**
     * 菜单名称右侧的额外图标
     */
    extraIcon: undefined,
    /**
     * 是否显示父级菜单(0=否,1=是)
     */
    showParent: undefined,
    /**
     * 页面级别权限设置(角色数组)
     */
    roles: undefined,
    /**
     * 按钮级别权限设置(权限数组)
     */
    auths: undefined,
    /**
     * 是否缓存该路由页面(0=否,1=是)
     */
    keepAlive: undefined,
    /**
     * 需要内嵌的iframe链接地址
     */
    frameSrc: undefined,
    /**
     * iframe页面是否开启首次加载动画(0=否,1=是)
     */
    frameLoading: undefined,
    /**
     * 页面动画(vue内置transitions动画)
     */
    transitionName: undefined,
    /**
     * 页面进场动画(animate.css动画名)
     */
    enterTransition: undefined,
    /**
     * 页面离场动画(animate.css动画名)
     */
    leaveTransition: undefined,
    /**
     * 是否禁止添加到标签页(0=否,1=是)
     */
    hiddenTag: undefined,
    /**
     * 标签页显示的最大数量
     */
    dynamicLevel: undefined,
    /**
     * 指定激活菜单的path
     */
    activePath: undefined,
    /**
     * 是否固定标签(0=否,1=是)
     */
    fixedTag: undefined,
    /**
     * 启用状态(true=启用菜单，false=停用)
     */
    status: undefined,
    /**
     * 路由元数据(扩展用)
     */
    meta: undefined,
    /**
     * 备注信息
     */
    remark: undefined,
  }),
});

const menuCascaderProps: CascaderProps = {
  // 是否严格的遵守父子节点不互相关联
  checkStrictly: true,
};

const { t } = useI18n();

const formRef = ref<FormInstance>();
const form = ref(props.formInline);
const roleStore = useRoleStoreHook();

// 部门树形结构数据
const deptTree = ref([]);

// 主菜单图标切换
const mainIconSwitchFlag = ref(false);

// 额外图图标切换
const extraIconSwitchFlag = ref(false);

// 动画类型
const animationType = ref('all');

// 角色列表
const roleList = ref([]);
const roleListLoading = ref(false);

/**
 * 获取系统菜单列表
 * @description 获取系统菜单列表并转换为树形结构存储到deptTree中
 */
const getMenuList = async () => {
  // 获取系统菜单列表
  const result = await queryMenuList({});

  if (result.code !== API_SUCCESS_CODE) {
    message(result.message, { type: 'error' });
  }

  const nodes = result.data.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: transformI18n(item.title),
    name: item.name,
  }));

  deptTree.value = handleTree(nodes);
};

/**
 * 获取角色列表
 * @description 从角色仓库获取角色数据并赋值给角色列表
 * @returns {Promise<void>} 无返回值的异步函数
 */
const loadRoleListByKeyword = async (keyword?: string): Promise<void> => {
  roleListLoading.value = true;
  const callback = loadMessage(t('menus.tips.loadMenuTree'));

  roleList.value = await roleStore.loadRoleListByKeyword({ keyword });

  callback.close();
  roleListLoading.value = false;
};

/**
 * 部门选择变化处理函数
 * @param path - 部门路径数组，包含从根节点到当前节点的完整路径
 */
const onMenuChange = (path: Array<string> | undefined) => {
  // 如果路径数组为空，则直接返回
  if (isEmpty(path)) {
    return;
  }

  // 设置表单的父级ID为路径数组的最后一个元素
  form.value.parentId = path.at(-1);
};

onMounted(() => {
  getMenuList();
  loadRoleListByKeyword(undefined);
});

defineExpose({ formRef });
</script>

<template>
  <!-- 通用页面 -->
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
    <!-- 菜单类型(0=菜单,1=iframe,2=外链) -->
    <el-form-item :label="t('menus.menuType')" prop="menuType">
      <el-segmented
        v-model="form.menuType"
        :options="
          Object.values(MenuTypeEnums)
            .filter((value) => isNaN(Number(value)))
            .map((value) => ({ label: value, value: MenuTypeEnums[value] }))
        "
        class="w-full"
      />
    </el-form-item>

    <el-row v-show="form.menuType !== MenuTypeEnums['按钮']" :gutter="14">
      <!-- 父级菜单 -->
      <el-col :span="24">
        <el-form-item :label="t('menus.parentId')" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :debounce="400"
            :disabled="isFormDisabled"
            :options="deptTree"
            :placeholder="t('menus.placeholder.parentId')"
            :props="menuCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
            @change="onMenuChange"
          >
            <template #default="{ node, data: { name } }">
              {{ node.label }}
              <el-text v-show="name" type="info">({{ name }})</el-text>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>

      <!-- 菜单标题 -->
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

      <!-- 路由名称 -->
      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item v-if="form.menuType === MenuTypeEnums['外链']" :label="t('menus.outsideChainName')" prop="name">
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

      <!-- 路由路径 -->
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

      <!-- 菜单排序 -->
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

      <!-- 菜单图标 -->
      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.icon')" prop="icon">
          <template #label="{ label }">
            {{ label }}
            <el-button link type="primary" @click="mainIconSwitchFlag = !mainIconSwitchFlag">
              {{ t('menus.tips.switchInputMethod') }}
            </el-button>
          </template>

          <div v-if="mainIconSwitchFlag" class="w-full">
            <el-input
              v-model="form.icon"
              :disabled="isFormDisabled"
              :placeholder="t('menus.placeholder.icon')"
              clearable
            >
              <template #prepend>
                <component :is="useRenderIcon(form.icon)" v-if="form.icon" />
              </template>

              <template #append>
                <el-link :underline="false" href="https://icon-sets.iconify.design/" target="_blank" type="primary">
                  {{ t('menus.tips.openIconOnline') }}
                </el-link>
              </template>
            </el-input>
          </div>

          <IconSelect v-else v-model="form.icon" :placeholder="t('menus.placeholder.iconSelect')" class="w-full" />
        </el-form-item>
      </el-col>

      <!-- 右侧额外图标 -->
      <el-col :lg="8" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('menus.rightExtraIcon')" prop="extraIcon">
          <template #label="{ label }">
            {{ label }}
            <el-button link type="primary" @click="extraIconSwitchFlag = !extraIconSwitchFlag">
              {{ t('menus.tips.switchInputMethod') }}
            </el-button>
          </template>

          <div v-if="extraIconSwitchFlag" class="w-full">
            <el-input
              v-model="form.extraIcon"
              :disabled="isFormDisabled"
              :placeholder="t('menus.placeholder.rightExtraIcon')"
              clearable
            >
              <template #prepend>
                <component :is="useRenderIcon(form.extraIcon)" v-if="form.extraIcon" />
              </template>

              <template #append>
                <el-link :underline="false" href="https://icon-sets.iconify.design/" target="_blank" type="primary">
                  {{ t('menus.tips.openIconOnline') }}
                </el-link>
              </template>
            </el-input>
          </div>
          <IconSelect
            v-else
            v-model="form.extraIcon"
            :placeholder="t('menus.placeholder.rightExtraIcon')"
            class="w-full"
          />
        </el-form-item>
      </el-col>

      <!-- 菜单页面 -->
      <menu-type-menu-dialog
        v-show="form.menuType === MenuTypeEnums['菜单']"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <!-- Iframe -->
      <menu-type-iframe-dialog
        v-show="form.menuType === MenuTypeEnums['Iframe']"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <!-- 外链 -->
      <menu-type-link-dialog
        v-show="form.menuType === MenuTypeEnums['外链']"
        v-model:form="form"
        :formDisabled="isFormDisabled"
      />

      <!-- 分配角色 -->
      <el-col :span="24">
        <el-form-item :label="t('role.assignRoleTitle')" prop="roles">
          <el-select
            v-model="form.roles"
            :disabled="isFormDisabled"
            :loading="roleListLoading"
            :placeholder="t('role.placeholder.assignRoleTitle')"
            :remote-method="loadRoleListByKeyword"
            clearable
            filterable
            multiple
            remote
            tag-type="success"
          >
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
              <template #default>{{ item.roleName }}({{ item.roleCode }})</template>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- 备注信息 -->
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

      <!-- 设置动画 -->
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

        <el-form-item v-show="animationType === 'all'" :label="t('menus.menuType')" prop="transitionName">
          <ReAnimateSelector
            v-model="form.transitionName"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.leaveTransition')"
            clearable
          />
        </el-form-item>

        <el-row v-show="animationType === 'detail'" :gutter="16">
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.enterTransition')" prop="enterTransition">
              <ReAnimateSelector
                v-model="form.enterTransition"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.enterTransition')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.leaveTransition')" prop="leaveTransition">
              <ReAnimateSelector
                v-model="form.leaveTransition"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.leaveTransition')"
                clearable
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

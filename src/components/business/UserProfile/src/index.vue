<script lang="ts" setup>
import { getUserProfile, type SysUserDeptProfileItem, type SysUserPostProfileItem } from '@/api/system/user-base';
import ReDescription from '@/components/ui/Description/index';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import { errorMessage } from '@/ui/feedback/message';
import { QuestionFilled, User } from '@element-plus/icons-vue';
import { ElTooltip } from 'element-plus';
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  userId: { type: String as PropType<string | undefined>, required: false },
});

const { t } = useI18n();

const { userColumns, deptColumns, postColumns } = useUserProfileColumns();

const loading = ref(false);
const userDetailInfo = ref<Record<string, unknown>[]>([]);
const deptInfos = ref<SysUserDeptProfileItem[]>([]);
const postInfos = ref<SysUserPostProfileItem[]>([]);

/**
 * 按 userId 拉取用户档案并拆分为基本信息与部门、岗位列表。
 */
const loadUserDetailInfo = async () => {
  if (!props.userId) {
    userDetailInfo.value = [];
    deptInfos.value = [];
    postInfos.value = [];
    return;
  }

  loading.value = true;
  try {
    const data = await getUserProfile(props.userId);
    const { deptList, postList, ...userRow } = data;
    userDetailInfo.value = [userRow as Record<string, unknown>];
    deptInfos.value = deptList ?? [];
    postInfos.value = postList ?? [];
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'users.message.loadFailed' });
    userDetailInfo.value = [];
    deptInfos.value = [];
    postInfos.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.userId,
  () => {
    loadUserDetailInfo();
  },
  { immediate: true }
);
</script>

<template>
  <div class="user-dept-info-container">
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">{{ t('users.section.baseInfo') }}</h3>
        <el-tag type="primary">{{ t('users.section.profile') }}</el-tag>
      </div>
      <ReDescription
        v-loading="loading"
        :column="2"
        :columns="userColumns"
        :data="userDetailInfo"
        border
        class="mb-4 overflow-x-auto"
      />
    </div>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">{{ t('dept.tips.affiliatedDeptInfo') }}</h3>
        <el-badge :value="deptInfos.length" class="badge" type="success" />
      </div>

      <el-empty v-if="deptInfos.length === 0 && !loading" :description="t('users.tips.noDeptInfo')" :image-size="100" />

      <el-collapse v-else accordion class="dept-collapse">
        <el-collapse-item v-for="dept in deptInfos" :key="dept.deptId" :name="dept.deptId" :title="dept.deptName">
          <ReDescription
            v-loading="loading"
            :column="2"
            :columns="deptColumns"
            :data="[dept]"
            border
            row-key="deptId"
          />
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-divider>
      <div class="divider-content">
        <el-icon>
          <User />
        </el-icon>
        <span>{{ t('users.section.postInfo') }}</span>
        <el-tooltip :content="t('users.tips.showUserPostInfoTip')" placement="top">
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
    </el-divider>

    <div class="section">
      <div class="section-header">
        <h4 class="section-subtitle">{{ t('post.tips.affiliatedPostInfo') }}</h4>
        <el-badge :value="postInfos.length" class="badge" type="warning" />
      </div>

      <el-empty
        v-if="postInfos.length === 0 && !loading"
        :description="t('users.tips.currentUserHasNotPostInfo')"
        :image-size="100"
      />

      <el-collapse v-else accordion class="post-collapse">
        <el-collapse-item v-for="post in postInfos" :key="post.id" :name="post.id" :title="post.postName">
          <ReDescription v-loading="loading" :column="2" :columns="postColumns" :data="[post]" border />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'index';
</style>

<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import useUserPageState from '@/views/system/user/hooks/useUserPageState';
import useUserTableColumns from '@/views/system/user/hooks/useUserTableColumns';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserTablePanel',
});

const { t } = useI18n();
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm } = tableState;
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 用户名 -->
      <el-form-item :label="t('users.username')" prop="username">
        <el-input v-model="searchForm.username" class="w-45!" clearable />
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item :label="t('users.nickname')" prop="nickname">
        <el-input v-model="searchForm.nickname" class="w-45!" clearable />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="t('users.phone')" prop="phone">
        <el-input v-model="searchForm.phone" class="w-45!" clearable />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item :label="t('users.email')" prop="email">
        <el-input v-model="searchForm.email" class="w-45!" clearable />
      </el-form-item>
      <!-- 工号 -->
      <el-form-item :label="t('dept.employeeNo')" prop="employeeNo">
        <el-input v-model="searchForm.employeeNo" class="w-45!" clearable />
      </el-form-item>

      <!-- FIXME 加入status筛选 -->

      <el-form-item>
        <!-- 搜索 -->
        <el-button :loading="loading" type="primary" @click="fetchUserTable">{{ t('buttons.actionSearch') }}</el-button>
        <!-- 重置 -->
        <el-button @click="resetUserSearch(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="tableState" :title="t('routes.userManagement')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button type="primary">{{ t('buttons.actionAdd') }}</el-button>
          <el-button type="success">批量启用</el-button>
          <el-button type="warning">批量禁用</el-button>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item disabled>从 Excel 导入（敬请期待）</el-dropdown-item>
              <el-dropdown-item>
                {{ t('buttons.exportExcel') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center gap-x-1">
          <!-- 查看 -->
          <el-button link type="primary">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改 -->
          <el-button link type="primary">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 删除 -->
          <el-button link type="danger">{{ t('buttons.actionDelete') }}</el-button>

          <!-- 更多 -->
          <el-dropdown trigger="click">
            <el-button link type="primary">更多</el-button>
            <template #dropdown>
              <el-dropdown-item disabled>分配角色</el-dropdown-item>
              <el-dropdown-item disabled>分配部门</el-dropdown-item>
              <el-dropdown-item disabled>分配岗位</el-dropdown-item>
              <el-dropdown-item disabled>修改密码</el-dropdown-item>
              <el-dropdown-item disabled>用户下线</el-dropdown-item>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>

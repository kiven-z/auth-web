<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { getDeptList } from '@/api/system/dept';
import type { SysPostCreateForm } from '@/api/system/post';
import { errorMessage } from '@/services/feedback/message';
import { buildPostDeptCascaderTree, type PostDeptCascaderNode } from '@/views/system/post/utils/post-dept-cascader';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type PostFormDialogProps = FormDialog<SysPostCreateForm>;

const props = withDefaults(defineProps<PostFormDialogProps>(), {
  form: () => ({}) as SysPostCreateForm,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();
const form = ref<SysPostCreateForm>({
  status: true,
  orderNum: 0,
  ...props.form,
});

const deptCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const deptTree = ref<PostDeptCascaderNode[]>([]);

const rules = reactive<FormRules>({
  deptId: [{ required: true, message: t('post.field.deptName'), trigger: 'change' }],
  postCode: [{ required: true, message: t('post.field.postCode'), trigger: 'blur' }],
  postName: [{ required: true, message: t('post.field.postName'), trigger: 'blur' }],
  status: [{ required: true, message: t('post.field.status'), trigger: 'change' }],
});

/**
 * 加载部门树（含停用部门，节点 disabled 不可选）
 */
const loadDeptTree = async () => {
  try {
    const list = await getDeptList();
    deptTree.value = buildPostDeptCascaderTree(list ?? []);
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'post.messages.loadFailed' });
    deptTree.value = [];
  }
};

onMounted(() => {
  loadDeptTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 岗位编码 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.postCode')" prop="postCode">
          <el-input v-model="form.postCode" :placeholder="t('post.field.postCode')" clearable />
        </el-form-item>
      </el-col>
      <!-- 岗位名称 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.postName')" prop="postName">
          <el-input v-model="form.postName" :placeholder="t('post.field.postName')" clearable />
        </el-form-item>
      </el-col>
      <!-- 所属部门 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.deptName')" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :placeholder="t('post.placeholder.dept')"
            :props="deptCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ data }">
              <span>{{ data.label }}</span>
              <el-text type="info">({{ data.deptCode }})</el-text>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('post.enums.status.normal') }}</el-radio>
            <el-radio :value="false">{{ t('post.enums.status.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 显示顺序 -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <!-- 备注 -->
      <el-col :span="24">
        <el-form-item :label="t('post.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('post.field.remark')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

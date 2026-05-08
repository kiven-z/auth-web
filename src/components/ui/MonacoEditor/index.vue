<script lang="ts" setup>
import { loadMonacoEditor } from '@/components/ui/MonacoEditor/bootstrap';
import type {
  MonacoEditorReadyPayload,
  MonacoFeatureRegistrar,
  MonacoFeatureRegistrationResult,
  MonacoModule,
} from '@/components/ui/MonacoEditor/types';
import type { editor } from 'monaco-editor';
import { CodeEditor } from 'monaco-editor-vue3';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

defineOptions({
  name: 'UiMonacoEditor',
});

interface Props {
  modelValue?: string;
  language?: string;
  theme?: string;
  width?: string | number;
  height?: string | number;
  options?: editor.IStandaloneEditorConstructionOptions;
  registerFeatures?: MonacoFeatureRegistrar;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'html',
  theme: 'vs',
  width: '100%',
  height: '100%',
  options: () => ({}),
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'ready', payload: MonacoEditorReadyPayload): void;
}>();

const editorValue = ref(props.modelValue);
const monacoReady = ref(false);
let monacoApi: MonacoModule | null = null;
let featureRegistration: MonacoFeatureRegistrationResult;

watch(
  () => props.modelValue,
  (value) => {
    if (value !== editorValue.value) {
      editorValue.value = value;
    }
  }
);

watch(editorValue, (value) => {
  emit('update:modelValue', value);
});

const mergedOptions = computed<editor.IStandaloneEditorConstructionOptions>(() => ({
  automaticLayout: true,
  ...props.options,
}));

function onEditorWillMount() {}

function onEditorDidMount(codeEditor: editor.IStandaloneCodeEditor) {
  if (!monacoApi) {
    return;
  }
  const payload = { editor: codeEditor, monaco: monacoApi } as MonacoEditorReadyPayload;
  featureRegistration = props.registerFeatures?.(payload);
  emit('ready', payload);
}

onMounted(async () => {
  monacoApi = await loadMonacoEditor();
  monacoReady.value = true;
});

onUnmounted(() => {
  if (featureRegistration && 'dispose' in featureRegistration) {
    featureRegistration.dispose();
  }
  featureRegistration = undefined;
  monacoApi = null;
});
</script>

<template>
  <div class="monaco-editor-wrapper">
    <CodeEditor
      v-if="monacoReady"
      v-model:value="editorValue"
      :height="height"
      :language="language"
      :options="mergedOptions"
      :theme="theme"
      :width="width"
      @editorDidMount="onEditorDidMount"
      @editorWillMount="onEditorWillMount"
    />
  </div>
</template>

<style scoped>
.monaco-editor-wrapper {
  width: 100%;
  height: 100%;
}
</style>

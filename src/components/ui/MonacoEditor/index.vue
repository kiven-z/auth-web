<script lang="ts" setup>
import { loadMonacoEditor } from '@/components/ui/MonacoEditor/bootstrap';
import type {
  MonacoEditorReadyPayload,
  MonacoFeatureRegistrar,
  MonacoFeatureRegistrationResult,
  MonacoModule,
} from '@/components/ui/MonacoEditor/types';
import type { editor } from 'monaco-editor';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

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

const editorContainerRef = ref<HTMLElement | null>(null);
const applyingExternalValue = ref(false);

let monacoApi: MonacoModule | null = null;
let codeEditor: editor.IStandaloneCodeEditor | null = null;
let modelContentDisposable: { dispose: () => void } | null = null;
let featureRegistration: MonacoFeatureRegistrationResult;

const mergedOptions = computed<editor.IStandaloneEditorConstructionOptions>(() => ({
  automaticLayout: true,
  ...props.options,
}));

function toCssSize(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

const containerStyle = computed(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
}));

watch(
  () => props.modelValue,
  (value) => {
    if (!codeEditor) {
      return;
    }
    const next = value ?? '';
    if (codeEditor.getValue() === next) {
      return;
    }
    applyingExternalValue.value = true;
    codeEditor.setValue(next);
    applyingExternalValue.value = false;
  }
);

watch(
  () => props.language,
  (lang) => {
    const model = codeEditor?.getModel();
    if (model && monacoApi) {
      monacoApi.editor.setModelLanguage(model, lang);
    }
  }
);

watch(
  () => props.theme,
  (theme) => {
    monacoApi?.editor.setTheme(theme);
  }
);

watch(
  mergedOptions,
  (opts) => {
    codeEditor?.updateOptions(opts);
  },
  { deep: true }
);

onMounted(async () => {
  monacoApi = (await loadMonacoEditor()) as unknown as MonacoModule;
  await nextTick();
  const root = editorContainerRef.value;
  if (!root || !monacoApi) {
    return;
  }

  const valueAfterLoad = props.modelValue ?? '';
  codeEditor = monacoApi.editor.create(root, {
    value: valueAfterLoad,
    language: props.language,
    theme: props.theme,
    ...mergedOptions.value,
  });

  const latest = props.modelValue ?? '';
  if (codeEditor.getValue() !== latest) {
    applyingExternalValue.value = true;
    codeEditor.setValue(latest);
    applyingExternalValue.value = false;
  }

  modelContentDisposable = codeEditor.onDidChangeModelContent(() => {
    if (applyingExternalValue.value) {
      return;
    }
    emit('update:modelValue', codeEditor!.getValue());
  });

  const payload = { editor: codeEditor, monaco: monacoApi } as MonacoEditorReadyPayload;
  featureRegistration = props.registerFeatures?.(payload);
  emit('ready', payload);
});

onUnmounted(() => {
  modelContentDisposable?.dispose();
  modelContentDisposable = null;
  if (featureRegistration && 'dispose' in featureRegistration) {
    featureRegistration.dispose();
  }
  featureRegistration = undefined;
  codeEditor?.dispose();
  codeEditor = null;
  monacoApi = null;
});
</script>

<template>
  <div class="monaco-editor-wrapper">
    <div ref="editorContainerRef" :style="containerStyle" class="monaco-editor-container" />
  </div>
</template>

<style scoped>
.monaco-editor-wrapper {
  width: 100%;
}

.monaco-editor-container {
  min-height: 120px;
}
</style>

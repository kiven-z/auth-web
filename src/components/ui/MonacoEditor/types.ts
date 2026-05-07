import type { editor } from 'monaco-editor';

export type MonacoModule = typeof import('monaco-editor');

export interface MonacoEditorReadyPayload {
  editor: editor.IStandaloneCodeEditor;
  monaco: MonacoModule;
}

export type MonacoFeatureRegistrationResult = void | { dispose: () => void };

export type MonacoFeatureRegistrar = (payload: MonacoEditorReadyPayload) => MonacoFeatureRegistrationResult;

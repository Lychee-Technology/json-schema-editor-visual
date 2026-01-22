import { createContext, useContext } from 'react';
import type { JsonSchema, FormatOption, MockOption } from '../types';

export interface EditorContextValue {
  getOpenValue: (keys: string[]) => boolean;
  changeCustomValue: (value: JsonSchema) => void;
  isMock: boolean;
  format: FormatOption[];
  mock: MockOption[];
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
}

export interface EditorProviderProps {
  children: React.ReactNode;
  value: EditorContextValue;
}

export function EditorProvider({ children, value }: EditorProviderProps) {
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

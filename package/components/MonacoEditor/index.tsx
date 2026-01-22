import { useRef, useCallback } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { cn } from '../../utils';

export interface MonacoEditorProps {
  value: string;
  onChange?: (value: string, isValid: boolean, jsonData?: unknown) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

export interface EditorData {
  text: string;
  format: boolean | string;
  jsonData?: unknown;
}

export function MonacoEditor({
  value,
  onChange,
  readOnly = false,
  height = '200px',
  className,
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange: OnChange = useCallback(
    (newValue) => {
      if (!newValue || !onChange) return;

      try {
        const jsonData = JSON.parse(newValue);
        onChange(newValue, true, jsonData);
      } catch (e) {
        onChange(newValue, false, undefined);
      }
    },
    [onChange]
  );

  return (
    <div className={cn('border border-gray-300 rounded-md overflow-hidden', className)}>
      <Editor
        height={height}
        defaultLanguage="json"
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme="vs-light"
      />
    </div>
  );
}

export default MonacoEditor;

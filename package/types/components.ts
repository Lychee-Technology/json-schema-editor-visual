import type { JsonSchema, FormatOption, MockOption } from './schema';

/** Schema Editor component props */
export interface SchemaEditorProps {
  /** Initial JSON schema data as string */
  data?: string;
  /** Callback when schema changes */
  onChange?: (data: string) => void;
  /** Show the JSON editor panel alongside visual editor */
  showEditor?: boolean;
  /** Enable mock data editing */
  isMock?: boolean;
}

/** Schema Editor configuration */
export interface SchemaEditorConfig {
  /** Language for i18n: 'en_US' | 'zh_CN' */
  lang?: 'en_US' | 'zh_CN';
  /** Custom format options */
  format?: FormatOption[];
  /** Custom mock options */
  mock?: MockOption[];
}

/** Editor Context value */
export interface EditorContextValue {
  /** Get open/collapsed state for a key path */
  getOpenValue: (keys: string[]) => boolean;
  /** Update custom schema value */
  changeCustomValue: (value: JsonSchema) => void;
  /** Whether mock editing is enabled */
  isMock: boolean;
  /** Format options */
  format: FormatOption[];
  /** Mock options */
  mock: MockOption[];
}

/** Props for SchemaJson component */
export interface SchemaJsonProps {
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

/** Props for SchemaItem component */
export interface SchemaItemProps {
  name: string;
  data: JsonSchema;
  prefix: string[];
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

/** Props for SchemaArray component */
export interface SchemaArrayProps {
  prefix: string[];
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

/** Props for SchemaObject component */
export interface SchemaObjectProps {
  prefix: string[];
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

/** Props for DropPlus component */
export interface DropPlusProps {
  prefix: string[];
  name: string;
}

/** Props for FieldInput component */
export interface FieldInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addonAfter?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

/** Props for MockSelect component */
export interface MockSelectProps {
  schema: JsonSchema;
  showEdit: () => void;
  onChange: (value: string) => void;
}

/** Props for MonacoEditor component */
export interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

/** Props for advanced settings components */
export interface AdvancedSettingsProps {
  data: JsonSchema;
}

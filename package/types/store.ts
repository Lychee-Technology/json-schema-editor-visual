import type { JsonSchema } from './schema';

/** Open state map for collapsible sections */
export type OpenState = Record<string, boolean>;

/** Schema store state */
export interface SchemaState {
  /** The current JSON schema data */
  data: JsonSchema;
  /** Map of open/closed states for collapsible sections */
  open: OpenState;
}

/** Schema store actions */
export interface SchemaActions {
  /** Replace entire schema */
  changeEditorSchema: (value: JsonSchema) => void;

  /** Rename a field */
  changeName: (prefix: string[], name: string, value: string) => void;

  /** Update a value at a key path */
  changeValue: (key: string[], value: unknown) => void;

  /** Change the type of a field */
  changeType: (key: string[], value: string) => void;

  /** Toggle required status of a field */
  enableRequire: (prefix: string[], name: string, required: boolean) => void;

  /** Set all fields as required or not required */
  requireAll: (required: boolean) => void;

  /** Delete a field */
  deleteItem: (key: string[]) => void;

  /** Add a sibling field */
  addField: (prefix: string[], name?: string) => void;

  /** Add a child field */
  addChildField: (key: string[]) => void;

  /** Toggle open/closed state of a collapsible section */
  setOpenValue: (key: string[], value?: boolean) => void;

  /** Get open state for a key path */
  getOpenValue: (key: string) => boolean;
}

/** Combined schema store type */
export type SchemaStore = SchemaState & SchemaActions;

/** Config store state */
export interface ConfigState {
  /** Current language */
  lang: 'en_US' | 'zh_CN';
  /** Format options */
  format: { name: string; title?: string }[];
  /** Mock options */
  mock: { name: string; mock: string }[];
}

/** Config store actions */
export interface ConfigActions {
  /** Set the language */
  setLang: (lang: 'en_US' | 'zh_CN') => void;
  /** Set format options */
  setFormat: (format: { name: string; title?: string }[]) => void;
  /** Set mock options */
  setMock: (mock: { name: string; mock: string }[]) => void;
}

/** Combined config store type */
export type ConfigStore = ConfigState & ConfigActions;

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { JsonSchema, SchemaStore, SchemaType } from '../types';
import { DEFAULT_SCHEMA } from '../types';
import { handleSchema } from '../utils/schema';

const JSONPATH_JOIN_CHAR = '.';

let fieldNum = 1;

/** Get data at a key path */
function getData<T>(state: unknown, keys: string[]): T {
  let current = state as Record<string, unknown>;
  for (const key of keys) {
    current = current[key] as Record<string, unknown>;
  }
  return current as T;
}

/** Set data at a key path */
function setData(state: unknown, keys: string[], value: unknown): void {
  let current = state as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

/** Delete data at a key path */
function deleteData(state: unknown, keys: string[]): void {
  let current = state as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  delete current[keys[keys.length - 1]];
}

/** Get parent keys */
function getParentKeys(keys: string[]): string[] {
  if (keys.length === 1) return [];
  return keys.slice(0, -1);
}

/** Clone object deeply */
function cloneObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cloneObject(item)) as T;
  }
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    newObj[key] = cloneObject((obj as Record<string, unknown>)[key]);
  }
  return newObj as T;
}

/** Handle schema required recursively */
function handleSchemaRequired(schema: JsonSchema, checked: boolean): void {
  if (schema.type === 'object' && schema.properties) {
    const requiredFields = Object.keys(schema.properties);
    if (checked) {
      schema.required = [...requiredFields];
    } else {
      delete schema.required;
    }
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (prop.type === 'array' || prop.type === 'object') {
        handleSchemaRequired(prop, checked);
      }
    }
  } else if (schema.type === 'array' && schema.items) {
    handleSchemaRequired(schema.items, checked);
  }
}

const initialState = {
  data: {
    type: 'object' as const,
    title: '',
    properties: {},
    required: [],
  } as JsonSchema,
  open: {
    properties: true,
  } as Record<string, boolean>,
};

export const useSchemaStore = create<SchemaStore>()(
  immer((set, get) => ({
    ...initialState,

    changeEditorSchema: (value: JsonSchema) => {
      set((state) => {
        handleSchema(value);
        state.data = value;
      });
    },

    changeName: (prefix: string[], name: string, value: string) => {
      set((state) => {
        const parentKeys = getParentKeys(prefix);
        const parentData = getData<JsonSchema>(state.data, parentKeys);
        const propertiesData = getData<Record<string, JsonSchema>>(state.data, prefix);

        // Check if new name already exists
        if (propertiesData[value] && typeof propertiesData[value] === 'object') {
          return;
        }

        // Update required array
        let requiredData = [...(parentData.required || [])];
        requiredData = requiredData.map((item) => (item === name ? value : item));

        // Handle open state for nested properties
        const curData = propertiesData[name];
        if (curData.properties) {
          const openKeys = [...prefix, value, 'properties'].join(JSONPATH_JOIN_CHAR);
          const oldOpenKeys = [...prefix, name, 'properties'].join(JSONPATH_JOIN_CHAR);
          delete state.open[oldOpenKeys];
          state.open[openKeys] = true;
        }

        // Update required
        if (parentKeys.length > 0) {
          setData(state.data, [...parentKeys, 'required'], requiredData);
        } else {
          state.data.required = requiredData;
        }

        // Rebuild properties with new name
        const newPropertiesData: Record<string, JsonSchema> = {};
        for (const key in propertiesData) {
          if (key === name) {
            newPropertiesData[value] = propertiesData[key];
          } else {
            newPropertiesData[key] = propertiesData[key];
          }
        }
        setData(state.data, prefix, newPropertiesData);
      });
    },

    changeValue: (key: string[], value: unknown) => {
      set((state) => {
        if (value !== undefined && value !== null && value !== '') {
          setData(state.data, key, value);
        } else {
          deleteData(state.data, key);
        }
      });
    },

    changeType: (key: string[], value: string) => {
      set((state) => {
        const parentKeys = getParentKeys(key);
        const parentData = getData<JsonSchema>(state.data, parentKeys);

        if (parentData.type === value) {
          return;
        }

        // Get new schema template
        const newSchemaTemplate = DEFAULT_SCHEMA[value as SchemaType];

        // Preserve description if exists
        const descriptionData = parentData.description ? { description: parentData.description } : {};
        const newParentData = { ...newSchemaTemplate, ...descriptionData };

        // Set the new data
        const newKeys = ['data', ...parentKeys];
        setData(state, newKeys, newParentData);
      });
    },

    enableRequire: (prefix: string[], name: string, required: boolean) => {
      set((state) => {
        const parentKeys = getParentKeys(prefix);
        const parentData = getData<JsonSchema>(state.data, parentKeys);
        let requiredData = [...(parentData.required || [])];
        const index = requiredData.indexOf(name);

        if (!required && index >= 0) {
          requiredData.splice(index, 1);
          const requiredKey = [...parentKeys, 'required'];
          if (requiredData.length === 0) {
            deleteData(state.data, requiredKey);
          } else {
            setData(state.data, requiredKey, requiredData);
          }
        } else if (required && index === -1) {
          requiredData.push(name);
          setData(state.data, [...parentKeys, 'required'], requiredData);
        }
      });
    },

    requireAll: (required: boolean) => {
      set((state) => {
        const data = cloneObject(state.data);
        handleSchemaRequired(data, required);
        state.data = data;
      });
    },

    deleteItem: (key: string[]) => {
      set((state) => {
        const name = key[key.length - 1];
        const parentKeys = getParentKeys(key);
        const parentData = getData<Record<string, JsonSchema>>(state.data, parentKeys);

        const newParentData: Record<string, JsonSchema> = {};
        for (const k in parentData) {
          if (k !== name) {
            newParentData[k] = parentData[k];
          }
        }

        setData(state.data, parentKeys, newParentData);
      });
    },

    addField: (prefix: string[], name?: string) => {
      set((state) => {
        const propertiesData = getData<Record<string, JsonSchema>>(state.data, prefix);
        const parentKeys = getParentKeys(prefix);
        const parentData = getData<JsonSchema>(state.data, parentKeys);
        let requiredData = [...(parentData.required || [])];

        const newPropertiesData: Record<string, JsonSchema> = {};
        const ranName = `field_${fieldNum++}`;

        if (!name) {
          Object.assign(newPropertiesData, propertiesData);
          newPropertiesData[ranName] = { ...DEFAULT_SCHEMA.string };
          requiredData.push(ranName);
        } else {
          for (const key in propertiesData) {
            newPropertiesData[key] = propertiesData[key];
            if (key === name) {
              newPropertiesData[ranName] = { ...DEFAULT_SCHEMA.string };
              requiredData.push(ranName);
            }
          }
        }

        setData(state.data, prefix, newPropertiesData);
        setData(state.data, [...parentKeys, 'required'], requiredData);
      });
    },

    addChildField: (key: string[]) => {
      set((state) => {
        const propertiesData = getData<Record<string, JsonSchema>>(state.data, key);
        const ranName = `field_${fieldNum++}`;

        const newPropertiesData = {
          ...propertiesData,
          [ranName]: { ...DEFAULT_SCHEMA.string },
        };

        setData(state.data, key, newPropertiesData);

        // Add to required
        const parentKeys = getParentKeys(key);
        const parentData = getData<JsonSchema>(state.data, parentKeys);
        const requiredData = [...(parentData.required || []), ranName];
        setData(state.data, [...parentKeys, 'required'], requiredData);
      });
    },

    setOpenValue: (key: string[], value?: boolean) => {
      set((state) => {
        const keyStr = key.join(JSONPATH_JOIN_CHAR);
        if (value === undefined) {
          state.open[keyStr] = !state.open[keyStr];
        } else {
          state.open[keyStr] = value;
        }
      });
    },

    getOpenValue: (key: string) => {
      return get().open[key] ?? false;
    },
  }))
);

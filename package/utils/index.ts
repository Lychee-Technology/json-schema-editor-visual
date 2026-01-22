import type { JsonSchema, FormatOption } from '../types';
import { DEFAULT_SCHEMA, DEFAULT_FORMATS, SCHEMA_TYPES } from '../types';

export const JSONPATH_JOIN_CHAR = '.';

/** Default format options */
export const format: FormatOption[] = DEFAULT_FORMATS;

/** Schema types */
export { SCHEMA_TYPES };

/** Default schema templates */
export const defaultSchema = DEFAULT_SCHEMA;

/** Debounce function to reduce high-frequency function calls */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>): void {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/** Get data at a key path */
export function getData<T>(state: unknown, keys: string[]): T {
  let current = state as Record<string, unknown>;
  for (const key of keys) {
    current = current[key] as Record<string, unknown>;
  }
  return current as T;
}

/** Set data at a key path */
export function setData(state: unknown, keys: string[], value: unknown): void {
  let current = state as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

/** Delete data at a key path */
export function deleteData(state: unknown, keys: string[]): void {
  let current = state as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  delete current[keys[keys.length - 1]];
}

/** Get parent keys (all but last) */
export function getParentKeys(keys: string[]): string[] {
  if (keys.length === 1) return [];
  return keys.slice(0, -1);
}

/** Clear specific fields from data object */
export function clearSomeFields<T extends Record<string, unknown>>(
  keys: string[],
  data: T
): Partial<T> {
  const newData = { ...data };
  keys.forEach((key) => {
    delete newData[key];
  });
  return newData;
}

/** Handle required fields for all nested schemas */
export function handleSchemaRequired(schema: JsonSchema, checked: boolean): void {
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

/** Deep clone an object */
export function cloneObject<T>(obj: T): T {
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

/** Check if two values are deeply equal */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (Array.isArray(a) || Array.isArray(b)) return false;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => isEqual(aObj[key], bObj[key]));
}

/** Check if value is undefined */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/** Merge class names using clsx and tailwind-merge */
export { clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

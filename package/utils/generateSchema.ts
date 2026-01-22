/**
 * Generate JSON Schema from a JSON object
 * Ported from generate-schema package
 */

import type { JsonSchema, SchemaType } from '../types';

const DRAFT = 'http://json-schema.org/draft-04/schema#';

interface GeneratedSchema extends Omit<JsonSchema, 'type'> {
  $schema?: string;
  type: SchemaType;
}

interface SchemaProperty {
  type?: string | string[];
  format?: string;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  oneOf?: SchemaProperty[];
  required?: string[];
  title?: string;
}

function getType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (typeof value === 'function') return 'function';
  return typeof value;
}

function getPropertyFormat(value: unknown): string | null {
  const type = getType(value);
  if (type === 'date') return 'date-time';
  return null;
}

function getPropertyType(value: unknown): string {
  const type = getType(value);
  if (type === 'date') return 'string';
  if (type === 'regexp') return 'string';
  if (type === 'function') return 'string';
  return type;
}

function getUniqueKeys(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  c?: string[]
): string[] {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const result = c || [];

  for (const value of bKeys) {
    const aIndex = aKeys.indexOf(value);
    const cIndex = result.indexOf(value);

    if (aIndex === -1) {
      if (cIndex !== -1) {
        // Value is optional, it doesn't exist in A but exists in B(n)
        result.splice(cIndex, 1);
      }
    } else if (cIndex === -1) {
      // Value is required, it exists in both B and A, and is not yet present in C
      result.push(value);
    }
  }

  return result;
}

function processArray(
  array: unknown[],
  output?: SchemaProperty,
  nested?: boolean
): SchemaProperty {
  let format: string | null = null;
  let oneOf = false;
  let type: string | null = null;

  if (nested && output) {
    output = { items: output };
  } else {
    output = output || {};
    output.type = getPropertyType(array);
    output.items = output.items || {};
    type = output.items.type as string || null;
  }

  // Determine whether each item is different
  for (let arrIndex = 0; arrIndex < array.length; arrIndex++) {
    const elementType = getPropertyType(array[arrIndex]);
    const elementFormat = getPropertyFormat(array[arrIndex]);

    if (type && elementType !== type) {
      output.items!.oneOf = [];
      oneOf = true;
      break;
    } else {
      type = elementType;
      format = elementFormat;
    }
  }

  // Setup type otherwise
  if (!oneOf && type) {
    output.items!.type = type;
    if (format) {
      output.items!.format = format;
    }
  } else if (oneOf && type !== 'object') {
    output.items = {
      oneOf: [{ type: type! }],
      required: output.items!.required,
    };
  }

  // Process each item depending
  if (typeof output.items!.oneOf !== 'undefined' || type === 'object') {
    for (let itemIndex = 0; itemIndex < array.length; itemIndex++) {
      const value = array[itemIndex];
      const itemType = getPropertyType(value);
      const itemFormat = getPropertyFormat(value);
      let arrayItem: SchemaProperty;

      if (itemType === 'object') {
        if (output.items!.properties) {
          output.items!.required = getUniqueKeys(
            output.items!.properties as Record<string, unknown>,
            value as Record<string, unknown>,
            output.items!.required
          );
        }
        arrayItem = processObject(
          value as Record<string, unknown>,
          oneOf ? undefined : output.items!.properties,
          true
        );
      } else if (itemType === 'array') {
        arrayItem = processArray(
          value as unknown[],
          oneOf ? undefined : output.items!.properties,
          true
        );
      } else {
        arrayItem = { type: itemType };
        if (itemFormat) {
          arrayItem.format = itemFormat;
        }
      }

      if (oneOf) {
        const childType = getType(value);
        if (!arrayItem.type && childType === 'object') {
          arrayItem = {
            properties: arrayItem.properties || arrayItem,
            type: 'object',
          } as SchemaProperty;
        }
        output.items!.oneOf!.push(arrayItem);
      } else {
        if (output.items!.type !== 'object') {
          continue;
        }
        output.items!.properties = (arrayItem.properties || arrayItem) as Record<string, SchemaProperty>;
      }
    }
  }

  return nested ? output.items! : output;
}

function processObject(
  object: Record<string, unknown>,
  output?: SchemaProperty | Record<string, SchemaProperty>,
  nested?: boolean
): SchemaProperty {
  if (nested && output) {
    output = { properties: output as Record<string, SchemaProperty> };
  } else {
    output = (output as SchemaProperty) || {};
    (output as SchemaProperty).type = getPropertyType(object);
    (output as SchemaProperty).properties = (output as SchemaProperty).properties || {};
  }

  const schemaOutput = output as SchemaProperty;

  for (const key in object) {
    const value = object[key];
    let type = getPropertyType(value);
    const format = getPropertyFormat(value);

    type = type === 'undefined' ? 'null' : type;

    if (type === 'object') {
      schemaOutput.properties![key] = processObject(
        value as Record<string, unknown>,
        schemaOutput.properties![key]
      );
      continue;
    }

    if (type === 'array') {
      schemaOutput.properties![key] = processArray(
        value as unknown[],
        schemaOutput.properties![key]
      );
      continue;
    }

    if (schemaOutput.properties![key]) {
      const entry = schemaOutput.properties![key];
      const hasTypeArray = Array.isArray(entry.type);

      // When an array already exists, we check the existing
      // type array to see if it contains our current property
      // type, if not, we add it to the array and continue
      if (hasTypeArray && (entry.type as string[]).indexOf(type) < 0) {
        (entry.type as string[]).push(type);
      }

      // When multiple fields of differing types occur,
      // json schema states that the field must specify the
      // primitive types the field allows in array format.
      if (!hasTypeArray && entry.type !== type) {
        entry.type = [entry.type as string, type];
      }

      continue;
    }

    schemaOutput.properties![key] = { type };

    if (format) {
      schemaOutput.properties![key].format = format;
    }
  }

  return nested ? schemaOutput.properties! : schemaOutput;
}

/**
 * Convert internal schema property to JsonSchema
 */
function toJsonSchema(prop: SchemaProperty): JsonSchema {
  const result: JsonSchema = {
    type: (Array.isArray(prop.type) ? prop.type[0] : prop.type) as SchemaType || 'object',
  };

  if (prop.format) result.format = prop.format;
  if (prop.title) result.title = prop.title;
  if (prop.required) result.required = prop.required;

  if (prop.properties) {
    result.properties = {};
    for (const key in prop.properties) {
      result.properties[key] = toJsonSchema(prop.properties[key]);
    }
  }

  if (prop.items) {
    result.items = toJsonSchema(prop.items);
  }

  return result;
}

/**
 * Generate a JSON Schema from a JSON object
 * @param object - The JSON object to generate a schema from
 * @param title - Optional title for the schema
 * @returns A JSON Schema object
 */
export function generateSchema(object: unknown, title?: string): JsonSchema {
  const type = getPropertyType(object);

  // Default to object type for unsupported types
  const schemaType: SchemaType = 
    (type === 'object' || type === 'array' || type === 'string' || 
     type === 'number' || type === 'boolean' || type === 'integer') 
      ? type as SchemaType 
      : 'object';

  const output: JsonSchema = {
    type: schemaType,
  };

  if (title) {
    output.title = title;
  }

  // Process object
  if (type === 'object') {
    const processOutput = processObject(object as Record<string, unknown>);
    if (processOutput.properties) {
      output.properties = {};
      for (const key in processOutput.properties) {
        output.properties[key] = toJsonSchema(processOutput.properties[key]);
      }
    }
  }

  if (type === 'array') {
    const processOutput = processArray(object as unknown[]);
    if (processOutput.items) {
      output.items = toJsonSchema(processOutput.items);
    }

    if (output.title && output.items) {
      output.items.title = output.title;
      output.title += ' Set';
    }
  }

  return output;
}

export default generateSchema;

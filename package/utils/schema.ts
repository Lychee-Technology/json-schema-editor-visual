import type { JsonSchema } from '../types';

/** Handle type inference for schemas without explicit type */
function handleType(schema: JsonSchema): void {
  if (!schema.type && schema.properties && typeof schema.properties === 'object') {
    schema.type = 'object';
  }
}

/** Recursively process and normalize a JSON schema */
export function handleSchema(schema: JsonSchema): void {
  if (!schema) return;

  if (!schema.type && !schema.properties) {
    schema.type = 'string';
  }

  handleType(schema);

  if (schema.type === 'object') {
    if (!schema.properties) {
      schema.properties = {};
    }
    handleObjectProperties(schema.properties);
  } else if (schema.type === 'array') {
    if (!schema.items) {
      schema.items = { type: 'string' };
    }
    handleSchema(schema.items);
  }
}

/** Handle object properties recursively */
function handleObjectProperties(properties: Record<string, JsonSchema>): void {
  for (const key in properties) {
    handleType(properties[key]);
    if (properties[key].type === 'array' || properties[key].type === 'object') {
      handleSchema(properties[key]);
    }
  }
}

export default handleSchema;

/** JSON Schema types */
export type SchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

/** Mock value structure */
export interface MockValue {
  mock: string;
}

/** Base JSON Schema interface */
export interface JsonSchema {
  type: SchemaType;
  title?: string;
  description?: string;
  default?: unknown;
  mock?: MockValue;

  // String validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // Number validation
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;

  // Array validation
  items?: JsonSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // Object validation
  properties?: Record<string, JsonSchema>;
  required?: string[];

  // Enum
  enum?: (string | number)[];
  enumDesc?: string;
}

/** String schema */
export interface StringSchema extends JsonSchema {
  type: 'string';
  default?: string;
  enum?: string[];
}

/** Number schema */
export interface NumberSchema extends JsonSchema {
  type: 'number' | 'integer';
  default?: number;
  enum?: number[];
}

/** Boolean schema */
export interface BooleanSchema extends JsonSchema {
  type: 'boolean';
  default?: boolean;
}

/** Array schema */
export interface ArraySchema extends JsonSchema {
  type: 'array';
  items: JsonSchema;
}

/** Object schema */
export interface ObjectSchema extends JsonSchema {
  type: 'object';
  properties: Record<string, JsonSchema>;
  required?: string[];
}

/** Format option for string formats */
export interface FormatOption {
  name: string;
  title?: string;
}

/** Mock option for mock data */
export interface MockOption {
  name: string;
  mock: string;
}

/** Default schema templates for each type */
export const DEFAULT_SCHEMA: Record<SchemaType, JsonSchema> = {
  string: { type: 'string' },
  number: { type: 'number' },
  integer: { type: 'integer' },
  boolean: { type: 'boolean' },
  array: { type: 'array', items: { type: 'string' } },
  object: { type: 'object', properties: {} },
};

/** List of all schema types */
export const SCHEMA_TYPES: SchemaType[] = ['string', 'number', 'integer', 'boolean', 'array', 'object'];

/** Default format options */
export const DEFAULT_FORMATS: FormatOption[] = [
  { name: 'date-time' },
  { name: 'date' },
  { name: 'email' },
  { name: 'hostname' },
  { name: 'ipv4' },
  { name: 'ipv6' },
  { name: 'uri' },
];

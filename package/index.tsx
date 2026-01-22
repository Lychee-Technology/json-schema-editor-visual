import { useEffect } from 'react';
import JsonSchemaEditor from './App';
import { useConfigStore } from './store';
import { setLanguage } from './utils/i18n';
import { DEFAULT_FORMATS } from './types';
import type { SchemaEditorConfig, SchemaEditorProps, FormatOption, MockOption } from './types';

// Import styles
import './styles/index.css';

export interface ConfiguredEditorProps extends SchemaEditorProps {}

/**
 * Creates a configured JSON Schema Editor component
 * @param config - Configuration options for the editor
 * @returns A React component with the configuration applied
 */
export default function createSchemaEditor(config: SchemaEditorConfig = {}) {
  // Apply language setting
  if (config.lang) {
    setLanguage(config.lang);
  }

  // Create configured component
  function ConfiguredEditor(props: ConfiguredEditorProps) {
    const setFormat = useConfigStore((state) => state.setFormat);
    const setMock = useConfigStore((state) => state.setMock);
    const setLang = useConfigStore((state) => state.setLang);

    useEffect(() => {
      // Apply config on mount
      if (config.lang) {
        setLang(config.lang);
        setLanguage(config.lang);
      }
      if (config.format) {
        setFormat(config.format);
      } else {
        setFormat(DEFAULT_FORMATS);
      }
      if (config.mock) {
        setMock(config.mock);
      }
    }, [setFormat, setMock, setLang]);

    return <JsonSchemaEditor {...props} />;
  }

  return ConfiguredEditor;
}

// Direct export for simple usage
export { JsonSchemaEditor as SchemaEditor };

// Export hooks and stores for advanced usage
export { useSchemaStore, useConfigStore } from './store';

// Export types
export type {
  SchemaEditorConfig,
  SchemaEditorProps,
  JsonSchema,
  SchemaType,
  FormatOption,
  MockOption,
} from './types';

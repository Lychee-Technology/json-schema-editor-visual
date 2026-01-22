import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Settings,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { Button, Input, Select, Checkbox, Tooltip, Tabs, TextArea, ConfirmModal } from './components/ui';
import { MonacoEditor } from './components/MonacoEditor';
import { SchemaJson } from './components/SchemaComponents/SchemaJson';
import { CustomItem } from './components/SchemaComponents/SchemaOther';
import { MockSelect } from './components/MockSelect';
import { EditorProvider } from './context/EditorContext';
import { useSchemaStore, useConfigStore } from './store';
import { useTranslation } from './hooks';
import { handleSchema } from './utils/schema';
import { debounce, cn, JSONPATH_JOIN_CHAR } from './utils';
import { SCHEMA_TYPES, DEFAULT_FORMATS, type JsonSchema, type SchemaEditorProps, type FormatOption, type MockOption } from './types';
import GenerateSchema from 'generate-schema';

const typeOptions = SCHEMA_TYPES.map((type) => ({ value: type, label: type }));

function JsonSchemaEditor({ data: initialData, onChange, showEditor = false, isMock = false }: SchemaEditorProps) {
  const { t } = useTranslation();
  const schema = useSchemaStore((state) => state.data);
  const open = useSchemaStore((state) => state.open);
  const {
    changeEditorSchema,
    changeType,
    changeValue,
    addChildField,
    setOpenValue,
    getOpenValue,
    requireAll,
  } = useSchemaStore();

  const format = useConfigStore((state) => state.format);
  const mock = useConfigStore((state) => state.mock);

  // Modal states
  const [importVisible, setImportVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [advVisible, setAdvVisible] = useState(false);

  // Edit modal state
  const [editValue, setEditValue] = useState('');
  const [editKey, setEditKey] = useState<string[]>([]);
  const [editorModalName, setEditorModalName] = useState<'description' | 'mock' | 'title'>('description');

  // Advanced modal state
  const [advKey, setAdvKey] = useState<string[]>([]);
  const [advValue, setAdvValue] = useState<JsonSchema | null>(null);

  // Root expand/collapse
  const [showRoot, setShowRoot] = useState(true);

  // Require all checkbox
  const [checkedAll, setCheckedAll] = useState(false);

  // Import JSON data
  const [importJsonType, setImportJsonType] = useState<'json' | 'schema'>('json');
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [jsonSchemaData, setJsonSchemaData] = useState<JsonSchema | null>(null);

  // Initialize schema from props
  useEffect(() => {
    let data = initialData;
    if (!data) {
      data = JSON.stringify({
        type: 'object',
        title: 'title',
        properties: {},
      });
    }
    try {
      const parsed = JSON.parse(data);
      changeEditorSchema(parsed);
    } catch (e) {
      // Invalid JSON, use default
    }
  }, []);

  // Sync changes to parent via onChange
  useEffect(() => {
    const debouncedOnChange = debounce(() => {
      if (typeof onChange === 'function') {
        onChange(JSON.stringify(schema));
      }
    }, 300);

    debouncedOnChange();
  }, [schema, onChange]);

  // Handle import modal
  const handleImportOk = useCallback(() => {
    if (importJsonType !== 'schema') {
      if (!jsonData) {
        return;
      }
      const generated = GenerateSchema(jsonData);
      changeEditorSchema(generated);
    } else {
      if (!jsonSchemaData) {
        return;
      }
      changeEditorSchema(jsonSchemaData);
    }
    setImportVisible(false);
  }, [importJsonType, jsonData, jsonSchemaData, changeEditorSchema]);

  // Handle JSON import editor change
  const handleImportJson = useCallback((value: string, isValid: boolean, data?: unknown) => {
    if (!isValid) {
      setJsonData(null);
      return;
    }
    setJsonData(data);
  }, []);

  // Handle JSON Schema import editor change
  const handleImportJsonSchema = useCallback((value: string, isValid: boolean, data?: unknown) => {
    if (!isValid) {
      setJsonSchemaData(null);
      return;
    }
    setJsonSchemaData(data as JsonSchema);
  }, []);

  // Handle main editor change
  const handleEditorChange = useCallback(
    (value: string, isValid: boolean, data?: unknown) => {
      if (!isValid) return;
      handleSchema(data as JsonSchema);
      changeEditorSchema(data as JsonSchema);
    },
    [changeEditorSchema]
  );

  // Handle root type change
  const handleChangeType = useCallback(
    (value: string) => {
      changeType(['type'], value);
    },
    [changeType]
  );

  // Handle root value change
  const handleChangeValue = useCallback(
    (key: string[], value: unknown) => {
      if (key[0] === 'mock') {
        value = value ? { mock: value } : undefined;
      }
      changeValue(key, value);
    },
    [changeValue]
  );

  // Show edit modal
  const showEdit = useCallback(
    (prefix: string[], name: string, value: unknown, type?: string) => {
      if (type === 'object' || type === 'array') {
        return;
      }
      const key = [...prefix, name];
      let editVal = name === 'mock' ? ((value as { mock?: string })?.mock || '') : (value as string) || '';
      setEditKey(key);
      setEditValue(editVal);
      setEditorModalName(name as 'description' | 'mock' | 'title');
      setEditVisible(true);
    },
    []
  );

  // Handle edit modal OK
  const handleEditOk = useCallback(() => {
    let value: unknown = editValue;
    if (editorModalName === 'mock') {
      value = editValue ? { mock: editValue } : undefined;
    }
    changeValue(editKey, value);
    setEditVisible(false);
  }, [editKey, editValue, editorModalName, changeValue]);

  // Show advanced settings modal
  const showAdv = useCallback((key: string[], value: JsonSchema) => {
    setAdvKey(key);
    setAdvValue(value);
    setAdvVisible(true);
  }, []);

  // Handle advanced settings OK
  const handleAdvOk = useCallback(() => {
    if (advKey.length === 0) {
      changeEditorSchema(advValue!);
    } else {
      changeValue(advKey, advValue);
    }
    setAdvVisible(false);
  }, [advKey, advValue, changeEditorSchema, changeValue]);

  // Handle require all checkbox
  const handleCheckAll = useCallback(
    (checked: boolean) => {
      setCheckedAll(checked);
      requireAll(checked);
    },
    [requireAll]
  );

  // Handle add child field to root
  const handleAddChildField = useCallback(() => {
    addChildField(['properties']);
    setShowRoot(true);
  }, [addChildField]);

  // Context value for nested components
  const contextValue = useMemo(
    () => ({
      getOpenValue: (keys: string[]) => getOpenValue(keys.join(JSONPATH_JOIN_CHAR)),
      changeCustomValue: (value: JsonSchema) => setAdvValue(value),
      isMock,
      format,
      mock,
    }),
    [getOpenValue, isMock, format, mock]
  );

  const isDisabled = schema.type !== 'object' && schema.type !== 'array';

  return (
    <EditorProvider value={contextValue}>
      <div className="json-schema-editor text-sm">
        <Button className="mb-2" onClick={() => setImportVisible(true)}>
          {t('import_json')}
        </Button>

        {/* Import JSON Modal */}
        <ConfirmModal
          open={importVisible}
          onClose={() => setImportVisible(false)}
          onOk={handleImportOk}
          title={t('import_json')}
          okText={t('ok')}
          cancelText={t('cancel')}
          width="lg"
        >
          <Tabs
            items={[
              {
                key: 'json',
                label: 'JSON',
                content: <MonacoEditor value="" onChange={handleImportJson} height="300px" />,
              },
              {
                key: 'schema',
                label: 'JSON-SCHEMA',
                content: <MonacoEditor value="" onChange={handleImportJsonSchema} height="300px" />,
              },
            ]}
            onChange={(index) => setImportJsonType(index === 0 ? 'json' : 'schema')}
          />
        </ConfirmModal>

        {/* Edit Modal (description/mock/title) */}
        <ConfirmModal
          open={editVisible}
          onClose={() => setEditVisible(false)}
          onOk={handleEditOk}
          title={
            <div className="flex items-center gap-2">
              <span>{t(editorModalName)}</span>
              {editorModalName === 'mock' && (
                <Tooltip content={t('mockLink')}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/YMFE/json-schema-editor-visual/issues/38"
                    className="text-gray-400 hover:text-primary-500"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </a>
                </Tooltip>
              )}
            </div>
          }
          okText={t('ok')}
          cancelText={t('cancel')}
        >
          <TextArea
            value={editValue}
            placeholder={t(editorModalName)}
            onChange={(e) => setEditValue(e.target.value)}
            minRows={6}
            maxRows={10}
          />
        </ConfirmModal>

        {/* Advanced Settings Modal */}
        {advVisible && advValue && (
          <ConfirmModal
            open={advVisible}
            onClose={() => setAdvVisible(false)}
            onOk={handleAdvOk}
            title={t('adv_setting')}
            okText={t('ok')}
            cancelText={t('cancel')}
            width="xl"
          >
            <div className="min-h-[400px]">
              <CustomItem data={JSON.stringify(advValue, null, 2)} />
            </div>
          </ConfirmModal>
        )}

        {/* Main Editor */}
        <div className="flex gap-4">
          {showEditor && (
            <div className="w-1/3">
              <MonacoEditor
                value={JSON.stringify(schema, null, 2)}
                onChange={handleEditorChange}
                height="800px"
              />
            </div>
          )}

          <div className={cn('flex-1', showEditor ? 'w-2/3' : 'w-full')}>
            {/* Root Row */}
            <div className="flex items-center gap-2 py-2">
              <div className="w-1/3 flex items-center">
                <div className="w-5 flex-shrink-0">
                  {schema.type === 'object' && (
                    <button
                      onClick={() => setShowRoot(!showRoot)}
                      className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      {showRoot ? (
                        <ChevronDown className="h-3 w-3 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    value="root"
                    disabled
                    addonAfter={
                      <Tooltip content={t('checked_all')}>
                        <Checkbox
                          checked={checkedAll}
                          disabled={isDisabled}
                          onChange={(e) => handleCheckAll(e.target.checked)}
                        />
                      </Tooltip>
                    }
                  />
                </div>
              </div>

              <div className="w-[12%]">
                <Select
                  value={schema.type || 'object'}
                  onChange={handleChangeType}
                  options={typeOptions}
                  className="w-full"
                />
              </div>

              {isMock && (
                <div className="w-[12%]">
                  <MockSelect
                    schema={schema}
                    showEdit={() => showEdit([], 'mock', schema.mock, schema.type)}
                    onChange={(value) => handleChangeValue(['mock'], value)}
                  />
                </div>
              )}

              <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
                <Input
                  value={schema.title || ''}
                  placeholder="Title"
                  onChange={(e) => handleChangeValue(['title'], e.target.value)}
                  addonAfter={
                    <button
                      onClick={() => showEdit([], 'title', schema.title)}
                      className="p-0.5 hover:text-primary-500"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  }
                />
              </div>

              <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
                <Input
                  value={schema.description || ''}
                  placeholder="description"
                  onChange={(e) => handleChangeValue(['description'], e.target.value)}
                  addonAfter={
                    <button
                      onClick={() => showEdit([], 'description', schema.description)}
                      className="p-0.5 hover:text-primary-500"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  }
                />
              </div>

              <div className={cn('flex items-center gap-1', isMock ? 'w-[8%]' : 'w-[12%]')}>
                <Tooltip content={t('adv_setting')}>
                  <button
                    onClick={() => showAdv([], schema)}
                    className="p-1 text-success hover:bg-gray-100 rounded"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </Tooltip>
                {schema.type === 'object' && (
                  <Tooltip content={t('add_child_node')}>
                    <button
                      onClick={handleAddChildField}
                      className="p-1 text-primary-500 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Child Schema */}
            {showRoot && (
              <SchemaJson data={schema} showEdit={showEdit} showAdv={showAdv} />
            )}
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

export default JsonSchemaEditor;

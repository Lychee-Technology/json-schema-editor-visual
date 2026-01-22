import { memo, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import { Input, Select, Checkbox, Tooltip, Dropdown } from '../ui';
import { FieldInput } from './FieldInput';
import { MockSelect } from '../MockSelect';
import { useSchemaStore } from '../../store';
import { useEditorContext } from '../../context/EditorContext';
import { useTranslation } from '../../hooks';
import { cn, JSONPATH_JOIN_CHAR, isUndefined } from '../../utils';
import { SCHEMA_TYPES } from '../../types';
import type { JsonSchema, SchemaType } from '../../types';

const typeOptions = SCHEMA_TYPES.map((type) => ({ value: type, label: type }));

interface SchemaArrayProps {
  prefix: string[];
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

const SchemaArray = memo(function SchemaArray({
  prefix,
  data,
  showEdit,
  showAdv,
}: SchemaArrayProps) {
  const { getOpenValue, isMock } = useEditorContext();
  const { t } = useTranslation();
  const {
    changeType,
    changeValue,
    addChildField,
    setOpenValue,
  } = useSchemaStore();

  const items = data.items;
  const prefixArray = [...prefix, 'items'];
  const length = prefix.filter((name) => name !== 'properties').length;
  const paddingLeft = `${20 * (length + 1)}px`;

  const prefixArrayStr = [...prefixArray, 'properties'].join(JSONPATH_JOIN_CHAR);
  const showIcon = getOpenValue([prefixArrayStr]);

  const handleChangeType = useCallback(
    (value: string) => {
      const key = [...prefixArray, 'type'];
      changeType(key, value);
    },
    [prefixArray, changeType]
  );

  const handleChangeDesc = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = [...prefixArray, 'description'];
      changeValue(key, e.target.value);
    },
    [prefixArray, changeValue]
  );

  const handleChangeMock = useCallback(
    (value: string) => {
      const key = [...prefixArray, 'mock'];
      changeValue(key, value ? { mock: value } : undefined);
    },
    [prefixArray, changeValue]
  );

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = [...prefixArray, 'title'];
      changeValue(key, e.target.value);
    },
    [prefixArray, changeValue]
  );

  const handleAddChildField = useCallback(() => {
    const keyArr = [...prefixArray, 'properties'];
    addChildField(keyArr);
    setOpenValue(keyArr, true);
  }, [prefixArray, addChildField, setOpenValue]);

  const handleClickIcon = useCallback(() => {
    const keyArr = [...prefixArray, 'properties'];
    setOpenValue(keyArr);
  }, [prefixArray, setOpenValue]);

  const handleShowEdit = useCallback(
    (name: string, type?: string) => {
      showEdit(prefixArray, name, items?.[name as keyof JsonSchema], type);
    },
    [prefixArray, items, showEdit]
  );

  const handleShowAdv = useCallback(() => {
    showAdv(prefixArray, items!);
  }, [prefixArray, items, showAdv]);

  if (isUndefined(items)) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="w-1/3 flex items-center" style={{ paddingLeft }}>
          <div className="w-5 flex-shrink-0">
            {items.type === 'object' && (
              <button
                onClick={handleClickIcon}
                className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
              >
                {showIcon ? (
                  <ChevronDown className="h-3 w-3 text-gray-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Input value="Items" disabled addonAfter={<Checkbox disabled />} />
          </div>
        </div>

        <div className="w-[15%]">
          <Select
            value={items.type}
            onChange={handleChangeType}
            options={typeOptions}
            className="w-full"
          />
        </div>

        {isMock && (
          <div className="w-[15%]">
            <MockSelect
              schema={items}
              showEdit={() => handleShowEdit('mock', items.type)}
              onChange={handleChangeMock}
            />
          </div>
        )}

        <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
          <Input
            value={items.title || ''}
            placeholder={t('title')}
            onChange={handleChangeTitle}
            addonAfter={
              <button
                onClick={() => handleShowEdit('title')}
                className="p-0.5 hover:text-primary-500"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            }
          />
        </div>

        <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
          <Input
            value={items.description || ''}
            placeholder={t('description')}
            onChange={handleChangeDesc}
            addonAfter={
              <button
                onClick={() => handleShowEdit('description')}
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
              onClick={handleShowAdv}
              className="p-1 text-success hover:bg-gray-100 rounded"
            >
              <Settings className="h-4 w-4" />
            </button>
          </Tooltip>
          {items.type === 'object' && (
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

      <div className="mt-2">
        <Mapping prefix={prefixArray} data={items} showEdit={showEdit} showAdv={showAdv} />
      </div>
    </div>
  );
});

interface SchemaItemProps {
  name: string;
  data: JsonSchema;
  prefix: string[];
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

const SchemaItem = memo(function SchemaItem({
  name,
  data,
  prefix,
  showEdit,
  showAdv,
}: SchemaItemProps) {
  const { getOpenValue, isMock } = useEditorContext();
  const { t } = useTranslation();
  const {
    changeName,
    changeType,
    changeValue,
    enableRequire,
    deleteItem,
    addField,
    addChildField,
    setOpenValue,
  } = useSchemaStore();

  const value = data.properties?.[name];
  const prefixArray = [...prefix, name];
  const length = prefix.filter((n) => n !== 'properties').length;
  const paddingLeft = `${20 * (length + 1)}px`;

  const prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
  const prefixArrayStr = [...prefixArray, 'properties'].join(JSONPATH_JOIN_CHAR);
  const show = getOpenValue([prefixStr]);
  const showIcon = getOpenValue([prefixArrayStr]);

  const isRequired = useMemo(() => {
    return !isUndefined(data.required) && data.required.includes(name);
  }, [data.required, name]);

  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (data.properties?.[newValue] && typeof data.properties[newValue] === 'object') {
        return;
      }
      changeName(prefix, name, newValue);
    },
    [prefix, name, data.properties, changeName]
  );

  const handleChangeDesc = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = [...prefixArray, 'description'];
      changeValue(key, e.target.value);
    },
    [prefixArray, changeValue]
  );

  const handleChangeMock = useCallback(
    (mockValue: string) => {
      const key = [...prefixArray, 'mock'];
      changeValue(key, mockValue ? { mock: mockValue } : undefined);
    },
    [prefixArray, changeValue]
  );

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = [...prefixArray, 'title'];
      changeValue(key, e.target.value);
    },
    [prefixArray, changeValue]
  );

  const handleChangeType = useCallback(
    (newType: string) => {
      const key = [...prefixArray, 'type'];
      changeType(key, newType);
    },
    [prefixArray, changeType]
  );

  const handleDeleteItem = useCallback(() => {
    deleteItem(prefixArray);
    enableRequire(prefix, name, false);
  }, [prefixArray, prefix, name, deleteItem, enableRequire]);

  const handleShowEdit = useCallback(
    (editorName: string, type?: string) => {
      showEdit(prefixArray, editorName, value?.[editorName as keyof JsonSchema], type);
    },
    [prefixArray, value, showEdit]
  );

  const handleShowAdv = useCallback(() => {
    showAdv(prefixArray, value!);
  }, [prefixArray, value, showAdv]);

  const handleAddField = useCallback(() => {
    addField(prefix, name);
  }, [prefix, name, addField]);

  const handleClickIcon = useCallback(() => {
    const keyArr = [...prefixArray, 'properties'];
    setOpenValue(keyArr);
  }, [prefixArray, setOpenValue]);

  const handleEnableRequire = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      enableRequire(prefix, name, e.target.checked);
    },
    [prefix, name, enableRequire]
  );

  const handleAddChildField = useCallback(() => {
    setOpenValue([...prefixArray, 'properties'], true);
    addChildField([...prefixArray, 'properties']);
  }, [prefixArray, setOpenValue, addChildField]);

  if (!show || !value) return null;

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-1/3 flex items-center" style={{ paddingLeft }}>
          <div className="w-5 flex-shrink-0">
            {value.type === 'object' && (
              <button
                onClick={handleClickIcon}
                className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
              >
                {showIcon ? (
                  <ChevronDown className="h-3 w-3 text-gray-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <FieldInput
              value={name}
              onChange={handleChangeName}
              addonAfter={
                <Tooltip content={t('required')}>
                  <Checkbox checked={isRequired} onChange={handleEnableRequire} />
                </Tooltip>
              }
            />
          </div>
        </div>

        <div className="w-[15%]">
          <Select
            value={value.type}
            onChange={handleChangeType}
            options={typeOptions}
            className="w-full"
          />
        </div>

        {isMock && (
          <div className="w-[15%]">
            <MockSelect
              schema={value}
              showEdit={() => handleShowEdit('mock', value.type)}
              onChange={handleChangeMock}
            />
          </div>
        )}

        <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
          <Input
            value={value.title || ''}
            placeholder={t('title')}
            onChange={handleChangeTitle}
            addonAfter={
              <button
                onClick={() => handleShowEdit('title')}
                className="p-0.5 hover:text-primary-500"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            }
          />
        </div>

        <div className={cn('flex-1', isMock ? 'w-[16%]' : 'w-[20%]')}>
          <Input
            value={value.description || ''}
            placeholder={t('description')}
            onChange={handleChangeDesc}
            addonAfter={
              <button
                onClick={() => handleShowEdit('description')}
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
              onClick={handleShowAdv}
              className="p-1 text-success hover:bg-gray-100 rounded"
            >
              <Settings className="h-4 w-4" />
            </button>
          </Tooltip>

          <button
            onClick={handleDeleteItem}
            className="p-1 text-danger hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>

          {value.type === 'object' ? (
            <DropPlus
              prefix={prefix}
              name={name}
              onAddSibling={handleAddField}
              onAddChild={handleAddChildField}
            />
          ) : (
            <Tooltip content={t('add_sibling_node')}>
              <button
                onClick={handleAddField}
                className="p-1 text-primary-500 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="mt-2">
        <Mapping prefix={prefixArray} data={value} showEdit={showEdit} showAdv={showAdv} />
      </div>
    </div>
  );
});

interface SchemaObjectProps {
  prefix: string[];
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

const SchemaObject = memo(function SchemaObject({
  prefix,
  data,
  showEdit,
  showAdv,
}: SchemaObjectProps) {
  if (!data.properties) return null;

  return (
    <div className="mt-2">
      {Object.keys(data.properties).map((name) => (
        <SchemaItem
          key={name}
          name={name}
          data={data}
          prefix={prefix}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      ))}
    </div>
  );
});

interface DropPlusProps {
  prefix: string[];
  name: string;
  onAddSibling: () => void;
  onAddChild: () => void;
}

function DropPlus({ onAddSibling, onAddChild }: DropPlusProps) {
  const { t } = useTranslation();

  const items = [
    {
      key: 'sibling',
      label: t('sibling_node'),
      onClick: onAddSibling,
    },
    {
      key: 'child',
      label: t('child_node'),
      onClick: onAddChild,
    },
  ];

  return (
    <Tooltip content={t('add_node')}>
      <Dropdown
        trigger={
          <button className="p-1 text-primary-500 hover:bg-gray-100 rounded">
            <Plus className="h-4 w-4" />
          </button>
        }
        items={items}
      />
    </Tooltip>
  );
}

interface MappingProps {
  prefix: string[];
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

function Mapping({ prefix, data, showEdit, showAdv }: MappingProps) {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={prefix} data={data} showEdit={showEdit} showAdv={showAdv} />;
    case 'object': {
      const nameArray = [...prefix, 'properties'];
      return <SchemaObject prefix={nameArray} data={data} showEdit={showEdit} showAdv={showAdv} />;
    }
    default:
      return null;
  }
}

export interface SchemaJsonProps {
  data: JsonSchema;
  showEdit: (prefix: string[], name: string, value: unknown, type?: string) => void;
  showAdv: (key: string[], value: JsonSchema) => void;
}

export function SchemaJson({ data, showEdit, showAdv }: SchemaJsonProps) {
  return (
    <div className="schema-content">
      <Mapping prefix={[]} data={data} showEdit={showEdit} showAdv={showAdv} />
    </div>
  );
}

export default SchemaJson;

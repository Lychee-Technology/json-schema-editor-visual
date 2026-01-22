import { useState, useEffect, useCallback } from 'react';
import { HelpCircle } from 'lucide-react';
import { Input, InputNumber, Select, Checkbox, Switch, TextArea, Tooltip } from '../ui';
import { MonacoEditor } from '../MonacoEditor';
import { useEditorContext } from '../../context/EditorContext';
import { useTranslation } from '../../hooks';
import { isUndefined } from '../../utils';
import type { JsonSchema } from '../../types';

interface SchemaTypeProps {
  data: JsonSchema;
}

function SchemaString({ data }: SchemaTypeProps) {
  const { changeCustomValue, format } = useEditorContext();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(!isUndefined(data.enum));

  useEffect(() => {
    setChecked(!isUndefined(data.enum));
  }, [data.enum]);

  const handleChangeValue = useCallback(
    (value: unknown, name: string) => {
      const newData = { ...data, [name]: value };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleEnumChange = useCallback(
    (value: string) => {
      const arr = value.split('\n').filter((v) => v);
      const newData = { ...data };
      if (arr.length === 0) {
        delete newData.enum;
      } else {
        newData.enum = arr;
      }
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleEnumDescChange = useCallback(
    (value: string) => {
      const newData = { ...data, enumDesc: value };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleCheckboxChange = useCallback(
    (isChecked: boolean) => {
      setChecked(isChecked);
      if (!isChecked) {
        const newData = { ...data };
        delete newData.enum;
        changeCustomValue(newData);
      }
    },
    [data, changeCustomValue]
  );

  const formatOptions = format.map((item) => ({
    value: item.name,
    label: item.name + (item.title ? ` (${item.title})` : ''),
  }));

  return (
    <div className="space-y-4">
      <div className="text-base font-medium border-l-4 border-primary-500 pl-3">
        {t('base_setting')}
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm">{t('default')}:</label>
        <div className="col-span-9">
          <Input
            value={(data.default as string) || ''}
            placeholder={t('default')}
            onChange={(e) => handleChangeValue(e.target.value, 'default')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4 text-right text-sm">{t('minLength')}:</label>
          <div className="col-span-8">
            <InputNumber
              value={data.minLength}
              placeholder="min.length"
              onChange={(val) => handleChangeValue(val, 'minLength')}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4 text-right text-sm">{t('maxLength')}:</label>
          <div className="col-span-8">
            <InputNumber
              value={data.maxLength}
              placeholder="max.length"
              onChange={(val) => handleChangeValue(val, 'maxLength')}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm flex items-center justify-end gap-1">
          Pattern
          <Tooltip content={t('pattern')}>
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
          </Tooltip>
          :
        </label>
        <div className="col-span-9">
          <Input
            value={data.pattern || ''}
            placeholder="Pattern"
            onChange={(e) => handleChangeValue(e.target.value, 'pattern')}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm flex items-center justify-end gap-1">
          {t('enum')}
          <Checkbox checked={checked} onChange={(e) => handleCheckboxChange(e.target.checked)} />:
        </label>
        <div className="col-span-9">
          <TextArea
            value={data.enum?.join('\n') || ''}
            disabled={!checked}
            placeholder={t('enum_msg')}
            onChange={(e) => handleEnumChange(e.target.value)}
          />
        </div>
      </div>

      {checked && (
        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-right text-sm">{t('enum_desc')}:</label>
          <div className="col-span-9">
            <TextArea
              value={data.enumDesc || ''}
              disabled={!checked}
              placeholder={t('enum_desc_msg')}
              onChange={(e) => handleEnumDescChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm">format:</label>
        <div className="col-span-9">
          <Select
            value={data.format || ''}
            onChange={(val) => handleChangeValue(val, 'format')}
            options={[{ value: '', label: 'Select a format' }, ...formatOptions]}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
}

function SchemaNumber({ data }: SchemaTypeProps) {
  const { changeCustomValue } = useEditorContext();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(!isUndefined(data.enum));
  const [enumStr, setEnumStr] = useState(data.enum?.join('\n') || '');

  useEffect(() => {
    setEnumStr(data.enum?.join('\n') || '');
  }, [data.enum]);

  const handleChangeValue = useCallback(
    (value: unknown, name: string) => {
      const newData = { ...data, [name]: value };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleEnumChange = useCallback(
    (value: string) => {
      setEnumStr(value);
      const arr = value.split('\n').filter((v) => v);
      const newData = { ...data };
      if (arr.length === 0) {
        delete newData.enum;
      } else {
        newData.enum = arr.map((v) => +v);
      }
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleEnumDescChange = useCallback(
    (value: string) => {
      const newData = { ...data, enumDesc: value };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  const handleCheckboxChange = useCallback(
    (isChecked: boolean) => {
      setChecked(isChecked);
      if (!isChecked) {
        const newData = { ...data };
        delete newData.enum;
        setEnumStr('');
        changeCustomValue(newData);
      }
    },
    [data, changeCustomValue]
  );

  return (
    <div className="space-y-4">
      <div className="text-base font-medium border-l-4 border-primary-500 pl-3">
        {t('base_setting')}
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm">{t('default')}:</label>
        <div className="col-span-9">
          <Input
            value={String(data.default ?? '')}
            placeholder={t('default')}
            onChange={(e) => handleChangeValue(e.target.value, 'default')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-7 text-right text-sm flex items-center justify-end gap-1">
            exclusiveMinimum
            <Tooltip content={t('exclusiveMinimum')}>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            </Tooltip>
            :
          </label>
          <div className="col-span-5">
            <Switch
              checked={data.exclusiveMinimum || false}
              onChange={(val) => handleChangeValue(val, 'exclusiveMinimum')}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-7 text-right text-sm flex items-center justify-end gap-1">
            exclusiveMaximum
            <Tooltip content={t('exclusiveMaximum')}>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            </Tooltip>
            :
          </label>
          <div className="col-span-5">
            <Switch
              checked={data.exclusiveMaximum || false}
              onChange={(val) => handleChangeValue(val, 'exclusiveMaximum')}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4 text-right text-sm">{t('minimum')}:</label>
          <div className="col-span-8">
            <InputNumber
              value={data.minimum}
              placeholder={t('minimum')}
              onChange={(val) => handleChangeValue(val, 'minimum')}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4 text-right text-sm">{t('maximum')}:</label>
          <div className="col-span-8">
            <InputNumber
              value={data.maximum}
              placeholder={t('maximum')}
              onChange={(val) => handleChangeValue(val, 'maximum')}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm flex items-center justify-end gap-1">
          {t('enum')}
          <Checkbox checked={checked} onChange={(e) => handleCheckboxChange(e.target.checked)} />:
        </label>
        <div className="col-span-9">
          <TextArea
            value={enumStr}
            disabled={!checked}
            placeholder={t('enum_msg')}
            onChange={(e) => handleEnumChange(e.target.value)}
          />
        </div>
      </div>

      {checked && (
        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-right text-sm">{t('enum_desc')}:</label>
          <div className="col-span-9">
            <TextArea
              value={data.enumDesc || ''}
              disabled={!checked}
              placeholder={t('enum_desc_msg')}
              onChange={(e) => handleEnumDescChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SchemaBoolean({ data }: SchemaTypeProps) {
  const { changeCustomValue } = useEditorContext();
  const { t } = useTranslation();

  const value = isUndefined(data.default) ? '' : data.default ? 'true' : 'false';

  const handleChange = useCallback(
    (val: string) => {
      const newData = { ...data, default: val === 'true' };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  return (
    <div className="space-y-4">
      <div className="text-base font-medium border-l-4 border-primary-500 pl-3">
        {t('base_setting')}
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 text-right text-sm">{t('default')}:</label>
        <div className="col-span-9">
          <Select
            value={value}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'true', label: 'true' },
              { value: 'false', label: 'false' },
            ]}
            className="w-48"
          />
        </div>
      </div>
    </div>
  );
}

function SchemaArray({ data }: SchemaTypeProps) {
  const { changeCustomValue } = useEditorContext();
  const { t } = useTranslation();

  const handleChangeValue = useCallback(
    (value: unknown, name: string) => {
      const newData = { ...data, [name]: value };
      changeCustomValue(newData);
    },
    [data, changeCustomValue]
  );

  return (
    <div className="space-y-4">
      <div className="text-base font-medium border-l-4 border-primary-500 pl-3">
        {t('base_setting')}
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-4 text-right text-sm flex items-center justify-end gap-1">
          uniqueItems
          <Tooltip content={t('unique_items')}>
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
          </Tooltip>
          :
        </label>
        <div className="col-span-8">
          <Switch
            checked={data.uniqueItems || false}
            onChange={(val) => handleChangeValue(val, 'uniqueItems')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-6 text-right text-sm">{t('min_items')}:</label>
          <div className="col-span-6">
            <InputNumber
              value={data.minItems}
              placeholder="minItems"
              onChange={(val) => handleChangeValue(val, 'minItems')}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-6 text-right text-sm">{t('max_items')}:</label>
          <div className="col-span-6">
            <InputNumber
              value={data.maxItems}
              placeholder="maxItems"
              onChange={(val) => handleChangeValue(val, 'maxItems')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeComponent(data: JsonSchema) {
  switch (data.type) {
    case 'string':
      return <SchemaString data={data} />;
    case 'number':
    case 'integer':
      return <SchemaNumber data={data} />;
    case 'boolean':
      return <SchemaBoolean data={data} />;
    case 'array':
      return <SchemaArray data={data} />;
    default:
      return null;
  }
}

export interface CustomItemProps {
  data: string;
}

export function CustomItem({ data }: CustomItemProps) {
  const { changeCustomValue } = useEditorContext();
  const { t } = useTranslation();

  const parsedData = JSON.parse(data) as JsonSchema;
  const optionForm = getTypeComponent(parsedData);

  const handleEditorChange = useCallback(
    (value: string, isValid: boolean, jsonData?: unknown) => {
      if (isValid && jsonData) {
        changeCustomValue(jsonData as JsonSchema);
      }
    },
    [changeCustomValue]
  );

  return (
    <div className="space-y-6">
      {optionForm && <div>{optionForm}</div>}

      <div className="text-base font-medium border-l-4 border-primary-500 pl-3">
        {t('all_setting')}
      </div>

      <MonacoEditor value={data} onChange={handleEditorChange} height="350px" />
    </div>
  );
}

export default CustomItem;

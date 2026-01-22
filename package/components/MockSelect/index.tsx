import { Pencil } from 'lucide-react';
import { AutoComplete } from '../ui';
import { useEditorContext } from '../../context/EditorContext';
import { useTranslation } from '../../hooks';
import type { JsonSchema } from '../../types';

export interface MockSelectProps {
  schema: JsonSchema;
  showEdit: () => void;
  onChange: (value: string | null) => void;
}

export function MockSelect({ schema, showEdit, onChange }: MockSelectProps) {
  const { mock } = useEditorContext();
  const { t } = useTranslation();

  const options = mock.map((item) => ({
    value: item.mock,
    label: item.mock,
  }));

  const isDisabled = schema.type === 'object' || schema.type === 'array';
  const value = schema.mock?.mock || '';

  const handleAddonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showEdit();
  };

  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t('mock')}
      disabled={isDisabled}
      addonAfter={
        <button
          onClick={handleAddonClick}
          className="p-0.5 hover:text-primary-500 transition-colors"
          type="button"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      }
    />
  );
}

export default MockSelect;

import { useCallback } from 'react';
import { useConfigStore } from '../store';
import { t, type MessageKey } from '../utils/i18n';

export function useTranslation() {
  const lang = useConfigStore((state) => state.lang);

  const translate = useCallback(
    (key: MessageKey): string => {
      // This will use the global language setting from i18n
      return t(key);
    },
    [lang]
  );

  return { t: translate, lang };
}

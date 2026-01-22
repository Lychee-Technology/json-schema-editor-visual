import { create } from 'zustand';
import type { ConfigStore } from '../types';
import { DEFAULT_FORMATS } from '../types';

export const useConfigStore = create<ConfigStore>((set) => ({
  lang: 'en_US',
  format: DEFAULT_FORMATS,
  mock: [],

  setLang: (lang) => set({ lang }),
  setFormat: (format) => set({ format }),
  setMock: (mock) => set({ mock }),
}));

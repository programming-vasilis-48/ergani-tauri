import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { CombinedDataRow, SummaryDataRow, User } from '../types';

interface AppStateData {
  combined: CombinedDataRow[] | null;
  summary: SummaryDataRow[] | null;
  user: User | null;
}

export interface AppState {
  data: AppStateData;
  setState: (updates: Partial<AppStateData>) => void;
}

const defaultData: AppStateData = {
  combined: null,
  summary: null,
  user: null
};

const defaultContextValue: AppState = {
  data: defaultData,
  setState: () => undefined,
};

export const AppStateContext = createContext<AppState>(defaultContextValue);

export function AppStateProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<AppStateData>(defaultData);

  const setStateWrapper = React.useCallback((updates: Partial<AppStateData>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const value = React.useMemo(() => ({
    data: state,
    setState: setStateWrapper,
  }), [state, setStateWrapper]);

  return React.createElement(
    AppStateContext.Provider,
    { value },
    children
  );
}

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
} 
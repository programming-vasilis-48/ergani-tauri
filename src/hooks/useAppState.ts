import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

export interface AppState {
  data: {
    combined: any[] | null;
    summary: any[] | null;
    user: any | null;
    isProcessing: boolean;
    error: string | null;
    darkMode: boolean;
  };
  setState: (updates: Partial<AppState['data']>) => void;
}

const initialState: AppState['data'] = {
  combined: null,
  summary: null,
  user: null,
  isProcessing: false,
  error: null,
  darkMode: false
};

const defaultContextValue: AppState = {
  data: initialState,
  setState: () => undefined,
};

export const AppStateContext = createContext<AppState>(defaultContextValue);

export function AppStateProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<AppState['data']>(initialState);

  const setStateWrapper = React.useCallback((updates: Partial<AppState['data']>) => {
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
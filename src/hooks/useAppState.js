import React, { createContext, useContext, useState } from 'react';
const defaultData = {
    combined: null,
    summary: null,
    user: null
};
const defaultContextValue = {
    data: defaultData,
    setState: () => undefined,
};
export const AppStateContext = createContext(defaultContextValue);
export function AppStateProvider({ children }) {
    const [state, setState] = useState(defaultData);
    const setStateWrapper = React.useCallback((updates) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);
    const value = React.useMemo(() => ({
        data: state,
        setState: setStateWrapper,
    }), [state, setStateWrapper]);
    return React.createElement(AppStateContext.Provider, { value }, children);
}
export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import './App.css';
// Components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProcessingForm from './components/ProcessingForm';
import DataDisplay from './components/DataDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';
function AppContent() {
    const { data: { user }, setState } = useAppState();
    const [showRegister, setShowRegister] = useState(false);
    useEffect(() => {
        // Load user state
        const savedUser = localStorage.getItem('currentUser');
        setState({
            user: savedUser ? JSON.parse(savedUser) : null
        });
    }, []); // Empty dependency array means this runs once on mount
    // Save user state when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);
    const handleLogout = () => {
        setState({ user: null });
        localStorage.removeItem('currentUser');
    };
    return (_jsxs("div", { className: "container", children: [_jsxs("header", { children: [_jsx("h1", { children: "Ergani Schedule Manager" }), user && (_jsx("button", { className: "btn btn-outline-danger", onClick: handleLogout, children: "Logout" }))] }), _jsx(ErrorDisplay, {}), _jsx(LoadingIndicator, {}), !user ? (showRegister ? (_jsx(RegisterForm, { onBackToLogin: () => setShowRegister(false) })) : (_jsx(LoginForm, { onShowRegister: () => setShowRegister(true) }))) : (_jsxs(_Fragment, { children: [_jsx(ProcessingForm, {}), _jsx(DataDisplay, {})] }))] }));
}
function App() {
    return (_jsx(AppStateProvider, { children: _jsx(AppContent, {}) }));
}
export default App;

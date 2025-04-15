import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';
export default function LoginForm({ onShowRegister }) {
    const { setState } = useAppState();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        await handleAsyncOperation(async () => {
            // Get stored users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const username = formData.get('username');
            const password = formData.get('password');
            const user = users.find((u) => u.username === username && u.password === password);
            if (!user) {
                throw new Error('Invalid username or password');
            }
            setState({
                user,
                error: null
            });
        }, { errorMessage: 'Login failed' }, setState);
    };
    return (_jsxs("section", { id: "loginSection", className: "auth-section", children: [_jsx("h2", { children: "Login" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "username", className: "form-label", children: "Username" }), _jsx("input", { type: "text", className: "form-control", id: "login_username", name: "username", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "Password" }), _jsx("input", { type: "password", className: "form-control", id: "login_password", name: "password", required: true })] }), _jsxs("div", { className: "d-flex gap-2", children: [_jsx("button", { type: "submit", className: "btn btn-primary", children: "Sign In" }), _jsx("button", { type: "button", className: "btn btn-outline-secondary", onClick: onShowRegister, children: "Register" })] })] })] }));
}

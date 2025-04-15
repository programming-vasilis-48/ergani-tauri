import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';
export default function RegisterForm({ onBackToLogin }) {
    const { setState } = useAppState();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const success = await handleAsyncOperation(async () => {
            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const username = formData.get('username');
            // Check if username already exists
            if (users.some((u) => u.username === username)) {
                throw new Error('Username already exists');
            }
            // Create new user
            const newUser = {
                username,
                password: formData.get('password'),
                usernameInfo: formData.get('usernameInfo'),
                passwordInfo: formData.get('passwordInfo'),
                usernameSchedule: formData.get('usernameSchedule'),
                passwordSchedule: formData.get('passwordSchedule')
            };
            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            setState({
                error: null
            });
            return true;
        }, {
            errorMessage: 'Registration failed',
            showLoading: true
        }, setState);
        if (success) {
            setState({
                error: null,
                isProcessing: false
            });
            alert('Registration successful! Please log in.');
            onBackToLogin();
        }
    };
    return (_jsxs("section", { id: "registerSection", className: "auth-section", children: [_jsx("h2", { children: "Register" }), _jsxs("form", { id: "registerForm", onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_username", className: "form-label", children: "Username" }), _jsx("input", { type: "text", className: "form-control", id: "reg_username", name: "username", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_password", className: "form-label", children: "Password" }), _jsx("input", { type: "password", className: "form-control", id: "reg_password", name: "password", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_usernameInfo", className: "form-label", children: "Ergani Info Username" }), _jsx("input", { type: "text", className: "form-control", id: "reg_usernameInfo", name: "usernameInfo", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_passwordInfo", className: "form-label", children: "Ergani Info Password" }), _jsx("input", { type: "password", className: "form-control", id: "reg_passwordInfo", name: "passwordInfo", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_usernameSchedule", className: "form-label", children: "Ergani Schedule Username" }), _jsx("input", { type: "text", className: "form-control", id: "reg_usernameSchedule", name: "usernameSchedule", required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "reg_passwordSchedule", className: "form-label", children: "Ergani Schedule Password" }), _jsx("input", { type: "password", className: "form-control", id: "reg_passwordSchedule", name: "passwordSchedule", required: true })] }), _jsxs("div", { className: "d-flex gap-2", children: [_jsx("button", { type: "submit", className: "btn btn-primary", children: "Register" }), _jsx("button", { type: "button", className: "btn btn-outline-secondary", onClick: onBackToLogin, children: "Back to Login" })] })] })] }));
}

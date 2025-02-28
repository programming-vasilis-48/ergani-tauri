import React, { FormEvent } from 'react';
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';

interface LoginFormProps {
  onShowRegister: () => void;
}

export default function LoginForm({ onShowRegister }: LoginFormProps): JSX.Element {
  const { setState } = useAppState();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    await handleAsyncOperation(async () => {
      // Get stored users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      const user = users.find((u: any) => 
        u.username === username && u.password === password
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      setState({
        user,
        error: null
      });
    }, { errorMessage: 'Login failed' }, setState);
  };

  return (
    <section id="loginSection" className="auth-section">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="login_username"
            name="username"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="login_password"
            name="password"
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Sign In</button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onShowRegister}
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
} 
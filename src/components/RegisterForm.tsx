import React, { FormEvent } from 'react';
import { useAppState } from '../hooks/useAppState';
import { handleAsyncOperation } from '../utils/errorHandling';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export default function RegisterForm({ onBackToLogin }: RegisterFormProps): JSX.Element {
  const { setState } = useAppState();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const success = await handleAsyncOperation(async () => {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const username = formData.get('username') as string;

      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        throw new Error('Username already exists');
      }

      // Create new user
      const newUser = {
        username,
        password: formData.get('password') as string,
        usernameInfo: formData.get('usernameInfo') as string,
        passwordInfo: formData.get('passwordInfo') as string,
        usernameSchedule: formData.get('usernameSchedule') as string,
        passwordSchedule: formData.get('passwordSchedule') as string
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

  return (
    <section id="registerSection" className="auth-section">
      <h2>Register</h2>
      <form id="registerForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reg_username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="reg_username"
            name="username"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg_password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="reg_password"
            name="password"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg_usernameInfo" className="form-label">Ergani Info Username</label>
          <input
            type="text"
            className="form-control"
            id="reg_usernameInfo"
            name="usernameInfo"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg_passwordInfo" className="form-label">Ergani Info Password</label>
          <input
            type="password"
            className="form-control"
            id="reg_passwordInfo"
            name="passwordInfo"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg_usernameSchedule" className="form-label">Ergani Schedule Username</label>
          <input
            type="text"
            className="form-control"
            id="reg_usernameSchedule"
            name="usernameSchedule"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg_passwordSchedule" className="form-label">Ergani Schedule Password</label>
          <input
            type="password"
            className="form-control"
            id="reg_passwordSchedule"
            name="passwordSchedule"
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Register</button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </form>
    </section>
  );
} 
'use client';
import React from 'react';

interface LoginFormProps { onSuccess?: () => void; }

/**
 * TODO: Email + password login form
 * - Email input with validation (required, email format)
 * - Password input with show/hide toggle
 * - Submit button with loading state
 * - Error message display (invalid credentials, etc.)
 * - Links: 'Create account' → /signup, 'Forgot password' → /forgot-password
 * - Call useAuth().login(email, password) on submit
 */
export default function LoginForm(props: LoginFormProps) {
  return (
    <div data-component="LoginForm">
      {/* TODO: Implement LoginForm */}
    </div>
  );
}

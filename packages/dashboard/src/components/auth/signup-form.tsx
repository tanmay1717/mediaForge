'use client';
import React from 'react';

interface SignupFormProps { onSuccess?: (email: string) => void; }

/**
 * TODO: Registration form
 * - Name, email, password, confirm password inputs
 * - Password strength indicator (weak/medium/strong)
 * - Password requirements checklist (8+ chars, uppercase, number, symbol)
 * - Submit → call useAuth().signup → redirect to /verify
 * - Link: 'Already have an account?' → /login
 */
export default function SignupForm(props: SignupFormProps) {
  return (
    <div data-component="SignupForm">
      {/* TODO: Implement SignupForm */}
    </div>
  );
}

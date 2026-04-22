'use client';
import React from 'react';

interface VerifyFormProps { email: string; onSuccess?: () => void; }

/**
 * TODO: Email verification code input
 * - 6 digit input boxes (auto-focus next on input, auto-submit on complete)
 * - Resend code button with 60s cooldown timer
 * - Call useAuth().confirmSignup(email, code) on submit
 */
export default function VerifyForm(props: VerifyFormProps) {
  return (
    <div data-component="VerifyForm">
      {/* TODO: Implement VerifyForm */}
    </div>
  );
}

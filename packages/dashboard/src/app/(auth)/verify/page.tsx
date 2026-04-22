'use client';
import React from 'react';

/**
 * TODO: Implement the verify page
 echo " * - Email + password form
 * - Call useAuth().login on submit
 * - Show validation errors
 * - Link to /signup and /forgot-password
 * - Redirect to /dashboard on success";;
  signup) echo " * - Email + password + name form
 * - Password strength indicator
 * - Call useAuth().signup on submit
 * - Redirect to /verify on success";;
  verify) echo " * - 6-digit code input (auto-focus, auto-advance)
 * - Call useAuth().confirmSignup on submit
 * - Resend code button with cooldown timer
 * - Redirect to /login on success";;
  forgot-password) echo " * - Email input form
 * - Call API POST /v1/auth/forgot-password
 * - Redirect to /reset-password on success";;
  reset-password) echo " * - Code + new password + confirm password form
 * - Call API POST /v1/auth/confirm-password
 * - Redirect to /login on success";;
esac)
 */
export default function verifyPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">verify</h1>
      {/* TODO: Implement form — see comments above */}
      <p className="text-gray-500">TODO: Implement verify form</p>
    </div>
  );
}

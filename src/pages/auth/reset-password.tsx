'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import PasswordInput from '@/components/PasswordInput';
import PasswordRequirements from '@/components/PasswordRequirements';
import { resetPassword } from '@/utils/api';

export default function ResetPassword() {
  const router = useRouter();
  const { logout } = useUser();
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword === temporaryPassword) {
      setError('New password must be different from current password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await resetPassword({ temporaryPassword, newPassword });
      logout();
      router.push('/auth/login');
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-efcaGray px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-efcaDark mb-4 text-2xl font-bold">Reset Your Password</h2>
            <p className="mb-6 text-gray-600">
              For security reasons, you must reset your temporary password before continuing.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="temporaryPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Temporary Password
              </label>
              <PasswordInput
                id="temporaryPassword"
                name="temporaryPassword"
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                placeholder="Enter your temporary password"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <PasswordRequirements />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-efcaAccent px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="mt-4 text-sm text-gray-600">
              For assistance, please{' '}
              <a
                href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Reset%20Password%20Help"
                className="hover:text-efcaAccent-dark text-efcaAccent underline"
              >
                contact the admin.
              </a>{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

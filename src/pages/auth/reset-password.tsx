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
    <div className="min-h-screen bg-efcaGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-efcaDark mb-4">Reset Your Password</h2>
            <p className="text-gray-600 mb-6">
              For security reasons, you must reset your temporary password before continuing.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="temporaryPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full bg-efcaAccent text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="mt-4 text-sm text-gray-600">
              For assistance, please{' '}
              <a
                href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Reset%20Password%20Help"
                className="text-efcaAccent underline hover:text-efcaAccent-dark"
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

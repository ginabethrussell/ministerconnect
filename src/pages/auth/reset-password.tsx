'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
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
              <input
                id="temporaryPassword"
                name="temporaryPassword"
                type="password"
                autoComplete="temporary-password"
                required
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                placeholder="Enter your temporary password"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                placeholder="Enter new password (min 8 characters)"
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                placeholder="Confirm new password"
                minLength={8}
              />
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

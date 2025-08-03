import React, { useState } from 'react';
import Link from 'next/link';

export default function SuperAdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Mock data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'candidate',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Grace Community Church',
      email: 'pastor@gracechurch.com',
      role: 'church',
      status: 'active',
      createdAt: '2024-01-10',
    },
    {
      id: 3,
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      role: 'candidate',
      status: 'pending',
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      name: 'First Baptist Church',
      email: 'admin@firstbaptist.com',
      role: 'church',
      status: 'active',
      createdAt: '2024-01-05',
    },
    {
      id: 5,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      role: 'candidate',
      status: 'inactive',
      createdAt: '2024-01-12',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'candidate':
        return 'bg-blue-100 text-blue-800';
      case 'church':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-orange-100 text-orange-800';
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResetPassword = async (user: any) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const confirmResetPassword = async () => {
    if (!selectedUser) return;

    setIsResetting(true);

    try {
      const response = await fetch(`/api/superadmin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResetPassword(data.reset_token);
      } else {
        const errorData = await response.json();
        alert(`Error resetting password: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setSelectedUser(null);
    setResetPassword('');
  };

  const copyToClipboard = () => {
    const resetLink = `${window.location.origin}/auth/reset-password?token=${resetPassword}`;
    navigator.clipboard.writeText(resetLink);
    alert('Reset link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-efcaDark text-3xl font-bold">Manage Users</h1>
            <p className="mt-2 text-gray-600">View and manage all platform users</p>
          </div>
          <Link
            href="/superadmin"
            className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
              >
                <option value="all">All Roles</option>
                <option value="candidate">Candidates</option>
                <option value="church">Churches</option>
                <option value="admin">Admins</option>
                <option value="superadmin">Super Admins</option>
              </select>
            </div>
          </div>

          <div>
            <table className="w-full">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-gray-200">
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">User</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Role</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Status</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Joined</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="mb-4 block rounded-lg border border-gray-200 p-4 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:border-gray-100 md:p-0 md:hover:bg-gray-50"
                  >
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <span className="mr-2 font-bold md:hidden">User:</span>
                      <span>
                        <p className="text-efcaDark inline font-medium md:block">{user.name}</p>
                        <p className="text-sm text-gray-600 md:block">{user.email}</p>
                      </span>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Role:</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Status:</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 text-sm text-gray-600 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Joined:</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between md:justify-start md:space-x-2">
                        <span className="font-bold md:hidden">Actions:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reset Password
                          </button>
                          {user.status === 'active' ? (
                            <button className="w-24 rounded-md bg-red-600 px-3 py-1.5 text-center text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                              Deactivate
                            </button>
                          ) : (
                            <button className="w-24 rounded-md bg-green-600 px-3 py-1.5 text-center text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
              {!resetPassword ? (
                <>
                  <h3 className="text-efcaDark mb-4 text-lg font-semibold">Reset Password</h3>
                  <p className="mb-4 text-gray-600">
                    Are you sure you want to reset the password for{' '}
                    <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
                  </p>
                  <p className="mb-6 text-sm text-gray-500">
                    A secure reset token will be generated. The user will receive a reset link via
                    email to set a new password.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeResetModal}
                      className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmResetPassword}
                      disabled={isResetting}
                      className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-efcaDark mb-4 text-lg font-semibold">
                    Password Reset Complete
                  </h3>
                  <p className="mb-4 text-gray-600">
                    A secure reset token has been generated for{' '}
                    <strong>{selectedUser?.name}</strong>.
                  </p>
                  <div className="mb-4 rounded bg-gray-100 p-3">
                    <p className="break-all font-mono text-sm text-gray-800">{resetPassword}</p>
                  </div>
                  <p className="mb-4 text-sm text-gray-500">
                    Reset Link:{' '}
                    <span className="break-all font-mono text-xs">{`${window.location.origin}/auth/reset-password?token=${resetPassword}`}</span>
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={copyToClipboard}
                      className="rounded bg-efcaAccent px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2"
                    >
                      Copy Token
                    </button>
                    <button
                      onClick={closeResetModal}
                      className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

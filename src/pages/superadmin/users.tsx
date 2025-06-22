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
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', role: 'candidate', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Grace Community Church', email: 'pastor@gracechurch.com', role: 'church', status: 'active', createdAt: '2024-01-10' },
    { id: 3, name: 'Jane Doe', email: 'jane.doe@email.com', role: 'candidate', status: 'pending', createdAt: '2024-01-20' },
    { id: 4, name: 'First Baptist Church', email: 'admin@firstbaptist.com', role: 'church', status: 'active', createdAt: '2024-01-05' },
    { id: 5, name: 'Mike Johnson', email: 'mike.johnson@email.com', role: 'candidate', status: 'suspended', createdAt: '2024-01-12' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'candidate': return 'bg-blue-100 text-blue-800';
      case 'church': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'superadmin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        setResetPassword(data.temporary_password);
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
    navigator.clipboard.writeText(resetPassword);
    alert('Password copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Manage Users</h1>
            <p className="text-gray-600 mt-2">View and manage all platform users</p>
          </div>
          <Link
            href="/superadmin"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent bg-white"
              >
                <option value="all">All Roles</option>
                <option value="candidate">Candidates</option>
                <option value="church">Churches</option>
                <option value="admin">Admins</option>
                <option value="superadmin">Super Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-efcaDark">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-efcaAccent hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleResetPassword(user)}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Reset Password
                        </button>
                        {user.status === 'active' ? (
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Suspend
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              {!resetPassword ? (
                <>
                  <h3 className="text-lg font-semibold text-efcaDark mb-4">
                    Reset Password
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to reset the password for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    A temporary password will be generated and displayed. The user will need to change it on their next login.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeResetModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmResetPassword}
                      disabled={isResetting}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-efcaDark mb-4">
                    Password Reset Complete
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Temporary Password:</p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-3 py-2 rounded border font-mono text-sm flex-1">
                        {resetPassword}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Share this temporary password securely with the user. 
                      They will be required to change it on their next login.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={closeResetModal}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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

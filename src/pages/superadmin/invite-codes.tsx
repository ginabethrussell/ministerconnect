import React, { useState } from 'react';
import Link from 'next/link';

export default function SuperAdminInviteCodes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const inviteCodes = [
    { 
      id: 1, 
      code: 'CHURCH2024', 
      type: 'church', 
      max_uses: 10,
      used_count: 3,
      status: 'active', 
      created_by: 'Super Admin',
      created_at: '2024-01-15',
      expires_at: '2024-12-31'
    },
    { 
      id: 2, 
      code: 'CANDIDATE2024', 
      type: 'candidate', 
      max_uses: 50,
      used_count: 50,
      status: 'expired', 
      created_by: 'Super Admin',
      created_at: '2024-01-10',
      expires_at: '2024-06-30'
    },
    { 
      id: 3, 
      code: 'GRACE2024', 
      type: 'church', 
      max_uses: 1,
      used_count: 1,
      status: 'used', 
      created_by: 'Super Admin',
      created_at: '2024-01-20',
      expires_at: '2024-12-31'
    },
    { 
      id: 4, 
      code: 'MINISTRY2024', 
      type: 'candidate', 
      max_uses: 25,
      used_count: 12,
      status: 'active', 
      created_by: 'Super Admin',
      created_at: '2024-01-18',
      expires_at: '2024-12-31'
    },
  ];

  const filteredCodes = inviteCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         code.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || code.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'church': return 'bg-purple-100 text-purple-800';
      case 'candidate': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateCode = () => {
    alert('Generate new invite code functionality would go here!');
  };

  const handleDeactivateCode = (codeId: number) => {
    alert(`Code ${codeId} deactivated!`);
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Manage Invite Codes</h1>
            <p className="text-gray-600 mt-2">Generate and manage invite codes for churches and candidates</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateCode}
              className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 transition-colors"
            >
              Generate Code
            </button>
            <Link
              href="/superadmin"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search codes by code or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Usage</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Expires</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-mono font-medium text-efcaDark">{code.code}</p>
                        <p className="text-sm text-gray-600">ID: {code.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(code.type)}`}>
                        {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-efcaDark">{code.used_count} / {code.max_uses}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-efcaAccent h-2 rounded-full" 
                            style={{ width: `${(code.used_count / code.max_uses) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(code.status)}`}>
                        {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(code.expires_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-efcaAccent hover:text-blue-700 text-sm font-medium">
                          Copy
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Edit
                        </button>
                        {code.status === 'active' && (
                          <button 
                            onClick={() => handleDeactivateCode(code.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCodes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No invite codes found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

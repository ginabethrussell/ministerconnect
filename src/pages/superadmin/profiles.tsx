import React, { useState } from 'react';
import Link from 'next/link';

export default function SuperAdminProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const profiles = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@email.com', 
      status: 'pending', 
      submittedAt: '2024-01-20',
      hasResume: true
    },
    { 
      id: 2, 
      name: 'Jane Doe', 
      email: 'jane.doe@email.com', 
      status: 'approved', 
      submittedAt: '2024-01-15',
      hasResume: true
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.johnson@email.com', 
      status: 'rejected', 
      submittedAt: '2024-01-18',
      hasResume: false
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah.wilson@email.com', 
      status: 'pending', 
      submittedAt: '2024-01-22',
      hasResume: true
    },
  ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (profileId: number) => {
    alert(`Profile ${profileId} approved!`);
  };

  const handleReject = (profileId: number) => {
    alert(`Profile ${profileId} rejected!`);
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Review Profiles</h1>
            <p className="text-gray-600 mt-2">Approve or reject candidate profiles</p>
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
                placeholder="Search profiles by name, email, or ministry type..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Candidate</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Resume</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Submitted</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-efcaDark">{profile.name}</p>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                        {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {profile.hasResume ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Uploaded
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          ✗ Missing
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(profile.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-efcaAccent hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                        {profile.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(profile.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(profile.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No profiles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

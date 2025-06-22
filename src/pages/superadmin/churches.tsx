import React, { useState } from 'react';
import Link from 'next/link';

export default function SuperAdminChurches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const churches = [
    { 
      id: 1, 
      name: 'Grace Community Church', 
      email: 'pastor@gracechurch.com', 
      phone: '(555) 123-4567',
      location: 'Springfield, IL',
      status: 'active', 
      jobListings: 3,
      createdAt: '2024-01-10' 
    },
    { 
      id: 2, 
      name: 'First Baptist Church', 
      email: 'admin@firstbaptist.com', 
      phone: '(555) 234-5678',
      location: 'Chicago, IL',
      status: 'active', 
      jobListings: 2,
      createdAt: '2024-01-05' 
    },
    { 
      id: 3, 
      name: 'St. Mary\'s Catholic Church', 
      email: 'office@stmarys.com', 
      phone: '(555) 345-6789',
      location: 'Peoria, IL',
      status: 'pending', 
      jobListings: 0,
      createdAt: '2024-01-20' 
    },
    { 
      id: 4, 
      name: 'Hope Lutheran Church', 
      email: 'pastor@hopelutheran.com', 
      phone: '(555) 456-7890',
      location: 'Rockford, IL',
      status: 'suspended', 
      jobListings: 1,
      createdAt: '2024-01-12' 
    },
  ];

  const filteredChurches = churches.filter(church => {
    const matchesSearch = church.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         church.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         church.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || church.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Manage Churches</h1>
            <p className="text-gray-600 mt-2">Review and manage church accounts</p>
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
                placeholder="Search churches by name, email, or location..."
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
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Church</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Job Listings</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-efcaDark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChurches.map((church) => (
                  <tr key={church.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-efcaDark">{church.name}</p>
                        <p className="text-sm text-gray-600">ID: {church.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-efcaDark">{church.email}</p>
                        <p className="text-sm text-gray-600">{church.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {church.location}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(church.status)}`}>
                        {church.status.charAt(0).toUpperCase() + church.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {church.jobListings} listings
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(church.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-efcaAccent hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Edit
                        </button>
                        {church.status === 'active' ? (
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

          {filteredChurches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No churches found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

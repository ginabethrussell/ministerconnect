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
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      name: 'First Baptist Church',
      email: 'admin@firstbaptist.com',
      phone: '(555) 234-5678',
      location: 'Chicago, IL',
      status: 'active',
      jobListings: 2,
      createdAt: '2024-01-05',
    },
    {
      id: 3,
      name: "St. Mary's Catholic Church",
      email: 'office@stmarys.com',
      phone: '(555) 345-6789',
      location: 'Peoria, IL',
      status: 'pending',
      jobListings: 0,
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      name: 'Hope Lutheran Church',
      email: 'pastor@hopelutheran.com',
      phone: '(555) 456-7890',
      location: 'Rockford, IL',
      status: 'inactive',
      jobListings: 1,
      createdAt: '2024-01-12',
    },
  ];

  const filteredChurches = churches.filter((church) => {
    const matchesSearch =
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || church.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <table className="w-full">
              <thead className="hidden md:table-header-group">
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
                  <tr
                    key={church.id}
                    className="block md:table-row mb-4 rounded-lg border border-gray-200 p-4 md:mb-0 md:border-0 md:border-b md:border-gray-100 md:p-0 md:hover:bg-gray-50 md:rounded-none"
                  >
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4">
                      <span className="font-bold md:hidden mr-2">Church:</span>
                      <p className="font-medium text-efcaDark">{church.name}</p>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4">
                      <span className="font-bold md:hidden mr-2">Contact:</span>
                      <span>
                        <p className="text-sm text-efcaDark md:block">{church.email}</p>
                        <p className="text-sm text-gray-600 md:block">{church.phone}</p>
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="font-bold md:hidden">Location:</span>
                        <span>{church.location}</span>
                      </div>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold md:hidden">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(church.status)}`}
                        >
                          {church.status.charAt(0).toUpperCase() + church.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold md:hidden">Job Listings:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {church.jobListings} listings
                        </span>
                      </div>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="font-bold md:hidden">Joined:</span>
                        <span>{new Date(church.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="block md:table-cell py-2 px-4 md:py-4 md:px-4">
                      <div className="flex justify-between items-center md:justify-start md:space-x-2">
                        <span className="font-bold md:hidden">Actions:</span>
                        <div className="flex space-x-2">
                          {church.status === 'active' ? (
                            <button className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-24 text-center">
                              Deactivate
                            </button>
                          ) : (
                            <button className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-24 text-center">
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

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
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-efcaDark text-3xl font-bold">Manage Churches</h1>
            <p className="mt-2 text-gray-600">Review and manage church accounts</p>
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
                name="searchTerm"
                type="search"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search churches by name, email, or location..."
              />
            </div>
            <div className="w-full md:w-48">
              <select
                name="statusFilter"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Church</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Contact</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Location</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Status</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Job Listings</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Joined</th>
                  <th className="text-efcaDark px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChurches.map((church) => (
                  <tr
                    key={church.id}
                    className="mb-4 block rounded-lg border border-gray-200 p-4 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:border-gray-100 md:p-0 md:hover:bg-gray-50"
                  >
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <span className="mr-2 font-bold md:hidden">Church:</span>
                      <p className="text-efcaDark font-medium">{church.name}</p>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <span className="mr-2 font-bold md:hidden">Contact:</span>
                      <span>
                        <p className="text-efcaDark text-sm md:block">{church.email}</p>
                        <p className="text-sm text-gray-600 md:block">{church.phone}</p>
                      </span>
                    </td>
                    <td className="block px-4 py-2 text-sm text-gray-600 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Location:</span>
                        <span>{church.location}</span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Status:</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(church.status)}`}
                        >
                          {church.status.charAt(0).toUpperCase() + church.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Job Listings:</span>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {church.jobListings} listings
                        </span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 text-sm text-gray-600 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold md:hidden">Joined:</span>
                        <span>{new Date(church.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="block px-4 py-2 md:table-cell md:px-4 md:py-4">
                      <div className="flex items-center justify-between md:justify-start md:space-x-2">
                        <span className="font-bold md:hidden">Actions:</span>
                        <div className="flex space-x-2">
                          {church.status === 'active' ? (
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

          {filteredChurches.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No churches found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

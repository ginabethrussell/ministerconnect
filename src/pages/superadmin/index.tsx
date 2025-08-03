import React from 'react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-efcaDark text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage the entire Minister Connect platform</p>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold text-efcaAccent">1,247</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Active Churches</h3>
            <p className="text-3xl font-bold text-efcaAccent">89</p>
            <p className="text-sm text-gray-500">+5% from last month</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Job Listings</h3>
            <p className="text-3xl font-bold text-efcaAccent">156</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Pending Reviews</h3>
            <p className="text-3xl font-bold text-red-500">23</p>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-efcaDark mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/superadmin/users"
                className="block w-full rounded-lg bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
              >
                <span className="text-efcaDark font-medium">Manage Users</span>
                <p className="text-sm text-gray-600">View and manage all platform users</p>
              </Link>

              <Link
                href="/superadmin/churches"
                className="block w-full rounded-lg bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
              >
                <span className="text-efcaDark font-medium">Manage Churches</span>
                <p className="text-sm text-gray-600">Review and manage church accounts</p>
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-efcaDark mb-4 text-xl font-semibold">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-efcaDark text-sm font-medium">New church registered</p>
                  <p className="text-xs text-gray-500">Grace Community Church - 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-efcaDark text-sm font-medium">Profile approved</p>
                  <p className="text-xs text-gray-500">John Smith - 4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-efcaDark text-sm font-medium">Job listing created</p>
                  <p className="text-xs text-gray-500">
                    Associate Pastor - First Baptist - 6 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-efcaDark text-sm font-medium">Profile rejected</p>
                  <p className="text-xs text-gray-500">Jane Doe - 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

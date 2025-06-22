import React from 'react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage the entire Minister Connect platform</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-efcaAccent">1,247</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Active Churches</h3>
            <p className="text-3xl font-bold text-efcaAccent">89</p>
            <p className="text-sm text-gray-500">+5% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Job Listings</h3>
            <p className="text-3xl font-bold text-efcaAccent">156</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-red-500">23</p>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-efcaDark mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/superadmin/users"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-efcaDark">Manage Users</span>
                <p className="text-sm text-gray-600">View and manage all platform users</p>
              </Link>
              
              <Link
                href="/superadmin/churches"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-efcaDark">Manage Churches</span>
                <p className="text-sm text-gray-600">Review and manage church accounts</p>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-efcaDark mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-efcaDark">New church registered</p>
                  <p className="text-xs text-gray-500">Grace Community Church - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-efcaDark">Profile approved</p>
                  <p className="text-xs text-gray-500">John Smith - 4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-efcaDark">Job listing created</p>
                  <p className="text-xs text-gray-500">Associate Pastor - First Baptist - 6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-efcaDark">Profile rejected</p>
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

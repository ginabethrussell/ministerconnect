import React from 'react';

const ChurchDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-efcaBlue">Church Dashboard</h2>
        <p>Welcome! Here you can view applicants, manage job postings, and more.</p>
        {/* TODO: Add church actions here */}
      </div>
    </div>
  );
};

export default ChurchDashboard;

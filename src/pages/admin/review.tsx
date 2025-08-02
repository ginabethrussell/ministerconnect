'use client';

import React, { useEffect, useState } from 'react';
import { UserIcon } from 'lucide-react';
import { Profile } from '@/context/ProfileContext';
import { getCandidateProfiles, reviewCandidateProfiles } from '@/utils/api';
import { titleCase } from '@/utils/helpers';

export default function AdminReview() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const profilesRes = await getCandidateProfiles();
        setProfiles(profilesRes.results);
      } catch (error) {
        if (error instanceof Error) {
          setLoadingError(error.message);
        } else {
          setLoadingError('Failed to load profiles.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(id.toString());
    setReviewError('');
    try {
      await reviewCandidateProfiles(id, status);
      setProfiles((prevProfiles) => prevProfiles.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (error) {
      if (error instanceof Error) {
        setLoadingError(error.message);
      } else {
        setLoadingError('Failed to update profile.');
      }
    } finally {
      setActionLoadingId(null);
    }
    setActionLoadingId(null);
  };

  const filteredProfiles = profiles.filter((p) => {
    if (filterStatus === 'all') {
      return true;
    }
    return p.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Review Candidate Profiles</h1>
        </header>
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Status Filters */}
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({profiles.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({profiles.filter((p) => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({profiles.filter((p) => p.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                filterStatus === 'rejected'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected ({profiles.filter((p) => p.status === 'rejected').length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading profiles...</p>
            </div>
          ) : !profiles || profiles.length === 0 ? (
            loadingError ? (
              <p className="mt-1 text-sm text-left text-[#FF5722]">{loadingError}</p>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No candidate profiles found.</p>
              </div>
            )
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProfiles.map((profile, idx) => {
                const fullName = `${profile.user.first_name} ${profile.user.last_name}`;
                return (
                  <div key={`${fullName}-${idx}`} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {profile.profile_image ? (
                        <img
                          src={profile.profile_image}
                          alt={`${fullName}`}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-300 shadow-xlg"
                        />
                      ) : (
                        <div className="object-cover rounded-full border-2 border-gray-300 shadow-xlg">
                          <UserIcon />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
                        <p
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            profile.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : profile.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {titleCase(profile.status)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Email:</span>
                          <span className="text-gray-700">{profile.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Phone:</span>
                          <span className="text-gray-700">555-123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Address:</span>
                          <span className="text-gray-700">{profile.street_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 w-20">Location:</span>
                          <span className="text-gray-700">{`${profile.city}, ${profile.state} ${profile.zipcode}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documents & MediaSection */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Documents & Media</h4>
                      <div className="space-y-2">
                        {profile.resume && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-600 w-16">Resume:</span>
                            <a
                              href={profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </a>
                          </div>
                        )}
                        {profile.video_url && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-600 w-16">Video:</span>
                            <a
                              href={profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Placement Preferences Section */}
                    {profile.placement_preferences && profile.placement_preferences.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Placement Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.placement_preferences.map((preference, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              {preference}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submission Info */}
                    <div className="mb-4 text-xs text-gray-500">
                      <p>Submitted: {new Date(profile.created_at).toLocaleDateString()}</p>
                      <p>Last Updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                    </div>

                    {/* Action Buttons */}
                    {profile.status !== 'approved' && profile.status !== 'rejected' && (
                      <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => handleStatus(profile.id, 'approved')}
                          disabled={actionLoadingId === profile.id.toString()}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                          {actionLoadingId === profile.id.toString() ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatus(profile.id, 'rejected')}
                          disabled={actionLoadingId === profile.id.toString()}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                        >
                          {actionLoadingId === profile.id.toString() ? 'Processing...' : 'Reject'}
                        </button>
                        {reviewError && (
                          <p className="mt-1 text-sm text-left text-[#FF5722]">{reviewError}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { getApprovedCandidates, getMutualInterests, getInviteCodes } from '@/utils/api';
import { normalizeProfiles, formatPhone } from '@/utils/helpers';
import { Profile } from '@/context/ProfileContext';
import { MutualInterest, InviteCode, EnrichedMutualInterest } from '../../types';

export default function MutualInterests() {
  const [loading, setLoading] = useState(true);
  const [mutualInterests, setMutualInterests] = useState<MutualInterest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [copyStatus, setCopyStatus] = useState<{
    [key: number]: { message: string; success: boolean };
  }>({});

  const profileMap = useMemo(() => normalizeProfiles(profiles), [profiles]);

  const enrichedInterests = useMemo<EnrichedMutualInterest[]>(() => {
    if (mutualInterests && mutualInterests.length > 0) {
      return mutualInterests.map((interest) => ({
        ...interest,
        profile: profileMap[interest.profile],
      }));
    }
    return [];
  }, [mutualInterests, profileMap]);

  useEffect(() => {
    const fetchMutualInterests = async () => {
      try {
        const [profilesRes, mutualInterestsRes, inviteCodesRes] = await Promise.all([
          getApprovedCandidates(),
          getMutualInterests(),
          getInviteCodes(),
        ]);

        setProfiles(profilesRes.results);
        setMutualInterests(mutualInterestsRes.results);
        setInviteCodes(inviteCodesRes.results);
      } catch (error) {
        console.error('Failed to fetch mutual interests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMutualInterests();
  }, []);

  let jobListings: any = [];
  if (mutualInterests && mutualInterests.length > 0) {
    jobListings = Array.from(
      new Map(
        mutualInterests.map((item) => [
          item.job_listing,
          { id: item.job_listing, title: item.job_title },
        ])
      ).values()
    );
  }

  const filteredCandidates = enrichedInterests.filter(
    ({ job_listing }) => selectedJob === 'all' || job_listing.toString() === selectedJob
  );

  const handleCopyContact = (profile: Profile) => {
    const contactInfo = `Name: ${profile.user.first_name} ${profile.user.last_name}\nEmail: ${profile.user.email}\nPhone: ${formatPhone(profile.phone)}`;

    navigator.clipboard.writeText(contactInfo).then(() => {
      setCopyStatus((prev) => ({
        ...prev,
        [profile.id]: { message: 'Copied!', success: true },
      }));

      setTimeout(() => {
        setCopyStatus((prev) => ({
          ...prev,
          [profile.id]: { message: '', success: false },
        }));
      }, 2000);
    });
  };

  const getTotalInterests = () => {
    if (mutualInterests) return mutualInterests.length;
    return 0;
  };

  const getInterestsByJob = (jobId: number) =>
    mutualInterests.filter((match) => match.job_listing === jobId).length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mutual interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-efcaDark">Mutual Interests</h1>
            <p className="text-gray-600 mt-2">
              Candidates who have expressed interest in your job listings
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Total Interests</h3>
            <p className="text-3xl font-bold text-efcaAccent">{getTotalInterests()}</p>
            <p className="text-sm text-gray-600">Candidates interested in your positions</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Active Listings</h3>
            <p className="text-3xl font-bold text-efcaAccent">{jobListings.length}</p>
            <p className="text-sm text-gray-600">Job positions currently posted</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-efcaDark mb-2">Recent Activity</h3>
            <p className="text-3xl font-bold text-efcaAccent">
              {mutualInterests?.filter((match) => {
                const interestDate = new Date(match.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return interestDate > weekAgo;
              }).length ?? 0}
            </p>
            <p className="text-sm text-gray-600">Interests in the last 7 days</p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Position:</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent bg-white"
            >
              <option value="all">All Positions ({getTotalInterests()})</option>
              {jobListings.map((job: any) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({getInterestsByJob(job.id)})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Candidates List */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interested candidates</h3>
              <p className="text-gray-600">
                {selectedJob === 'all'
                  ? 'No candidates have expressed interest in your job listings yet.'
                  : 'No candidates have expressed interest in this position yet.'}
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {filteredCandidates.map((enrichedInterest) => (
                <li
                  key={enrichedInterest.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-6 flex-grow">
                      <div className="w-24 h-24 flex-shrink-0">
                        {enrichedInterest.profile.profile_image ? (
                          <img
                            src={enrichedInterest.profile.profile_image}
                            alt={`${enrichedInterest.profile.user.first_name} ${enrichedInterest.profile.user.last_name}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-efcaDark">{`${enrichedInterest.profile.user.first_name} ${enrichedInterest.profile.user.last_name}`}</h3>
                        <p className="text-gray-600">
                          Interested in:{' '}
                          <span className="font-semibold">{enrichedInterest.job_title}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Interest expressed:{' '}
                          {new Date(enrichedInterest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-3">
                      <a
                        href={`mailto:${enrichedInterest.profile.user.email}`}
                        className="px-4 py-2 bg-blue-600 text-white text-center rounded-md font-semibold hover:bg-blue-700 transition flex-1"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => handleCopyContact(enrichedInterest.profile)}
                        className={`px-4 py-2 text-center rounded-md font-semibold transition flex-1 border ${
                          copyStatus[enrichedInterest.profile.id]?.success
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {copyStatus[enrichedInterest.profile.id]?.message || 'Copy Contact Info'}
                      </button>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-600">
                        Email: {enrichedInterest.profile.user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {enrichedInterest.profile.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location:{' '}
                        {`${enrichedInterest.profile.street_address}, ${enrichedInterest.profile.city}, ${enrichedInterest.profile.state} ${enrichedInterest.profile.zipcode}`}
                      </p>
                    </div>

                    {/* Documents & Media */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Documents & Media</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <a
                            href={enrichedInterest.profile.resume || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-efcaAccent hover:underline"
                          >
                            View Resume
                          </a>
                        </div>
                        {enrichedInterest.profile.video_url && (
                          <div>
                            <a
                              href={enrichedInterest.profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-efcaAccent hover:underline"
                            >
                              View Video
                            </a>
                          </div>
                        )}
                      </div>
                      {enrichedInterest.profile.placement_preferences &&
                        enrichedInterest.profile.placement_preferences.length > 0 && (
                          <div className="mt-2">
                            <h5 className="font-semibold text-gray-700 mb-1">Preferences</h5>
                            <div className="flex flex-wrap gap-1">
                              {enrichedInterest.profile.placement_preferences.map((pref) => (
                                <span
                                  key={pref}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                                >
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Profile Details</h4>
                      <p className="text-sm text-gray-600">
                        Status:{' '}
                        {enrichedInterest.profile.status.charAt(0).toUpperCase() +
                          enrichedInterest.profile.status.slice(1)}
                      </p>
                      {enrichedInterest.profile.invite_code && (
                        <p className="text-sm text-gray-600">
                          Event:{' '}
                          {
                            inviteCodes.find(
                              (code) => code.id === enrichedInterest.profile.invite_code
                            )?.event
                          }
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Profile Created:{' '}
                        {new Date(enrichedInterest.profile.created_at).toLocaleDateString()}
                      </p>
                      {enrichedInterest.profile.submitted_at && (
                        <p className="text-sm text-gray-600">
                          Submitted:{' '}
                          {new Date(enrichedInterest.profile.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Last Updated:{' '}
                        {new Date(enrichedInterest.profile.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

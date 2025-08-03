'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Profile } from '@/context/ProfileContext';
import { MutualInterest, InviteCode, EnrichedMutualInterest } from '@/types';
import { getApprovedCandidates, getMutualInterests, getInviteCodes } from '@/utils/api';
import { normalizeProfiles, formatPhone } from '@/utils/helpers';

export default function MutualInterests() {
  const [loading, setLoading] = useState(true);
  const [mutualInterests, setMutualInterests] = useState<MutualInterest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [copyStatus, setCopyStatus] = useState<{
    [key: number]: { message: string; success: boolean };
  }>({});
  const [loadingError, setLoadingError] = useState('');

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
        if (error instanceof Error) {
          setLoadingError(error.message);
        } else {
          setLoadingError('Failed to fetch mutual interests.');
        }
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
      <div className="flex min-h-screen items-center justify-center bg-efcaGray">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-efcaAccent"></div>
          <p className="text-gray-600">Loading mutual interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-efcaDark text-3xl font-bold">Mutual Interests</h1>
            <p className="mt-2 text-gray-600">
              Candidates who have expressed interest in your job listings
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Total Interests</h3>
            <p className="text-3xl font-bold text-efcaAccent">{getTotalInterests()}</p>
            {loadingError && (
              <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
            )}
            <p className="text-sm text-gray-600">Candidates interested in your positions</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Active Listings</h3>
            <p className="text-3xl font-bold text-efcaAccent">{jobListings.length}</p>
            <p className="text-sm text-gray-600">Job positions currently posted</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-efcaDark mb-2 text-lg font-semibold">Recent Activity</h3>
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
        <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <label className="text-sm font-medium text-gray-700">Filter by Position:</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="rounded border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
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
        <section className="rounded-lg bg-white p-6 shadow-sm">
          {filteredCandidates.length === 0 ? (
            <div className="py-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">No interested candidates</h3>
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
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  {/* Top Section */}
                  <div className="flex flex-col justify-between gap-6 md:flex-row">
                    {/* Candidate Info */}
                    <div className="flex flex-grow items-start gap-6">
                      <div className="h-24 w-24 flex-shrink-0">
                        {enrichedInterest.profile.profile_image ? (
                          <img
                            src={enrichedInterest.profile.profile_image}
                            alt={`${enrichedInterest.profile.user.first_name} ${enrichedInterest.profile.user.last_name}`}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
                            <svg
                              className="h-10 w-10 text-gray-400"
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
                        <h3 className="text-efcaDark text-2xl font-bold">{`${enrichedInterest.profile.user.first_name} ${enrichedInterest.profile.user.last_name}`}</h3>
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
                    <div className="flex w-full flex-shrink-0 flex-col gap-3 md:w-[200px]">
                      <a
                        href={`mailto:${enrichedInterest.profile.user.email}`}
                        className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => handleCopyContact(enrichedInterest.profile)}
                        className={`flex-1 rounded-md border px-4 py-2 text-center font-semibold transition ${
                          copyStatus[enrichedInterest.profile.id]?.success
                            ? 'border-green-300 bg-green-100 text-green-800'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {copyStatus[enrichedInterest.profile.id]?.message || 'Copy Contact Info'}
                      </button>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="my-4 border-t border-gray-200"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Contact Info */}
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-700">Contact Information</h4>
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
                      <h4 className="mb-2 font-semibold text-gray-700">Documents & Media</h4>
                      <div className="space-y-1 text-sm">
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
                            <h5 className="mb-1 font-semibold text-gray-700">Preferences</h5>
                            <div className="flex flex-wrap gap-1">
                              {enrichedInterest.profile.placement_preferences.map((pref) => (
                                <span
                                  key={pref}
                                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
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
                      <h4 className="mb-2 font-semibold text-gray-700">Profile Details</h4>
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

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ClipboardCopy, Check } from 'lucide-react';
import { Profile } from '@/context/ProfileContext';
import ExpressInterestButton from '@/components/ExpressInterestButton';
import UserIcon from '@/components/UserIcon';
import { JobListing, MutualInterest } from '@/types';
import {
  expressChurchInterest,
  getApprovedCandidates,
  getChurchInterests,
  getChurchJobs,
  withdrawInterest,
} from '@/utils/api';
import { formatPhone, mergeProfilesWithInterest } from '@/utils/helpers';

export default function ChurchSearch() {
  const [search, setSearch] = useState('');
  const [churchJobListings, setChurchJobListings] = useState<JobListing[]>([]); // To associate with interest
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [allInterests, setAllInterests] = useState<MutualInterest[]>([]);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});
  const [loadingError, setLoadingError] = useState('');
  const [toggleInterestError, setToggleInterestError] = useState('');

  const profilesWithInterest = useMemo(() => {
    if (!selectedJobId || profiles.length === 0) return [];
    return mergeProfilesWithInterest(profiles, allInterests, Number(selectedJobId));
  }, [selectedJobId, profiles, allInterests]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profilesRes, churchJobListingsRes, churchInterestsRes] = await Promise.all([
          await getApprovedCandidates(),
          await getChurchJobs(),
          await getChurchInterests(),
        ]);
        const approvedJobListings = churchJobListingsRes.results.filter(
          (job) => job.status === 'approved'
        );
        setChurchJobListings(approvedJobListings);
        setSelectedJobId(approvedJobListings[0]?.id.toString());
        setProfiles(profilesRes.results);
        setAllInterests(churchInterestsRes.results);
      } catch (error) {
        if (error instanceof Error) {
          setLoadingError(error.message);
        } else {
          setLoadingError('Failed to load candidates, jobs, or interests.');
        }
      }
    };

    fetchInitialData();
  }, []);

  const filteredProfiles = profilesWithInterest.filter(
    (p) =>
      (p.user.first_name + ' ' + p.user.last_name).toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleInterest = async (profileId: number) => {
    setToggleInterestError('');
    const existingInterest = allInterests.find(
      (interest) =>
        interest.profile === profileId &&
        interest.job_listing === Number(selectedJobId) &&
        interest.expressed_by === 'church'
    );

    try {
      if (existingInterest) {
        await withdrawInterest(existingInterest.id);
      } else {
        if (profileId) {
          await expressChurchInterest(Number(selectedJobId), profileId);
        }
      }
      const updatedInterests = await getChurchInterests();
      setAllInterests(updatedInterests.results);
    } catch (error) {
      if (error instanceof Error) {
        setToggleInterestError(error.message);
      } else {
        setToggleInterestError('Failed to toggle interest.');
      }
    }
  };

  const handleCopyContact = (profile: Profile) => {
    const contactInfo = `Name: ${profile.user.first_name} ${profile.user.last_name}\nEmail: ${profile.user.email}\nPhone: ${formatPhone(profile.phone)}`;
    navigator.clipboard.writeText(contactInfo).then(
      () => {
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Copied!' }));
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [profile.id]: '' }));
        }, 2000);
      },
      () => {
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Failed' }));
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-800">Search Candidates</h1>
        </header>

        <section className="my-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">
            How Expressing Interest Works
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• You may express interest in a candidate by clicking Express Interest.</p>
            <p>• You may withdraw interest in a candidate by clicking Interest Expressed.</p>
            <p>• When you express or withdraw interest, the candidate is NOT notified.</p>
            <p>
              • If a candidate also expresses interest in one of your job listings, it becomes a
              &quot;Mutual Interest.&quot;
            </p>
            <p>
              • You can view all Mutual Interests on the
              <Link
                href="/church/mutual-interests"
                className="cursor-pointer font-semibold text-blue-800 hover:underline"
              >
                {' '}
                Interests{' '}
              </Link>
              page.
            </p>
            <p>
              • One or more Admin approved job listings must exist before you can express interest.
              Create a
              <Link
                href="/church/jobs/create"
                className="cursor-pointer font-semibold text-blue-800 hover:underline"
              >
                {' '}
                job listing{' '}
              </Link>
              to get started or contact the
              <a
                href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Assistance%20Request"
                className="cursor-pointer font-semibold text-blue-800 hover:underline"
              >
                {' '}
                site admin{' '}
              </a>
              for assistance.
            </p>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          {churchJobListings && churchJobListings.length > 0 && (
            <div className="mb-6 flex flex-col items-center gap-2 md:flex-row">
              <label htmlFor="job-select" className="mb-1 text-2xl font-bold text-gray-800">
                Expressing interest for:
              </label>
              <select
                id="job-select"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-efcaAccent focus:outline-none focus:ring-efcaAccent sm:text-sm md:max-w-sm"
              >
                {churchJobListings.map((job) => (
                  <option key={job.id} value={String(job.id)}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            name="search"
            type="search"
            className="mb-6 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, city, or state abbreviation..."
          />
          {!selectedJobId && (
            <div className="mb-6 rounded border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
              <p>
                You must{' '}
                <Link href="/church/jobs/create" className="text-blue-600 hover:underline">
                  create a job listing
                </Link>{' '}
                before expressing interest in candidates.
              </p>
            </div>
          )}
          {!filteredProfiles || filteredProfiles.length === 0 ? (
            <>
              <div className="py-8 text-center text-gray-500">
                No candidates found matching your criteria.
              </div>
              {loadingError && (
                <p className="mt-1 text-left text-sm text-[#FF5722]">{loadingError}</p>
              )}
            </>
          ) : (
            <ul className="space-y-6">
              {profilesWithInterest &&
                filteredProfiles.map((profile) => {
                  const hasExpressedInterest = !!allInterests.find(
                    (interest) =>
                      interest.profile === profile.id &&
                      interest.job_listing === Number(selectedJobId) &&
                      interest.expressed_by === 'church'
                  );

                  return (
                    <li
                      key={`${profile.id}-${selectedJobId}`}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      {/* Top Section */}
                      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        {/* Candidate Info */}
                        <div className="flex flex-grow flex-col items-center gap-6 md:flex-row">
                          <div className="flex-shrink-0">
                            {profile && profile?.profile_image ? (
                              <img
                                src={profile.profile_image}
                                alt={`${profile.user.first_name} ${profile.user.last_name}`}
                                className="shadow-xlg h-40 w-40 rounded-full border-2 border-gray-300 object-cover md:h-36 md:w-36"
                              />
                            ) : (
                              <div className="rounded-full object-cover">
                                <UserIcon />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-gray-800">{`${profile.user.first_name} ${profile.user.last_name}`}</h3>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex w-full flex-shrink-0 flex-col gap-3 md:w-[250px]">
                          <ExpressInterestButton
                            key={`${profile.id}-${selectedJobId}`}
                            id={String(profile.id)}
                            hasExpressedInterest={hasExpressedInterest}
                            onExpressInterest={() => handleToggleInterest(profile.id)}
                            size="lg"
                            disabled={!selectedJobId}
                          />
                        </div>
                        {toggleInterestError && (
                          <p className="mt-1 text-left text-sm text-[#FF5722]">
                            {toggleInterestError}
                          </p>
                        )}
                      </div>

                      {/* Separator */}
                      <div className="my-4 border-t border-gray-200"></div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Contact Info */}
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-700">Contact Information</h4>
                          <p className="text-sm text-gray-600">Email: {profile.user.email}</p>
                          <p className="text-sm text-gray-600">
                            Phone: {formatPhone(profile.phone)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Location:{' '}
                            {profile.street_address &&
                              `${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zipcode}`}
                          </p>
                          <button
                            onClick={() => handleCopyContact(profile)}
                            className="mt-4 text-sm text-blue-600 hover:underline"
                          >
                            {copyStatus[profile.id] === 'Copied!' ? (
                              <div className="flex">
                                <Check size={16} className="text-green-600" />
                                <span className="ml-2 text-xs text-green-600">Copied</span>
                              </div>
                            ) : (
                              <div className="flex">
                                <ClipboardCopy size={16} />
                                <span className="ml-2 text-xs">Copy Contact Info</span>
                              </div>
                            )}
                          </button>
                        </div>

                        {/* Documents & Media */}
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-700">Documents & Media</h4>
                          <div className="space-y-1 text-sm">
                            {profile.resume && (
                              <div>
                                <a
                                  href={profile.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Resume
                                </a>
                              </div>
                            )}
                            {profile.video_url && (
                              <div>
                                <a
                                  href={profile.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Video
                                </a>
                              </div>
                            )}
                          </div>
                          {profile.placement_preferences &&
                            profile.placement_preferences.length > 0 && (
                              <div className="mt-4">
                                <h5 className="mb-1 font-semibold text-gray-700">Preferences</h5>
                                <div className="flex flex-wrap gap-1">
                                  {profile.placement_preferences.map((pref) => (
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
                            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Profile Created: {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                          {profile.submitted_at && (
                            <p className="text-sm text-gray-600">
                              Submitted: {new Date(profile.submitted_at).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Last Updated: {new Date(profile.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

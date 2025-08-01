import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ClipboardCopy, Check } from 'lucide-react';
import UserIcon from '@/components/UserIcon';
import ExpressInterestButton from '../../components/ExpressInterestButton';
import { Profile } from '@/context/ProfileContext';
import { JobListing, MutualInterest } from '../../types';
import {
  getApprovedCandidates,
  getChurchJobs,
  expressChurchInterest,
  withdrawInterest,
  getChurchInterests,
} from '../../utils/api';
import { formatPhone, mergeProfilesWithInterest } from '@/utils/helpers';

export default function ChurchSearch() {
  const [search, setSearch] = useState('');
  const [churchJobListings, setChurchJobListings] = useState<JobListing[]>([]); // To associate with interest
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [allInterests, setAllInterests] = useState<MutualInterest[]>([]);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});

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
        console.error('Error fetching initial data:', error);
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
    const existingInterest = allInterests.find(
      (i) => i.profile === profileId && i.job_listing === Number(selectedJobId)
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
      console.error('Failed to toggle interest:', error);
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
      (err) => {
        console.error('Could not copy text: ', err);
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Failed' }));
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Search Candidates</h1>
        </header>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            How Expressing Interest Works
          </h3>
          <div className="text-blue-700 space-y-2 text-sm">
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
                className="text-blue-800 font-semibold cursor-pointer hover:underline"
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
                className="font-semibold text-blue-800 cursor-pointer hover:underline"
              >
                {' '}
                job listing{' '}
              </Link>
              to get started or contact the
              <a
                href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Assistance%20Request"
                className="font-semibold text-blue-800 cursor-pointer hover:underline"
              >
                {' '}
                site admin{' '}
              </a>
              for assistance.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {churchJobListings && churchJobListings.length > 0 && (
            <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
              <label htmlFor="job-select" className="text-2xl font-bold text-gray-800 mb-1">
                Expressing interest for:
              </label>
              <select
                id="job-select"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="mt-1 w-full md:max-w-sm pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-efcaAccent focus:border-efcaAccent sm:text-sm rounded-md shadow-sm"
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
            type="text"
            name="search"
            placeholder="Search by name, email, city, or state abbreviation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          {!selectedJobId && (
            <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded">
              <p>
                You must{' '}
                <Link href="/church/jobs/create" className="text-blue-600 hover:underline">
                  create a job listing
                </Link>{' '}
                before expressing interest in candidates.
              </p>
            </div>
          )}
          {filteredProfiles.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No candidates found matching your criteria.
            </div>
          ) : (
            <ul className="space-y-6">
              {profilesWithInterest &&
                filteredProfiles.map((profile) => {
                  const hasExpressedInterest =
                    profile.interest?.expressed_by === 'church' &&
                    profile.interest?.job_listing === Number(selectedJobId);
                  return (
                    <li
                      key={profile.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      {/* Top Section */}
                      <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center">
                        {/* Candidate Info */}
                        <div className="flex flex-col items-center gap-6 flex-grow md:flex-row">
                          <div className="flex-shrink-0">
                            {profile && profile?.profile_image ? (
                              <img
                                src={profile.profile_image}
                                alt={`${profile.user.first_name} ${profile.user.last_name}`}
                                className="w-40 h-40 md:w-36 md:h-36 object-cover rounded-full border-2 border-gray-300 shadow-xlg"
                              />
                            ) : (
                              <div className="object-cover rounded-full">
                                <UserIcon />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-gray-800">{`${profile.user.first_name} ${profile.user.last_name}`}</h3>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full md:w-[250px] flex-shrink-0 flex flex-col gap-3">
                          <ExpressInterestButton
                            id={String(profile.id)}
                            hasExpressedInterest={hasExpressedInterest}
                            onExpressInterest={() => handleToggleInterest(profile.id)}
                            size="lg"
                            disabled={!selectedJobId}
                          />
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="border-t border-gray-200 my-4"></div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        {/* Contact Info */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
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
                          <h4 className="font-semibold text-gray-700 mb-2">Documents & Media</h4>
                          <div className="text-sm space-y-1">
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
                                <h5 className="font-semibold text-gray-700 mb-1">Preferences</h5>
                                <div className="flex flex-wrap gap-1">
                                  {profile.placement_preferences.map((pref) => (
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

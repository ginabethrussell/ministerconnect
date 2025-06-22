# Scenario: Candidate Expresses Interest in a Job Listing

**Actor:** Candidate  
**Goal:** Signal interest in a specific church job listing

## Preconditions
- Candidate is authenticated
- Candidate has a complete profile
- Job listing is active and visible
- Candidate has not already expressed interest in this job

## Main Flow
1. Candidate logs in and navigates to the job listings page.
2. The system filters out listings the candidate has already interacted with.
3. Candidate views a job detail and clicks "Express Interest".
4. The system:
   - Records the interest in the `mutual_interests` table
   - Links the interest to the `expressed_by_user_id` and `profile_id`

## Postconditions
- Interest is stored in the DB
- Mutual match may be formed if church has already expressed interest


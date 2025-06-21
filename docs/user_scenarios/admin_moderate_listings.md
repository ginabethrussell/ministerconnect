# Scenario: Admin Moderates Job Listings

**Actor:** Admin  
**Goal:** Approve, reject, or flag job listings

## Preconditions
- Admin is authenticated

## Main Flow
1. Admin visits the moderation panel.
2. System shows all job listings with status `pending`, `active`, `flagged`.
3. Admin selects an action (approve, reject, disable).
4. System updates the `job_listings` record status.

## Postconditions
- Listing status is updated

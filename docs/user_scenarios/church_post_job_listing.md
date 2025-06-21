# Scenario: Church Posts a New Job Listing

**Actor:** Church  
**Goal:** Create a job opportunity listing visible to candidates

## Preconditions
- Church is authenticated
- Church profile is complete and active

## Main Flow
1. Church logs in and navigates to “Post a Job” screen.
2. Church completes a form with:
   - Title
   - Ministry type
   - Employment type
   - Required URL for external job page
3. Church submits the form.
4. System:
   - Validates required fields
   - Creates new `job_listings` record tied to `church_id`
   - Sets listing status to `active`

## Postconditions
- Job listing is available to eligible candidates in their feed
- Church can view, edit, or deactivate listing from dashboard

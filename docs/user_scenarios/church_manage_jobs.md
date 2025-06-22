# Scenario: Church Manages Job Listings

**Actor:** Church  
**Goal:** Create, edit, and manage job listings for their church

## Preconditions
- Church is authenticated
- Church account is active
- Church has permission to post job listings

## Main Flow
1. Church accesses the job management dashboard.
2. Church can:
   - View all their job listings
   - See status of each listing (pending, approved, rejected)
   - Create new job listings
   - Edit existing job listings
   - Delete job listings
3. For creating new job listings:
   - Church fills out job details:
     - Job title
     - Ministry type
     - Employment type
     - Job description
     - About church section
   - Church submits for review
   - System creates listing with 'pending' status
4. For managing existing listings:
   - Church can edit listing details
   - Can view candidate interest in listings
   - Can see review status and feedback
   - Can delete listings if needed
5. System provides:
   - Job listing status tracking
   - Candidate interest notifications
   - Review feedback from admins
   - Integration with candidate matching

## Postconditions
- Job listings are created and managed
- Churches can track listing status
- System maintains quality control through review process
- Churches can respond to candidate interest

## Notes
- All job listings require admin approval before going live
- Churches can edit listings while pending
- Rejected listings include feedback for improvement
- System tracks all job listing activity 

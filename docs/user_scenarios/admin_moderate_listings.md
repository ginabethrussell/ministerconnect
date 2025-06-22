# Scenario: Admin Moderates Job Listings

**Actor:** Admin  
**Goal:** Review and moderate job listing submissions from churches

## Preconditions
- Admin is authenticated
- Admin has job listing moderation permissions
- Churches have submitted job listings for review

## Main Flow
1. Admin accesses the job listing review dashboard.
2. Admin can:
   - View pending job listing submissions
   - Review listing details including:
     - Job title and description
     - Ministry type and employment details
     - Church information
     - About church section
   - Approve or reject job listings
   - Add comments or feedback
3. For job listing approval:
   - Admin reviews all submitted information
   - Can approve, reject, or request changes
   - System updates listing status
   - Church is notified of decision
4. System provides:
   - Job listing review queue
   - Status tracking
   - Integration with activity logging

## Postconditions
- Job listing review decisions are made
- Churches are notified of outcomes
- System maintains quality control over job postings
- Review activities are logged

## Notes
- Admins have authority to approve/reject job listings
- All review decisions are logged for audit
- Listings can be approved, rejected, or returned for changes
- System tracks review timestamps and decisions


# Scenario: Admin Moderates Candidate Profiles

**Actor:** Admin  
**Goal:** Review and moderate candidate profile submissions

## Preconditions

- Admin is authenticated
- Admin has profile moderation permissions
- Candidate profiles are submitted for review

## Main Flow

1. Admin accesses the profile review dashboard.
2. Admin can:
   - View pending profile submissions
   - Review profile details including:
     - Personal information
     - Resume and video submissions
     - Placement preferences
   - Approve or reject profiles
   - Add comments or feedback
3. For profile approval:
   - Admin reviews all submitted materials
   - Can approve, reject, or request changes
   - System updates profile status
   - Candidate is notified of decision
4. System provides:
   - Profile review queue
   - Status tracking
   - Integration with activity logging

## Postconditions

- Profile review decisions are made
- Candidates are notified of outcomes
- System maintains quality control
- Review activities are logged

## Notes

- Admins have authority to approve/reject profiles
- All review decisions are logged for audit
- Profiles can be approved, rejected, or returned for changes
- System tracks review timestamps and decisions

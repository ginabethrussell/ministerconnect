# Scenario: Superadmin Manages Invite Codes

**Actor:** Superadmin  
**Goal:** Complete invite code system management and oversight

## Preconditions
- Superadmin is authenticated
- Superadmin has full system permissions

## Main Flow
1. Superadmin accesses the invite code management dashboard.
2. Superadmin can:
   - View all invite codes in the system
   - Search codes by code string or event description
   - Filter by status (active, expired, used)
   - Create new invite codes with:
     - Unique code string
     - Human-readable event description
     - Expiration date (default 24 hours)
   - Monitor usage statistics for each code
   - Edit existing codes (event description, expiration)
   - Deactivate codes before expiration
   - Delete unused codes
3. System provides:
   - Real-time usage tracking
   - Status indicators (active, expired, used)
   - Copy functionality for reset links
   - Audit trail of code creation and usage

## Postconditions
- Invite codes are properly managed and tracked
- System maintains security through controlled access
- Complete audit trail of code management activities
- Users can register using valid, active codes

## Notes
- Superadmins have complete control over the invite code system
- Codes are simplified without type restrictions
- Each code has a human-readable event description for clarity
- Usage tracking shows how many times each code has been used
- Expired and used codes are clearly marked 

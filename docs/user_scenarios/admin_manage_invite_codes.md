# Scenario: Admin Manages Invite Codes

**Actor:** Admin  
**Goal:** Create and manage invite codes for user registration

## Preconditions
- Admin is authenticated
- Admin has invite code management permissions

## Main Flow
1. Admin navigates to the Invite Code management panel.
2. Admin can:
   - View existing invite codes
   - Create new invite codes with:
     - Unique code string
     - Event description (human-readable purpose)
     - Expiration date
   - Monitor usage statistics (used count)
   - Set code status (active, expired, used)
3. Admin submits the form.
4. System:
   - Creates a new `invite_codes` record
   - Displays usage stats (used count)
   - Allows deactivation or editing of existing codes

## Postconditions
- Code is available for new user registration
- Admin can track usage and manage code lifecycle
- Users can register using the generated codes

## Notes
- Invite codes are now simplified without type restrictions
- Each code has a human-readable event description
- Usage tracking shows how many times the code has been used



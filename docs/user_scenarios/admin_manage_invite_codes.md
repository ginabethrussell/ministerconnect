# Scenario: Admin Manages Invite Codes

**Actor:** Admin  
**Goal:** Create and manage invite codes for limited access onboarding

## Preconditions
- Admin is authenticated
- System has an invite code system enabled

## Main Flow
1. Admin navigates to the Invite Code management panel.
2. Admin chooses to:
   - Create a new invite code
   - Limit by number of uses or event
   - Set code `status` (e.g., `active`, `expired`)
3. Admin submits the form.
4. System:
   - Creates a new `invite_codes` record
   - Displays usage stats (used count, remaining)
   - Allows deactivation or editing of existing codes

## Postconditions
- Code is available for new user registration
- Admin can track usage and revoke codes if needed

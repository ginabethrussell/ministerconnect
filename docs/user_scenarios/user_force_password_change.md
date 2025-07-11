# Scenario: User Force Password Change

**Actor:** Any User (Candidate, Church, Admin, Superadmin)  
**Goal:** Change password on first login or when required by admin

## Preconditions

- User is authenticated
- User has `requires_password_change` flag set to true
- User is accessing the system for the first time or after admin reset

## Main Flow

1. User logs in successfully.
2. System detects `requires_password_change` flag.
3. User is automatically redirected to force password change page.
4. User cannot access other parts of the system until password is changed.
5. User enters:
   - Current password (for verification)
   - New password (minimum 8 characters)
   - Confirm new password
6. System validates:
   - Current password is correct
   - New password meets security requirements
   - Passwords match
7. System updates password:
   - Hashes new password securely
   - Sets `requires_password_change` to false
   - Logs the password change activity
8. User is redirected to their appropriate dashboard.

## Postconditions

- User password is updated
- User can access all system features
- Password change is logged for audit
- `requires_password_change` flag is cleared

## Notes

- This flow is mandatory when the flag is set
- User cannot bypass this step
- Password requirements are enforced
- All password changes are logged for security audit

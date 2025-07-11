# Scenario: User Forgot Password

**Actor:** Any User (Candidate, Church, Admin, Superadmin)  
**Goal:** Reset password when forgotten

## Preconditions

- User has a valid account in the system
- User cannot remember their password

## Main Flow

1. User navigates to the login page.
2. User clicks "Forgot Password" link.
3. User enters their email address.
4. System validates the email address:
   - If email exists, generates a secure reset token
   - If email doesn't exist, shows same success message (security)
5. System sends reset email with:
   - Secure reset link containing token
   - Token expiration information (1 hour)
   - Instructions for password reset
6. User receives email and clicks reset link.
7. User is taken to password reset page with token pre-filled.
8. User enters new password (minimum 8 characters).
9. System validates and updates password:
   - Hashes new password securely
   - Invalidates the reset token
   - Logs the password reset activity

## Postconditions

- User can log in with new password
- Reset token is invalidated after use
- Password reset is logged for security audit

## Notes

- Reset tokens are single-use and expire after 1 hour
- Same success message shown regardless of email existence (security)
- New passwords must meet minimum security requirements
- All password resets are logged for audit purposes

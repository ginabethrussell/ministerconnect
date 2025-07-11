# Scenario: Superadmin Manages Users

**Actor:** Superadmin  
**Goal:** Complete user account management and oversight

## Preconditions

- Superadmin is authenticated
- Superadmin has full system permissions

## Main Flow

1. Superadmin accesses the user management dashboard.
2. Superadmin can:
   - View all users in the system with detailed information
   - Search and filter users by role, status, or name
   - View user activity and login history
   - Reset user passwords using secure reset tokens
   - Change user roles (candidate, church, admin, superadmin)
   - Activate, suspend, or deactivate user accounts
   - View password reset history for each user
3. For password resets:
   - Superadmin generates a secure reset token
   - System creates a reset link with the token
   - Token expires in 24 hours
   - User receives reset link via email (or superadmin can copy link)
4. Superadmin can monitor:
   - User registration dates
   - Last login timestamps
   - Account status changes
   - Password reset activity

## Postconditions

- User accounts are properly managed
- Security is maintained through secure reset tokens
- Complete audit trail of administrative actions
- Users can securely reset their passwords

## Notes

- Superadmins have complete control over all user accounts
- Password resets use secure tokens instead of temporary passwords
- All actions are logged in the activity log for audit purposes
- Reset tokens are single-use and time-limited for security

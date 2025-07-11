# Scenario: Admin Manages Users

**Actor:** Admin  
**Goal:** View and manage user accounts within their scope

## Preconditions

- Admin is authenticated
- Admin has appropriate permissions

## Main Flow

1. Admin accesses the admin dashboard.
2. Admin can view:
   - List of users in the system
   - User roles and status
   - Basic user information
3. Admin can perform limited user management tasks:
   - View user details
   - Monitor user activity
   - Report issues to superadmin

## Postconditions

- Admin has visibility into user accounts
- Issues are reported to superadmin for resolution

## Notes

- Admins have limited user management capabilities compared to superadmins
- Full user management (password resets, role changes, suspensions) is handled by superadmins

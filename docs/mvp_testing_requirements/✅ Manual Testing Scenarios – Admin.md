# **✅ Manual Testing Scenarios – Admin**

Below is a checklist of admin-facing manual test scenarios:

| Scenario                           | Steps                                                                                  | Expected Outcome                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Create Church with New Users       | Log in as admin → Navigate to “Create Church” → Fill in details → Add user(s) → Submit | Church and users are created; users are listed under the church        |
| Edit Church and Add New User       | Admin edits existing church → Adds a new user → Submit                                 | New user added; existing users remain unchanged                        |
| Attempt to Create Duplicate User   | Try adding a user with an email that already exists                                    | Validation error shown; user not duplicated                            |
| Attempt to Create Duplicate Church | Try creating a church with the same name/city/state                                    | Validation error shown for duplicate church                            |
| View Invite Codes                  | Navigate to "Manage Invite Codes"                                                      | List of codes shown with status and expiration                         |
| Create Invite Code                 | Enter code, event, expiration → Submit                                                 | Invite code added to list                                              |
| Create Duplicate Invite Code       | Submit a code that already exists                                                      | Error shown for duplicate code                                         |
| Deactivate Invite Code             | Click “Deactivate” on a code                                                           | Status updates to “inactive”                                           |
| View Pending Profiles              | Navigate to “Review Profiles”                                                          | Pending profiles appear                                                |
| Approve Candidate Profile          | Click on a profile → Click Approve                                                     | Profile status changes to `approved`                                   |
| Submit Incomplete Profile          | Try to approve a profile with missing required fields                                  | Validation prevents approval                                           |
| View All Job Listings              | Navigate to “Review Jobs”                                                              | All job listings are visible                                           |
| Approve or Reject Job              | Click Approve or Reject on a job                                                       | Job status updates in UI and backend                                   |
| View Mutual Matches                | Navigate to “Admin Matches” tab                                                        | Only mutual (church \+ candidate) interest pairs shown                 |
| Access Admin Views as Non-Admin    | Try accessing `/admin/...` as candidate/church user                                    | Access denied (403 or redirect)                                        |
| No Invite Codes                    | Navigate to Invite Codes with none created                                             | Empty state message shown                                              |
| Handle Slow Network                | Simulate slow connection during form submission                                        | Buttons disable while request is in flight; form doesn't double-submit |

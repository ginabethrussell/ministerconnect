## **✅ Manual Testing Scenarios \- Candidate**

Below is a checklist of candidate-facing manual test scenarios:

| Scenario | Steps | Expected Outcome |
| ----- | ----- | ----- |
| **Candidate Registration via Invite Code** | Navigate to register, enter valid invite code and required fields | Registered user and receives confirmation |
| Registration with invalid invite code | Enter incorrect invite code | Error message indicating invalid code |
| **Login** | Log in with correct credentials | Redirected to candidate dashboard |
| Login failure (wrong password/email) | Enter invalid credentials | Error message, no login |
| **Admin Password Reset Workflow** | Admin resets candidate's password to temporary one, candidate logs in with temp password and then resets | Candidate successfully sets new password |
| **Profile Draft Save** | Log in, fill partial profile, save as draft | Saved and can return to edit later |
| **Profile Pending Submission (validation)** | Complete all required fields, including resume, and submit | Status changes to pending |
| Incomplete submission | Try to submit missing required fields | Validation error, cannot submit |
| **Profile Reset / Re-edit** | Use reset endpoint to clear profile | profile cleared to blank draft |
| **Admin Profile Approval** | Admin reviews pending candidate profile and approves it | Candidate status transitions to approved |
| **Access to Jobs after approval** | As candidate with approved profile, browse jobs | Jobs list is visible |
| Access jobs before approval | As candidate with pending/draft profile, attempt to view jobs | Access denied or empty list |
| **Express interest in a job** | Click interest button on a listing | Express interest API called; UI updates to "Interested" |
| Withdraw interest | Click again or dedicated button | API call withdraws interest; UI reflects withdrawal |
| Edge case: express interest twice | Repeated clicks | Prevent duplicate interest or toggle behavior |
| Interaction UX | Ensure buttons disable during pending API state | Prevent double-click bugs |


## **✅ Manual Testing Scenarios \- Churches**

Below is a checklist of **church-facing** manual test scenarios:

| Scenario                                      | Steps                                                                  | Expected Outcome                                       |
| --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| **Church Registration via Admin Invite**      | Log in using email and password from admin invite                      | User is authenticated and directed to church dashboard |
| **Login Failure (wrong credentials)**         | Enter incorrect email or password                                      | Error message shown, login denied                      |
| **Church Profile Management (if applicable)** | View or edit church profile                                            | Changes saved; validations enforced                    |
| **Create a Job Listing**                      | Click “Add Job”, fill required fields, submit                          | Job is created in “pending” or “draft” state           |
| **Validation Errors on Job Form**             | Submit job form with missing required fields                           | Validation messages shown; submission blocked          |
| **Edit Existing Job Listing**                 | Open a previously created job and edit fields                          | Changes saved; updated job details shown               |
| **Delete Job Listing**                        | Click delete icon on a job                                             | Job removed from list; backend confirms deletion       |
| **See Only Own Church’s Jobs**                | Log in as Church A, check job list                                     | Only Church A’s jobs are visible                       |
| **View Approved Candidates**                  | Navigate to candidate browsing                                         | Only candidates approved by admin are shown            |
| **Express Interest in a Candidate**           | Click “Express Interest” on a candidate card                           | API called; button updates to show interest expressed  |
| **Withdraw Interest in a Candidate**          | Click again or use “Withdraw” action                                   | Interest withdrawn; UI reflects this                   |
| **Mutual Match Visibility**                   | Express interest in candidate who also expressed interest              | Candidate appears in “Mutual Matches” list             |
| **Job Filter in Mutual Matches View**         | Apply job filter dropdown on matches view                              | Matches update to only show for selected job           |
| **No Matches Yet**                            | Navigate to matches before any candidate has reciprocated              | Empty list with appropriate message                    |
| **Edge Case: Express interest twice**         | Click express multiple times rapidly                                   | No duplicate records; UI toggles safely                |
| **Access Control Enforcement**                | Attempt to access another church’s jobs or candidates (via direct URL) | Access denied or 403 response                          |
| **UI Loading States**                         | Test interest buttons during API call delay                            | Spinner or disabled state prevents double action       |

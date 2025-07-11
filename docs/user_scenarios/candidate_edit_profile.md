# Scenario: Candidate Edits Their Profile

**Actor:** Candidate  
**Goal:** Provide necessary information for churches to evaluate interest

## Preconditions

- Candidate is logged in
- Candidate has not already submitted a complete profile

## Main Flow

1. Candidate accesses their profile page.
2. System displays form with:
   - Name, contact info
   - Ministry/placement preferences
   - Resume, photo, video URL
3. Candidate fills out and submits the form.
4. System updates `profiles` table.
5. System flags profile as complete if all required fields are present.

## Postconditions

- Candidate profile is saved and eligible for viewing by churches

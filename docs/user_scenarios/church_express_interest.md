# Scenario: Church Expresses Interest in a Candidate

**Actor:** Church  
**Goal:** Mark a candidate as someone they want to connect with

## Preconditions
- Church is authenticated
- Candidate profile is viewable

## Main Flow
1. Church browses candidates.
2. Clicks “Express Interest” on a profile.
3. System creates a record in `mutual_interests` with `expressed_by = church`.
4. System checks for prior interest from the candidate.
5. If mutual, a match is created and shown to both parties.

## Postconditions
- Interest is logged and potential match created


# Scenario: Candidate Registers and Logs In

**Actor:** Candidate  
**Goal:** Create an account and access the application

## Preconditions
- Invite code (if required) is valid and unused

## Main Flow
1. Candidate visits registration page.
2. Candidate enters email, password, and invite code.
3. System validates invite code and creates user with `role = candidate`.
4. Candidate is prompted to log in.
5. Candidate enters credentials.
6. System authenticates and redirects to profile setup or dashboard.

## Postconditions
- Candidate has an account and is authenticated

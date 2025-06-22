# Scenario: Church Registers and Logs In

**Actor:** Church  
**Goal:** Create a church-affiliated account and access dashboard

## Preconditions
- Invite code (if required) is valid
- Church record may or may not already exist

## Main Flow
1. Church user visits registration page.
2. Enters email, password, and invite code (if applicable).
3. System validates and creates user with `role = church`.
4. Church logs in with credentials.
5. If church is not associated with a user, system prompts to create a church profile.

## Postconditions
- Church user is authenticated and linked to a church record


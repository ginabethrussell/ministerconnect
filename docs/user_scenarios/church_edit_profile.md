# Scenario: Church Edits Their Profile

**Actor:** Church  
**Goal:** Provide ministry context and contact info

## Preconditions
- Church is authenticated

## Main Flow
1. Church user accesses profile page.
2. System displays form to edit:
   - Church name, email, phone, address, website
   - Status (e.g., active, inactive)
3. User submits changes.
4. System updates `churches` table.

## Postconditions
- Profile is updated and visible to candidates

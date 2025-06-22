# Scenario: Church Views Mutual Matches

**Actor:** Church  
**Goal:** See which candidates have mutually expressed interest

## Preconditions
- Church is authenticated
- One or more mutual interests exist

## Main Flow
1. Church visits “Matches” section.
2. System queries `mutual_interests` where candidate and church have both expressed interest.
3. Matching profiles and jobs are displayed.

## Postconditions
- Church sees a list of connected candidates


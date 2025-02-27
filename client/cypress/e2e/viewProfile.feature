Feature: View User Profile
  As a logged-in user, I want to be able to view my profile so that I can see my account details.

  Scenario: Successfully view the user profile
    Given The user can access the homepage "http://localhost:3000"
    And The user is logged in with valid credentials
    When The user clicks on the "Profile" button
    Then The users should see their Username, Email, About Me, and LinkedIn details

  Scenario: Attempt to view profile while not logged in
    Given The user can access the homepage "http://localhost:3000"
    When The user is not logged in
    Then the user should not see "Profile" button

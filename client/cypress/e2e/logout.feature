Feature: User Logout
  As a logged-in user, I want to be able to log out so that I can securely end my session.

  Scenario: Successfully logging out of the application
    Given The user can access the homepage "http://localhost:3000"
    And The user is logged in with valid credentials
    When The user clicks on the "Logout" button on the header
    Then The user should see "Login" and "Sign Up" button on the header

  Scenario: Attempt to see logout button fails
    Given The user can access the homepage "http://localhost:3000"
    When The user is not able to log in with valid credentials
    Then The user should not see "Logout" button on the header  


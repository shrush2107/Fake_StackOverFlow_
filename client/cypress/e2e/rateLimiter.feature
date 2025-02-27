Feature: Rate Limiter for Login and Logout
  As a user of the system,
  I want the system to prevent excessive login/logout attempts
  So that the application can protect against brute-force attacks.

  Scenario: Rate limiting login 
    Given The user can access the homepage "http://localhost:3000"
    When The user attempts to log in with valid credentials 5 times
    Then The user should see "Too many requests. Please try again later."
    And The user should not be able to log in
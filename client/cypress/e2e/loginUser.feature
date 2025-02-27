Feature: User Login System
  Context: To help stakeholders using FakeStackOverflow keep track of and better interact with questions and answers, 
  we intend to implement a user login system. This will allow stakeholders to take accountability for their submissions to the forum.
  Stakeholders: Any user of this app
  Goal: As a user of this app, I would like to be able to create a user account and have my contributions to the forum linked to said account.

Scenario: Successful SignUp and Login new user that is created
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp and Register a new user
    Then The user should see "Welcome, User2" on homepage

Scenario: Unsuccessful Login (invalid password not existing in database)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with invalid password
    Then The user should see "Invalid email/username or password"

Scenario: Unsuccessful Login (invalid username not existing in database)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with invalid username
    Then The user should see "Invalid email/username or password"

Scenario: Unsuccessful Login (invalid email not existing in database)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with invalid email
    Then The user should see "Invalid email/username or password"

Scenario: Unsuccessful Login (Empty Credential)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with empty credentials
    Then The user should see "Email or Username cannot be empty" for empty email or username
    And  The user should see "Password cannot be empty" for empty password

Scenario: Successful Login existing user using username
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with valid username
    Then The user should see "Welcome, User1" on homepage

Scenario: Successful Login existing user using email
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login with valid email
    Then The user should see "Welcome, User1" on homepage


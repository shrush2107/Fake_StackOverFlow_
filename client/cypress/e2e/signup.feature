Feature: User Signup System 
  Context: To help stakeholders using FakeStackOverflow keep track of and better interact with questions and answers, 
  we intend to implement a user Sign up system. This will allow stakeholders to take accountability for their submissions to the forum.
  Stakeholders: Any user of this app
  Goal: As a user of this app, I would like to be able to create a user account and have my contributions to the forum linked to said account.

Scenario: Unsuccessful Sign Up - Username Exist already 
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Username Exist already
    Then The user should not be able to Register     

Scenario: Unsuccessful Sign Up - Email Exist already 
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Email Exist already
    Then The user should not be able to Register   

Scenario: Successful SignUp and Login new user that is created
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp and Register a new user
    Then The user should see "Welcome, User2" on homepage

Scenario: Unsuccessful Sign Up - About me empty
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with About me empty 
    Then The user should see "About Me cannot be empty"
    
Scenario: Unsuccessful Sign Up - LinkedIn empty
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with LinkedIn empty
    Then The user should see "LinkedIn cannot be empty"

Scenario: Unsuccessful Sign Up - LinkedIn with invalid URL
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with LinkedIn with invalid URL
    Then The user should see "Invalid LinkedIn URL format"    

Scenario: Unsuccessful Sign Up - Username empty
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Username empty
    Then The user should see "Username cannot be empty"

Scenario: Unsuccessful Sign Up - Username not between 3 and 20 characters
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Username not between 3 and 20 characters
    Then The user should see "Username must be between 3 and 20 characters"    

Scenario: Unsuccessful Sign Up - Email empty
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Email empty
    Then The user should see "Email cannot be empty"

Scenario: Unsuccessful Sign Up - Email invalid format
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Email in invalid format
    Then The user should see "Invalid email format"

Scenario: Unsuccessful Sign Up - Password empty
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Password empty
    Then The user should see "Password cannot be empty"        

Scenario: Unsuccessful Sign Up - Password less than 8 characters
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Password less 8 characters
    Then The user should see "Password must be at least 8 characters long"        

Scenario: Unsuccessful Sign Up - Password invalid format
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to SignUp with Password invalid format
    Then The user should see "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"     


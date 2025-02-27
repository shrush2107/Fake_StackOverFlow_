Feature: viewing Answers and Adding new answer
    As a user with read and write access to Fake Stack Overflow
    I want to view an answers or add a new answer to the question
    So that I can contribute to the community 

  Scenario: Verify the content for question with no answer
    Given The user has write access to the application "http://localhost:3000"
    When the user adds a question with all the fields
    And the user clicks on "Test Question 1"
    Then The user should see no answer  

  Scenario: Verify all the metadata related to question
    Given The user has write access to the application "http://localhost:3000"
    When the user clicks on "Quick question about storage on android"
    Then The user should see the question description and other related metadata   

  Scenario: Verify all the metadata of the answer
    Given The user has write access to the application "http://localhost:3000"
    When the user clicks on "Object storage for a web application"
    Then The user should see all the answers and related metadata 

  Scenario: Add a new answer successfully
    Given The user has write access to the application "http://localhost:3000"
    And the user is logged in
    When the user clicks on "Quick question about storage on android"
    And the user answers the question
    Then The user should see the new answer

  Scenario: Attempt to add answer with empty text
    Given The user has write access to the application "http://localhost:3000"
    And the user is logged in
    When the user clicks on "Quick question about storage on android"
    And the user answers the question with empty text
    Then The user should see an error message "Answer text cannot be empty"
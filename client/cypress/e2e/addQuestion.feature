Feature: Adding new questions
    As a user with write access to Fake Stack Overflow
    I want to add a new question to the application
    So that I can ask a question to the community

  Scenario: Add a new question successfully
    Given The user has write access to the application "http://localhost:3000"
    When the user adds a valid question with all the fields
    Then The user should see the new question in the All Questions page with the metadata information

  Scenario: Attempt to add a question with a title longer than 100 characters
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with title more than 100 characters
    Then The user should see an error message "Title cannot be more than 100 characters"

  Scenario: Attempt to add a question with more than 5 tags
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with more than 5 tags
    Then The user should see an error message "Cannot have more than 5 tags"

  Scenario: Attempt to add a question with a empty title 
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with empty title
    Then The user should see an error message "Title cannot be empty"

  Scenario: Attempt to add a question with a empty text
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with empty text
    Then The user should see an error message "Question text cannot be empty"

  Scenario: Attempt to add a question with a empty tags
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with empty tags
    Then The user should see an error message "Should have at least 1 tag" 

Scenario: Add three questions and verify they are displayed
    Given The user has write access to the application "http://localhost:3000"
    When the user adds a valid question with all the fields
    And the user repeats the steps to post question 2
    And the user repeats the steps to post question 3
    Then The user should see the all new question in newest first order on All Questions page with the metadata information

 Scenario: Attempt to add a question with a tag longer than 20 characters
    Given The user has write access to the application "http://localhost:3000"
    When The user fills out all details with a tag longer than 20 characters
    Then The user should see an error message "New tag length cannot be more than 20"
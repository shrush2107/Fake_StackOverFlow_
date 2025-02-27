Feature: Filter Questions by Unanswered
As a user with read access to Fake Stack Overflow,
I want to filter questions to see only those without any answers,
So that I can focus on questions that need responses.

  Scenario: Show the unanswered question then answer the question and check the tab again
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to post a question
    And The user clicks on the "Unanswered" tab
    And The user sees the unanswered question in the database
    And The user does all the necessary steps to post an answer
    Then The user should see "0 questions" in the database that are Unanswered

  Scenario: Show all questions in Unanswered order on user request(No unanswered questions)
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Unanswered" tab
    Then The user should see "0 questions" in the database that are Unanswered


  Scenario: Show all questions in Unanswered order on user request(unanswered question exist)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to post a question
    And The user clicks on the "Unanswered" tab
    Then The user should see the unanswered question in the database
  

  Scenario: Show all questions in Unanswered order on user request in newest first order( 2 unanswered questions)
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to post the first question
    And the user repeats all the steps to post the second question
    And The user clicks on the "Unanswered" tab
    Then The user should see all the unanswered questions in the database in the order they were posted
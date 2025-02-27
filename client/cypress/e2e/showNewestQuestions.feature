Feature: Filter Questions by Newest
  As a user with read access to Fake Stack Overflow,
  I want to filter questions to see the newest ones first,
  So that I can stay updated on the latest questions.

  Scenario: Show the newest question after posting a new question
    Given The user can access the homepage "http://localhost:3000"
    When The user does all the necessary steps to post a new question
    And The user clicks on the "Newest" tab
    Then The user should see the newly posted question at the top of the list

  Scenario: Show questions sorted by newest first when no new questions are added
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on the "Newest" tab
    Then The user should see all questions in the database sorted by the newest first

  Scenario: Show multiple new questions in order when two are added
    Given The user can access the homepage "http://localhost:3000"
    When The user does all the necessary steps to post a new question
    And The user repeats the steps to post a second question
    And The user clicks on the "Newest" tab
    Then The user should see the second question at the top and the first question just below it

  Scenario: Show newest questions after switching back from another tab
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on the "Unanswered" tab
    And The user clicks back on the "Newest" tab
    Then The user should see all questions in the database sorted by the newest first

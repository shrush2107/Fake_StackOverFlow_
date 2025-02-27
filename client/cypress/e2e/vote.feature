Feature: Voting on questions in Stack Overflow
  In order to express my opinion on the quality of a question
  As a Stack Overflow user
  I want to be able to vote on questions

  Background:
    Given the user can access the homepage "http://localhost:3000"
  
  Scenario: Removing an upvote (downvoting after previously upvoting)
    When the user is logged in
    And the user has previously upvoted a particular question "android studio save string shared preference, start activity and load the saved string"
    When the user clicks on "Downvote" for that question
    Then the vote count for that question should decrease by 1
    And the button should now show "Upvote"

  Scenario: Upvoting a question
    When the user is logged in
    And the user has not voted on particular question "Quick question about storage on android"
    When the user clicks on "Upvote" for that question
    Then the vote count for that question should increase by 1
    And the button should now show "Downvote"

  Scenario: Viewing vote button when logged in
    When the user is logged in
    Then the user should see an "Upvote" button on questions they have not voted on
    And the user should see a "Downvote" button on questions they have previously upvoted

  Scenario: Viewing the voting button when not logged in
    When the user is not logged in
    Then the user should see an "Upvote" button on all questions
    And the "Upvote" button should be disabled and count should not increase

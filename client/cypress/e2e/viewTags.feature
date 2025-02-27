Feature: Manage and Explore Tags on Fake Stack Overflow  
  As a user with read and write access to Fake Stack Overflow,  
  I want to manage and explore tags on questions,  
  So that I can efficiently navigate, organize, and contribute to the platform.

   Scenario: Navigating Tags page not from homepage
    Given The user can access the homepage "http://localhost:3000"
    When The user click on "Quick question about storage on android"
    And The user click on "Tags" in the left panel
    And The user should see the name of each tag and count of questions associated with the tag in the database
    And The user click on "android-studio"
    Then The user should see the all the questions realted to that tag

   Scenario: Adding a question with tags and verifying tags exist
    Given The user can access the homepage "http://localhost:3000"
    When the user does all the necessary steps to Login and Post 2 Questions
    And The user click on "Tags" in the left panel
    Then The user should see all the new and old tags in the database

  Scenario: Navigating to questions under the android-studio tag
    Given The user can access the homepage "http://localhost:3000"
    When The user click on "Tags" in the left panel
    And The user click on "android-studio"
    Then The user should see the all the questions realted to that tag

  Scenario: Verifying all predefined tags and their count exist
    Given The user can access the homepage "http://localhost:3000"
    When The user click on "Tags" in the left panel
    Then The user should see the name of each tag and count of questions associated with the tag in the database

  Scenario: Clicking on a tag in homepage and verifying the questions related tag is displayed
    Given The user can access the homepage "http://localhost:3000"
    When The user click on "android-studio"
    Then The user should see the all the questions realted to that tag

 
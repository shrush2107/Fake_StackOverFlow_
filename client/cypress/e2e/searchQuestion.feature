Feature: Search functionality
As a user
I want to search for questions on the platform
So that I can find relevant content based on text or tags

Scenario: Search for a question using text content that does not exist
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "Web3" in the search bar and press enter
    Then the user should see no questions displayed 

Scenario: Search for a question using a tag that does not exist
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "[nonExistentTag]" in the search bar and press enter
    Then the user should see no questions displayed

Scenario: Search string in question text: 1
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "40 million" in the search bar and press enter
    Then the user should see a question with the title matching "Object storage for a web application"

Scenario: Search string in question text: 2
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "DaTa rEmains" in the search bar and press enter
    Then the user should see a question with the title matching "Quick question about storage on android"

Scenario: Search string in tag
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "[react]" in the search bar and press enter
    Then the user should see a question with the title matching "Programmatically navigate using React router"

Scenario: Search string in 2 tags
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "[react] [WebsIte]" in the search bar and press enter
    Then the user should see a question with the title matching 

Scenario: Search string in text and tag
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user types "navigate [WebsIte]" in the search bar and press enter
    Then the user should see a question with the title matching 

Scenario: Search string in text and tag from Tag Page
    Given The user can access the homepage "http://localhost:3000"
    When the user can see the homepage "All Questions"
    And the user click on "Tags" in the left panel
    And the user types "navigate [WebsIte]" in the search bar and press enter
    Then the user should see a question with the title matching     

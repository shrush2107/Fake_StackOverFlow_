Feature: Manage Answers
  As a user who has posted an answer
  I want to be able to edit or delete my answer
  So that I can keep my contributions accurate and relevant

  Background:
    Given the user can access the homepage "http://localhost:3000"

  
  Scenario: Edit an answer
  When the user is logged in 
  And clicks on "Quick question about storage on android"
  Then the user should see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."
  When the user clicks on Edit 
  And enters " You can also store in MongoDB" 
  And clicks on Save
  Then the user should see "Store data in a SQLLite database. You can also store in MongoDB"

  Scenario: Edit an answer (clicks on edit => cancel )
  When the user is logged in 
  And clicks on "Quick question about storage on android"
  Then the user should see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."
  When the user clicks on "Edit" 
  And enters "AbC" 
  And clicks on "Cancel"
  Then the user should see "Store data in a SQLLite database." 

  Scenario: No button for edit or delete on any answer (user not logged in)   
  When the user is not logged in
  And clicks on "Object storage for a web application"
  Then the user should not see any "Edit" or "Delete" button on answer "Storing content as BLOBs in databases."
  Then the user should not see any "Edit" or "Delete" button on answer "Using GridFS to chunk and store content."
  And clicks on "Questions" in the left panel
  And clicks on "Quick question about storage on android"
  Then the user should not see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."

  Scenario: No button for edit or delete on any answer (user is logged in but the answer is not by that user)   
  When the user is logged in 
  And clicks on "Object storage for a web application"
  Then the user should not see any "Edit" or "Delete" button on answer "Storing content as BLOBs in databases."
  Then the user should not see any "Edit" or "Delete" button on answer "Using GridFS to chunk and store content."

  Scenario: Delete an answer
  When the user is logged in 
  And clicks on "Quick question about storage on android"
  Then the user should see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."
  When the user clicks on "Delete" 
  Then the user should not see "Store data in a SQLLite database."

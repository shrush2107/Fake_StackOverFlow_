import { Given, When, Then, And,} from "cypress-cucumber-preprocessor/steps";


const userData = {
    user: {
      username: "User1",
      email: "user1@gmail.com",
      password: "User1@1234",
    },};

function loginUser(user) {
        cy.contains("Login").should("be.visible").click();
        cy.get("#formEmailorUsernameInput").type(user.username);
        cy.get("#formPasswordInput").type(user.password);
        cy.contains("LOGIN").click()
    }


// Given the user can access the homepage "http://localhost:3000"
Given('the user can access the homepage {string}', (url) => {
    cy.visit(url)
  });
  
// When the user is not logged in
When('the user is not logged in', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

// Then the user not see should any "Edit" or "Delete" button on answer "Storing content as BLOBs in databases."
Then('the user should not see any {string} or {string} button on answer {string}', (edit, deleteButton, answer) => {
    cy.contains(answer).parent().parent().within(() => {
        cy.get('.edit_button').should('not.exist');
        cy.get('.delete_button').should('not.exist');
    });
  });

  //Then the user should not see any "Edit" or "Delete" button on answer "Using GridFS to chunk and store content."
Then('the user should not see any "Edit" or "Delete" button on answer {string}', (edit, deleteButton, answer) => {
    cy.contains(answer).parent().parent().within(() => {
        cy.get('.edit_button').should('not.exist');
        cy.get('.delete_button').should('not.exist');
    });
  });

  // And clicks on "Questions" in the left panel
  And('clicks on {string} in the left panel', (question) => {
    cy.contains(question).click();
  }); 

  //And clicks on "Quick question about storage on android"
    And('clicks on {string}', (question) => {
        cy.contains(question).click();
    });

//Then the user should not see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."
Then('the user should not see {string} or {string} button on the answer {string}', (edit, deleteButton, answer) => {    
    cy.contains(answer).parent().parent().within(() => {
        cy.get('.edit_button').should('not.exist');
        cy.get('.delete_button').should('not.exist');
    });
  });

When('the user is logged in', () => {
    loginUser(userData.user);
  });

 
  //Then the user should see "Edit" or "Delete" button on the answer "Store data in a SQLLite database."
  Then('the user should see {string} or {string} button on the answer {string}', (edit, deleteButton, answer) => {
    cy.contains(answer).parent().parent().within(() => {
        cy.get('.edit_button').should('be.visible');
        cy.get('.delete_button').should('be.visible');
    });
  } );

  //When the user clicks on "Edit" 
  When('the user clicks on Edit', () => {
    cy.get('.edit_button').click();
  });
  
  And('enters {string}', (answer) => {
    cy.get('.edit-answer-textarea').type(answer);
  });

  //And clicks on "Save"
  And('clicks on Save', () => {
    cy.get('.save_button').click();
  });
 // Then the user should see "STORE DATA IN SQLLITE DB"
  Then('the user should see {string}', (answer) => {
    cy.get('.answerText').contains(answer);
  });

  //And clicks on "Cancel"
  And('clicks on Cancel', () => {
    cy.get('.cancel_button').click();
  });

// Then the user should not be able to save the answer
Then('the user should not be able to save the answer', () => {
    cy.get('.save_button').should('be.disabled');
  });

//When the user clicks on "Delete" 
When ('the user clicks on Delete', () => {
    cy.get('.delete_button').click();
  });
//Then the user should not see "Store data in a SQLLite database."
Then('the user should not see {string}', (answer) => {
    cy.get('.answerText').should('not.exist');
  });  
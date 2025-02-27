import { Given, When, Then, And, Before, After } from "cypress-cucumber-preprocessor/steps";


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


// Background step
Given('the user can access the homepage {string}', (url) => {
  cy.visit(url);
});

// Scenario: Viewing the voting button when not logged in
When('the user is not logged in', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

//When the user is logged in
When('the user is logged in', () => {
  loginUser(userData.user);
});

// Then the user should see an "Upvote" button on questions they have not voted on
Then('the user should see an "Upvote" button on questions they have not voted on', () => {
  cy.get('.vote_button').eq(0).should('contain.text', 'Upvote');
  cy.get('.vote_button').eq(1).should('contain.text', 'Upvote');
  cy.get('.vote_button').eq(3).should('contain.text', 'Upvote');
});

Then('the user should see an "Upvote" button on all questions', () => {
    cy.get('.vote_button')
    .should('have.length', 4)
    .each(($btn) => {
      cy.wrap($btn).should('contain.text', 'Upvote')
    });

});

And('the "Upvote" button should be disabled and count should not increase' ,() => {
  cy.get('.upvote_count').first().should('have.text', 3);  
  cy.get('.vote_button:contains("Upvote")').first().click({ force: true });
  cy.get('.upvote_count').first().should('have.text', '3');
});


// And the user should see a "Downvote" button on questions they have not voted on
And('the user should see a "Downvote" button on questions they have previously upvoted', () => {
  cy.get('.vote_button').eq(2).should('contain.text', 'Downvote');
});

// And the user has not voted on particular question "Quick question about storage on android"
And('the user has not voted on particular question {string}', (question) => {
  cy.contains(question).should('be.visible');
});
//When the user clicks on "Upvote" for that question
When('the user clicks on "Upvote" for that question', () => {
  cy.get('.vote_button').eq(0).click();
});
//Then the vote count for that question should increase by 1
Then('the vote count for that question should increase by 1', () => {
  cy.get('.upvote_count').first().should('have.text', 4);
});
//And the button should now show "Downvote"
And('the button should now show "Downvote"', () => {
  cy.get('.vote_button').eq(0).should('contain.text', 'Downvote');
});

//And the user has previously upvoted a particular question
And('the user has previously upvoted a particular question {string}', (question) => {
  cy.contains(question).should('be.visible');
});

//When the user clicks on "Downvote" for that question
When('the user clicks on "Downvote" for that question', () => {
  cy.get('.vote_button').eq(2).click();
});

//Then the vote count for that question should decrease by 1
Then('the vote count for that question should decrease by 1', () => {
  cy.get('.upvote_count').eq(2).should('have.text', 0);
});

//And the button should now show "Upvote"
And('the button should now show "Upvote"', () => {
  cy.get('.vote_button').eq(2).should('contain.text', 'Upvote');
});

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";


const User = {
  username: "User1",
  password: "User@1234",
};

// Helper function to attempt login
function attemptLogin(username, password) {
  cy.contains("Login").should("be.visible").click();
  cy.get("#formEmailorUsernameInput").clear().type(username);
  cy.get("#formPasswordInput").clear().type(password);
  cy.contains("LOGIN").click();
}

// Step: Visit the homepage
Given('The user can access the homepage {string}', (url) => {
  cy.visit(url);
});

// Step: User logs in with invalid credentials multiple times
When('The user attempts to log in with valid credentials {int} times', (attempts) => {
  for (let i = 0; i <= attempts; i++) {
    attemptLogin(User.username, User.password);
  }
});

//Then The user should see "Too many login attempts. Please try again later."
Then('The user should see {string}', (message) => {
    cy.contains(message).should("be.visible");
    });
//And The user should not be able to log in
Then('The user should not be able to log in', () => {
    cy.contains("Login").should("be.visible");
    attemptLogin(User.username, User.password);
    cy.contains("Login").should("be.visible");
    });
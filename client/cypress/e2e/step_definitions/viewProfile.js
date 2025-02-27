import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const userData = {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@1234",
    aboutMe:'About user1', 
    linkedIn:'https://www.linkedin.com/in/user1'
  }

function loginUser(user) {
      cy.contains("Login").should("be.visible").click();
      cy.get("#formEmailorUsernameInput").type(user.username);
      cy.get("#formPasswordInput").type(user.password);
      cy.contains("LOGIN").click()
  }

  //Given The user can access the homepage "http://localhost:3000"
    Given('The user can access the homepage {string}', (url) => {
        cy.visit(url);
    });
  //And The user logs in with valid credentials
    And('The user logs in with valid credentials', () => {
      loginUser(userData);
    });
  //When The user clicks on the "Profile" button
    When('The user clicks on the {string} button', (button) => {
        cy.contains(button).click();
    });
  //Then The users should see their "Username", "Email", "About Me", and "LinkedIn" details
    Then('The users should see their Username, Email, About Me, and LinkedIn details', () => {
        cy.get('.username').should("be.visible");
        cy.get('.email').should("be.visible");
        cy.get('.aboutme').should("be.visible");
        cy.get('.linkedInLink').should("be.visible");
    });

    // When The user is not logged in
    When('The user is not logged in', () => {
        cy.contains("Login").should("be.visible").click();
    });
    //Then the user should not see "Profile" button
    Then('the user should not see {string} button', (button) => {
        cy.contains(button).should("not.exist");
    });


import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const userData = {
    user1: {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@1234",
  },
  user2: {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@1234",
    }
  };

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
  //And The user is logged in with valid credentials
    And('The user is logged in with valid credentials', () => {
        loginUser(userData.user1);
    });
  //When The user clicks on the "Logout" button on the header
    When('The user clicks on the {string} button on the header', (button) => {
        cy.contains(button).click();
    });
  //Then The user should see "Login" and "Sign Up" button on the header  
    Then('The user should see {string} and {string} button on the header', (button1, button2) => {
        cy.contains(button1);
        cy.contains(button2);       
    });

    // When The user is not able to log in with valid credentials
    When('The user is not able to log in with valid credentials', () => {
        loginUser(userData.user2);
    });
    //Then The user should not see "Logout" button on the header 
        Then('The user should not see {string} button on the header', (button) => {
            cy.contains(button).should("not.exist");
        });
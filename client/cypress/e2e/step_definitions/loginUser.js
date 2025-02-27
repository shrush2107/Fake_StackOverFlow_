import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const userData = {
  user1: {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@1234",
  },
  user1_empty: {
    username: "",
    email: "",
    password: "",
  },
  user1_wrongP: {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@12",
  },
  user1_wrongUN: {
    username: "user1",
    email: "user1@gmail.com",
    password: "User1@1234",
  },
  user1_wrongEM: {
    username: "User1",
    email: "User1@gmail",
    password: "User1@1234",
  },
  user2: {
    username: "User2",
    email: "user2@gmail.com",
    password: "User2@1234",
    aboutme: "Hi, I am a new to SO",
    linkedInLink: "https://www.linkedin.com/in/user2",
  }
};

function createUser(username, email, password, aboutme, linkedInLink) {
  cy.contains("Sign Up").should("be.visible").click();
  cy.get("#formUsernameInput").type(username);
  cy.get("#formEmailInput").type(email);
  cy.get("#formPasswordInput").type(password);
  cy.get("#formTextInput").type(aboutme);
  cy.get("#formLnkdInput").type(linkedInLink);
  cy.contains("Register").click();
}

function registerandLoginUser(user,username, email, password, aboutme, linkedInLink) {
  createUser(username, email, password, aboutme, linkedInLink);
  cy.contains("Logout").should("be.visible").click();
  loginUser(user);
}

function fillForm(u) {
    // If you want to use the username as the login field
    if (u.username !== undefined) {
      cy.get("#formEmailorUsernameInput").clear();
      if (u.username !== "") {
        cy.get("#formEmailorUsernameInput").type(u.username);
      }
    }
    if (u.password !== undefined) {
      cy.get("#formPasswordInput").clear();
      if (u.password !== "") {
        cy.get("#formPasswordInput").type(u.password);
      }
    }
  }
  
  function fillFormEM(u) {
    // If you want to use the username as the login field
    if (u.email !== undefined) {
      cy.get("#formEmailorUsernameInput").clear();
      if (u.email !== "") {
        cy.get("#formEmailorUsernameInput").type(u.email);
      }
    }
    if (u.password !== undefined) {
      cy.get("#formPasswordInput").clear();
      if (u.password !== "") {
        cy.get("#formPasswordInput").type(u.password);
      }
    }
  }

function loginUser(user) {
  cy.contains("Login").should("be.visible").click();
  fillForm(user);
  cy.contains("LOGIN").click();
}

function loginUserEM(user) {
    cy.contains("Login").should("be.visible").click();
    fillFormEM(user);
    cy.contains("LOGIN").click();
  }
// Define steps only once

Given('The user can access the homepage {string}', (url) => {
  cy.visit(url, { timeout: 10000 }); 
  cy.contains("Login", { timeout: 10000 }).should('be.visible'); 
});

When('the user does all the necessary steps to SignUp and Register a new user', () => {
    registerandLoginUser(
      userData.user2,
      userData.user2.username,
      userData.user2.email,
      userData.user2.password,
      userData.user2.aboutme,
      userData.user2.linkedInLink
    );
  });

When('the user does all the necessary steps to Login with invalid password', () => {
  loginUser(userData.user1_wrongP);
});

When('the user does all the necessary steps to Login with invalid username', () => {
  loginUser(userData.user1_wrongUN);
});

When('the user does all the necessary steps to Login with invalid email', () => {
  loginUserEM(userData.user1_wrongEM);
});

When('the user does all the necessary steps to Login with empty credentials', () => {
    loginUser(userData.user1_empty);
  });

When('the user does all the necessary steps to Login with valid username', () => {
  loginUser(userData.user1);
});

When('the user does all the necessary steps to Login with valid email', () => {
  loginUserEM(userData.user1);
});

Then('The user should see {string}', (errorMessage) => {
  cy.contains(errorMessage).should('be.visible');
});

Then('The user should see {string} on homepage', (welcomeMessage) => {
  cy.contains(welcomeMessage, { timeout: 10000 }).should('be.visible');
});

Then('The user should see {string} for empty email or username', (errorMessage) => {
  cy.contains(errorMessage).should('be.visible');
});

And('The user should see {string} for empty password', (errorMessage) => {
    cy.contains(errorMessage).should('be.visible');
});

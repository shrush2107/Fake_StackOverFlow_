import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

const userData = {
  validUser: {
    username: "User2",
    email: "user2@gmail.com",
    password: "User2@1234",
    aboutme: "Hi, I am new to SO",
    linkedInLink: "https://www.linkedin.com/in/user2"
  },
  emptyAboutMe: {
    username: "ValidUser",
    email: "validuser@example.com",
    password: "Valid@1234",
    aboutme: "",
    linkedInLink: "https://www.linkedin.com/in/validuser"
  },
  emptyLinkedIn: {
    username: "AnotherUser",
    email: "anotheruser@example.com",
    password: "Valid@1234",
    aboutme: "I love coding",
    linkedInLink: ""
  },
  invalidLinkedIn: {
    username: "LinkedInInvalid",
    email: "linkedininvalid@example.com",
    password: "Valid@1234",
    aboutme: "Test user",
    linkedInLink: "not-a-valid-url"
  },
  emptyUsername: {
    username: "",
    email: "emptyusername@example.com",
    password: "Valid@1234",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/emptyusername"
  },
  shortUsername: {
    username: "Us", // only 2 chars
    email: "shortusername@example.com",
    password: "Valid@1234",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/shortusername"
  },
  emptyEmail: {
    username: "EmptyEmailUser",
    email: "",
    password: "Valid@1234",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/emptyemailuser"
  },
  invalidEmailFormat: {
    username: "InvalidEmail",
    email: "invalid-email-format",
    password: "Valid@1234",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/invalidemail"
  },
  emptyPassword: {
    username: "EmptyPassword",
    email: "emptypassword@example.com",
    password: "",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/emptypassword"
  },
  shortPassword: {
    username: "ShortPassUser",
    email: "shortpass@example.com",
    password: "Va@12", // less than 8 characters
    aboutme: "Hello",
    linkedInLink: "https://www.linkedin.com/in/shortpassuser"
  },
  invalidPasswordFormat: {
    username: "InvalidPassUser",
    email: "invalidpass@example.com",
    // Missing some required complexity, for example no uppercase:
    password: "password123!",
    aboutme: "Hi",
    linkedInLink: "https://www.linkedin.com/in/invalidpassuser"
  },
  usernameExists: {
    username: "User1", // Assume this username is already taken
    email: "newuserwithtakenusername@example.com",
    password: "Valid@1234",
    aboutme: "Trying to sign up with an existing username",
    linkedInLink: "https://www.linkedin.com/in/newuserwithtakenusername"
  },
  emailExists: {
    username: "AnotherUniqueUser",
    email: "user1@gmail.com", // Assume this email is already taken
    password: "Valid@1234",
    aboutme: "Trying to sign up with an existing email",
    linkedInLink: "https://www.linkedin.com/in/anotheruniqueuser"
  }
};

function attemptSignUp(user) {
    cy.contains("Sign Up").should("be.visible").click();
  
    if (user.username !== undefined) {
      cy.get("#formUsernameInput").clear();
      if (user.username !== "") {
        cy.get("#formUsernameInput").type(user.username);
      }
    }
  
    if (user.email !== undefined) {
      cy.get("#formEmailInput").clear();
      if (user.email !== "") {
        cy.get("#formEmailInput").type(user.email);
      }
    }
  
    if (user.password !== undefined) {
      cy.get("#formPasswordInput").clear();
      if (user.password !== "") {
        cy.get("#formPasswordInput").type(user.password);
      }
    }
  
    if (user.aboutme !== undefined) {
      cy.get("#formTextInput").clear();
      if (user.aboutme !== "") {
        cy.get("#formTextInput").type(user.aboutme);
      }
    }
  
    if (user.linkedInLink !== undefined) {
      cy.get("#formLnkdInput").clear();
      if (user.linkedInLink !== "") {
        cy.get("#formLnkdInput").type(user.linkedInLink);
      }
    }
  
    cy.contains("Register").click();
  }
  
// Given step: visiting homepage
Given('The user can access the homepage {string}', (url) => {
  cy.visit(url, { timeout: 10000 }); 
  cy.contains("Login", { timeout: 10000 }).should('be.visible'); 
});

// Scenario: Successful signup
When('the user does all the necessary steps to SignUp and Register a new user', () => {
  attemptSignUp(userData.validUser);
});

// Scenario: About me empty
When('the user does all the necessary steps to SignUp with About me empty', () => {
  attemptSignUp(userData.emptyAboutMe);
});

// Scenario: LinkedIn empty
When('the user does all the necessary steps to SignUp with LinkedIn empty', () => {
  attemptSignUp(userData.emptyLinkedIn);
});

// Scenario: LinkedIn invalid URL
When('the user does all the necessary steps to SignUp with LinkedIn with invalid URL', () => {
  attemptSignUp(userData.invalidLinkedIn);
});

// Scenario: Username empty
When('the user does all the necessary steps to SignUp with Username empty', () => {
  attemptSignUp(userData.emptyUsername);
});

// Scenario: Username not between 3 and 20 chars
When('the user does all the necessary steps to SignUp with Username not between 3 and 20 characters', () => {
  attemptSignUp(userData.shortUsername);
});

// Scenario: Email empty
When('the user does all the necessary steps to SignUp with Email empty', () => {
  attemptSignUp(userData.emptyEmail);
});

// Scenario: Email invalid
When('the user does all the necessary steps to SignUp with Email in invalid format', () => {
  attemptSignUp(userData.invalidEmailFormat);
});

// Scenario: Password empty
When('the user does all the necessary steps to SignUp with Password empty', () => {
  attemptSignUp(userData.emptyPassword);
});

// Scenario: Password less than 8 chars
When('the user does all the necessary steps to SignUp with Password less 8 characters', () => {
  attemptSignUp(userData.shortPassword);
});

// Scenario: Password invalid format
When('the user does all the necessary steps to SignUp with Password invalid format', () => {
  attemptSignUp(userData.invalidPasswordFormat);
});

// Then steps: checking error or success messages
Then('The user should see {string} on homepage', (welcomeMessage) => {
  cy.contains(welcomeMessage, { timeout: 10000 }).should('be.visible');
});

Then('The user should see {string}', (errorMessage) => {
  cy.contains(errorMessage).should('be.visible');
});

When('the user does all the necessary steps to SignUp with Username Exist already', () => {
    attemptSignUp(userData.usernameExists);
  });
  
  // Existing email scenario
  When('the user does all the necessary steps to SignUp with Email Exist already', () => {
    attemptSignUp(userData.emailExists);
  });

  Then('The user should not be able to Register', () => {
    //checking for:
    // - Still seeing the Register button or signup form
    cy.contains("Register").should('be.visible');
  });  
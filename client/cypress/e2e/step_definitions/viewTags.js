import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const questionData = {
    validQuestion1: {
        title: "Question Title 1",
        text: "Test Question 1 Text Q1",
        tags: "tag1"
    },
    validQuestion2: {
        title: "Question Title 2",
        text: "Test Question 2 Text Q3",
        tags: "tag2",
    },
};

function fillForm(q) {
    if (q.title !== undefined) {
        cy.get("#formTitleInput").clear();
        if (q.title !== "") {
            cy.get("#formTitleInput").type(q.title);
        }
    }
    
    if (q.text !== undefined) {
        cy.get("#formTextInput").clear();
        if (q.text !== "") {
            cy.get("#formTextInput").type(q.text);
        }
    }
    
    if (q.tags !== undefined) {
        cy.get("#formTagInput").clear();
        if (q.tags !== "") {
            cy.get("#formTagInput").type(q.tags);
        }
    }
    
}
const userData = {
    user1: {
      username: "User1",
      email: "user1@gmail.com",
      password: "User1@1234",
    },};

function LoginUser(username, password) {
    cy.contains("Login").should("be.visible").click();
    cy.get("#formEmailorUsernameInput").type(username);
    cy.get("#formPasswordInput").type(password);
    cy.contains("LOGIN").click();
}   

function createQuestion(q) {
    cy.contains("Ask a Question").click();
    fillForm(q);
    cy.contains("Post Question").click();
}

function loginAndQuestion(user, question1, question2) {
    LoginUser(user.username, user.password);
    createQuestion(question1);
    createQuestion(question2);
}

function tagExists() {
    cy.get(".tagName").eq(0).should("contain", "react");
    cy.get(".tagNode").eq(0).should("contain", "1 questions");
    cy.get(".tagName").eq(1).should("contain", "javascript");
    cy.get(".tagNode").eq(1).should("contain", "2 questions");
    cy.get(".tagName").eq(2).should("contain", "android-studio");
    cy.get(".tagNode").eq(2).should("contain", "2 questions");
    cy.get(".tagName").eq(3).should("contain", "shared-preferences");
    cy.get(".tagNode").eq(3).should("contain", "2 questions");
    cy.get(".tagName").eq(4).should("contain", "storage");
    cy.get(".tagNode").eq(4).should("contain", "2 questions");
    cy.get(".tagName").eq(5).should("contain", "website");
    cy.get(".tagNode").eq(5).should("contain", "1 questions");
}

function tagAndroidStudioExists() {
    cy.get(".postTitle").eq(0).should("contain","Quick question about storage on android");
    cy.get(".postTitle").eq(1).should("contain","android studio save string shared preference, start activity and load the saved string");
}

// Given Steps
Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

// When Steps
When('The user click on {string} in the left panel', (tab) => {
    cy.contains(tab).click();
});

When('The user click on {string}', (element) => {
    cy.contains(element).click();
});

When('The user click on {string}', (element) => {
    cy.contains(element).click();
});

When('The user adds a valid question with all the fields', () => {
    createQuestion(questionData.validQuestion1);
});

// When the user does all the necessary steps to Login and Post 2 Questions
When('the user does all the necessary steps to Login and Post 2 Questions', () => {
    loginAndQuestion(userData.user1, questionData.validQuestion1, questionData.validQuestion2);
});

//And The user click on "android-studio"
And('The user click on {string}', (element) => {
    cy.contains(element).click();
});

//And The user click on "Tags" in the left panel
And('The user click on {string} in the left panel', (element) => {
    cy.contains(element).click();
});

//And The user should see the name of each tag and count of questions associated with the tag in the database
And('The user should see the name of each tag and count of questions associated with the tag in the database', () => {
    tagExists();
});

// Then Steps
Then('The user should see the name of each tag and count of questions associated with the tag in the database', () => {
    tagExists();
});

Then('The user should see the all the questions realted to that tag', () => {
    tagAndroidStudioExists();
});

Then('The user should see the name of each tag and count of questions associated with the tag in the database', () => {
    tagExists();
});

Then('The user should see all the new and old tags in the database', () => {
    cy.get(".tagName").eq(6).should("contain", "tag1");
    cy.get(".tagNode").eq(6).should("contain", "1 questions");
    cy.get(".tagName").eq(7).should("contain", "tag2");
    cy.get(".tagNode").eq(7).should("contain", "1 questions");
});

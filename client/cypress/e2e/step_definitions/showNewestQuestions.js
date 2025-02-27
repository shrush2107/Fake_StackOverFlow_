import { Given, When, Then, And, Before, After } from "cypress-cucumber-preprocessor/steps";

const questionData = {
    question1: {
        title: "Question Title 1",
        text: "Test Question 1 Text Q1",
        tags: "javascript",
    },
    question2: {
        title: "Question Title 2",
        text: "Test Question 2 Text Q2",
        tags: "java",
    },
};


function createQuestion(title, text, tag) {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(title);
    cy.get("#formTextInput").type(text);
    cy.get("#formTagInput").type(tag);
    cy.contains("Post Question").click();
}

const userData = {
    username: "User1",
    email: "user1@gmail.com",
    password: "User1@1234",
  };

function loginUser(user) {
      cy.contains("Login").should("be.visible").click();
      cy.get("#formEmailorUsernameInput").type(user.username);
      cy.get("#formPasswordInput").type(user.password);
      cy.contains("LOGIN").click()
  }

Given("The user can access the homepage {string}", (url) => {
    cy.visit(url);
});

When("The user does all the necessary steps to post a new question", () => {
    loginUser(userData);
    createQuestion(questionData.question1.title, questionData.question1.text, questionData.question1.tags);
});

And ("The user clicks on the {string} tab", (tabName) => {
    cy.contains(tabName).click();
});

Then("The user should see the newly posted question at the top of the list", () => {
    cy.get(".postTitle").eq(0).should("contain", questionData.question1.title);
});


When("The user clicks on the {string} tab", (tabName) => {
    cy.contains(tabName).click();
});

Then("The user should see all questions in the database sorted by the newest first", () => {
    cy.get(".postTitle").eq(0).should("contain","Quick question about storage on android" );
    cy.get(".postTitle").eq(1).should("contain", "Object storage for a web application");
    cy.get(".postTitle").eq(2).should("contain", "android studio save string shared preference, start activity and load the saved string");
    cy.get(".postTitle").eq(3).should("contain", "Programmatically navigate using React router");
});


And("The user repeats the steps to post a second question", () => {
    createQuestion(questionData.question2.title, questionData.question2.text, questionData.question2.tags);
});
And ("The user clicks back on the {string} tab", (tabName) => {  
    cy.contains(tabName).click();
});
Then("The user should see the second question at the top and the first question just below it", () => {
    cy.get(".postTitle").eq(0).should("contain", questionData.question2.title);
    cy.get(".postTitle").eq(1).should("contain", questionData.question1.title);
});



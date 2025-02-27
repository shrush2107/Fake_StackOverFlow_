import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
const answerData = {
    validAnswer: {
        user: "new user 1",
        text: "This is a new answer 1"
    },
    validAnswer2: {
        user: "new user 2",
        text: "This is a new answer 2"
    },
    emptyTextAnswer: {
        user: "new user 1",
        text: ""
    },
};

function fillAnswerForm(answer) {
    if (answer.text !== undefined) {
        cy.get("#answerTextInput").clear();
        if (answer.text !== "") {
            cy.get("#answerTextInput").type(answer.text);
        }
    }
}

function createAnswer(answer) {
    cy.contains("Answer Question").click();
    fillAnswerForm(answer);
    cy.contains("Post Answer").click();
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


/**
 *  Scenario: Verify the content for question with no answer
    Given The user has write access to the application "http://localhost:3000"
    When the user adds a question with all the fields
    And the user clicks on "Test Question 1"
    Then The user should see no answer
*/
Given("The user has write access to the application {string}", (url) => {   
    cy.visit(url);
});
When("the user adds a question with all the fields", () => {
    loginUser(userData);
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Question 1 Text");
    cy.get("#formTagInput").type("tag1 tag2");
    cy.contains("Post Question").click();
});
And("the user clicks on {string}", (description) => {      
    cy.contains(description).click();
});
Then("The user should see no answer", () => { 
    cy.get(".answerText").should("not.exist");
});

When("the user clicks on {string}", (description) => {      
    cy.contains(description).click();
});
Then("The user should see the question description and other related metadata", () => { 
   cy.get(".answer_question_text").should("be.visible");
   cy.get(".question_author").should("be.visible");
   cy.get(".answer_question_meta").should("be.visible");
   cy.get(".answer_question_view").should("be.visible");
   
});

Then("The user should see all the answers and related metadata", () => { 
    cy.get(".answerText").eq(1).should("contain", "Using GridFS to chunk and store content.");
    cy.get(".answer_author").eq(1).should("contain", "mackson3332");
    cy.get(".answerText").eq(0).should("contain", "Storing content as BLOBs in databases.");
    cy.get(".answer_author").eq(0).should("contain", "abhi3241");
});

And("the user answers the question", () => {
    createAnswer(answerData.validAnswer);
});
Then("The user should see the new answer", () => {
    cy.get(".answerText").should("be.visible");
    cy.contains("This is a new answer 1").should("exist");
});

And("the user enter the second answer", () => {
    createAnswer(answerData.validAnswer2);
});
Then("The user should see the 2 new answers with the newest answer on top", () => {
    // Ensure answers are visible and validate the order
    cy.get(".answerText").should("be.visible");
    // Check that answers appear in reverse order (newest on top)
    cy.get(".answerText").eq(0).should("contain", "This is a new answer 2");
    cy.get(".answerText").eq(1).should("contain", "This is a new answer 1");
});
    

And("the user answers the question with empty text", () => {
    createAnswer(answerData.emptyTextAnswer);
});
Then('The user should see an error message {string}', (errorMessage) => {
    cy.contains(errorMessage).should("be.visible");
});

And("the user is logged in", () => {
    loginUser(userData);
});
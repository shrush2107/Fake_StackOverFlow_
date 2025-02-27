import { Given, When, Then, And, Before, After } from "cypress-cucumber-preprocessor/steps";

const questionData = {
    question1:{
        title: "Question Title 1",
        text: "Test Question 1 Text Q1",
        tags: "javascript",
        user: "new user 32"},
    question2:{
            title: "Question Title 2",
            text: "Test Question 2 Text Q2",
            tags: "java",
            user: "new user 1"},

};

const answerData = {
    user: "user 23",
    text: "Test Answer Text 1"
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


function createQuestion(title, text, tag) {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(title);
    cy.get("#formTextInput").type(text);
    cy.get("#formTagInput").type(tag);
    cy.contains("Post Question").click();
}

function createAnswer(qtitle, text) {
    cy.contains(qtitle).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(text);
    cy.contains("Post Answer").click();
}


    Given('The user can access the homepage {string}', (url) => {
        cy.visit(url);
    });
    
    When('the user does all the necessary steps to post a question', () => {
        loginUser(userData);
        createQuestion(questionData.question1.title, questionData.question1.text, questionData.question1.tags);
    });
    
    And('The user clicks on the {string} button', (buttonName) => {
        cy.contains(buttonName).should("be.visible").click();
    });
    
    And('The user sees the unanswered question in the database', () => {
        cy.get(".postTitle").eq(0).should("contain", questionData.question1.title);
    });
    
    And('The user does all the necessary steps to post an answer', () => {  
        createAnswer(questionData.question1.title, answerData.text);
    });
      
    Then('The user should see {string} in the database that are Unanswered', (question_count) => {
        cy.contains("Questions").click();
        cy.contains("Unanswered").click();
        cy.contains(question_count).should("be.visible");
    });
    

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName).should("be.visible");
});

Then('The user should see {string} in the database that are Unanswered', (question_count) => {
    cy.contains(question_count).should("be.visible");
});

Then('The user should see the unanswered question in the database', () => {
    cy.get(".postTitle").eq(0).should("contain", questionData.question1.title);
});


When('the user does all the necessary steps to post the first question', () => {
    loginUser(userData);
    createQuestion(questionData.question1.title, questionData.question1.text, questionData.question1.tags);
});

And('the user repeats all the steps to post the second question', () => {
    createQuestion(questionData.question2.title, questionData.question2.text, questionData.question2.tags);
});

Then('The user should see all the unanswered questions in the database in the order they were posted', () => {
    cy.get(".postTitle").eq(0).should("contain", questionData.question2.title);
    cy.get(".postTitle").eq(1).should("contain", questionData.question1.title);
});


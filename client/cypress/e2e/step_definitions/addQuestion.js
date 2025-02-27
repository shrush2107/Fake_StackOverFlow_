import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
const questionData = {
    validQuestion: {
        title: "Question Title 1",
        text: "Test Question 1 Text Q1",
        tags: "javascript",
    },
    
    validQuestion2: {
        title: "Question Title 2",
        text: "Test Question 2 Text Q3",
        tags: "java",
    },

    validQuestion3: {
        title: "Question Title 3",
        text: "Test Question 3 Text Q3",
        tags: "react",
    },

    emptyTitle: {
        title: "",
        text: "Test Question 1 Text Q1",
        tags: "javascript",
    },
    longTitle: {
        title: "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmlkjhgfdsapoiuytrewsxdcfvghjfcvgbhn",
        text: "Test Question 1 Text Q1",
        tags: "javascript",
    },
    emptyText: {
        title: "Valid Question Title",
        text: "",
        tags: "javascript",
    },
    emptyTags: {
        title: "Valid Question Title",
        text: "Test Question 1 Text Q1",
        tags: "",
    },
    tooManyTags: {
        title: "Valid Question Title",
        text: "Test Question 1 Text Q1",
        tags: "javascript react python java c++ html",
    },
    longTags: {
        title: "Valid Question Title",
        text: "Test Question 1 Text Q1",
        tags: "javascript12345678901234567890 wertyui",
    }
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

function createQuestion(q) {
    cy.contains("Ask a Question").click();
    fillForm(q);
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

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});

When('the user adds a valid question with all the fields', () => {  
    loginUser(userData);
    createQuestion(questionData.validQuestion); 
});

Then('The user should see the new question in the All Questions page with the metadata information', () => {
    cy.contains("All Questions");
    cy.get(".postTitle").first().should("contain", questionData.validQuestion.title);
    cy.get(".question_author").first().should("contain", userData.username);
    cy.get(".question_meta").first().should("contain", "0 seconds");
});


When('The user fills out all details with title more than 100 characters', () => {
    loginUser(userData);
    createQuestion(questionData.longTitle); 
});

Then('The user should see an error message {string}', (errorMessage) => {
    cy.contains(errorMessage).should("be.visible");
});



When('The user fills out all details with more than 5 tags', () => {
    loginUser(userData);
   createQuestion(questionData.tooManyTags);
});


When('The user fills out all details with empty title', () => {
    loginUser(userData);
    createQuestion(questionData.emptyTitle);
});

When('The user fills out all details with empty text', () => {
    loginUser(userData);
    createQuestion(questionData.emptyText);
});

When('The user fills out all details with empty tags', () => {
    loginUser(userData);
    createQuestion(questionData.emptyTags);
});

And("the user repeats the steps to post question 2", () => {
    createQuestion(questionData.validQuestion2);
});
And("the user repeats the steps to post question 3", () => {   
    createQuestion(questionData.validQuestion3);    
});

Then("The user should see the all new question in newest first order on All Questions page with the metadata information",
    () => {
        cy.contains("All Questions");
        cy.get(".postTitle").eq(0).should("contain", questionData.validQuestion3.title);
        cy.get(".postTitle").eq(1).should("contain", questionData.validQuestion2.title);
        cy.get(".postTitle").eq(2).should("contain", questionData.validQuestion.title);
    }
);

When('The user fills out all details with a tag longer than 20 characters', () => {
    loginUser(userData);
    createQuestion(questionData.longTags);
});

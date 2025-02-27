import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

function searchResult() {
    cy.get(".postTitle").eq(0).should("contain","Object storage for a web application");
    cy.get(".postTitle").eq(1).should("contain","Programmatically navigate using React router");
    
}

Given('The user can access the homepage {string}', (url) => {
cy.visit(url);
});
When('the user can see the homepage {string}', (pageName) => {
cy.contains(pageName);
});
And('the user types {string} in the search bar and press enter', (searchText) => {  
cy.get("#searchBar").type(searchText + "{enter}");
});
Then('the user should see no questions displayed', () => {  
cy.get(".postTitle").should("not.exist");
});
Then('the user should see a question with the title matching {string}', (text) => {  
cy.get(".postTitle").eq(0).should("contain",text);
});
Then('the user should see a question with the title matching', () => {  
searchResult();
});
And('the user click on {string} in the left panel', (tab) => {
    cy.contains(tab).click();
});

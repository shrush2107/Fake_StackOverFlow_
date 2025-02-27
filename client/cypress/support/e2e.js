// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { before, after } from 'cypress'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// cypress/support/e2e.js

// Import Cypress commands and other necessary modules
// You can keep existing imports or add new ones as needed

// Global setup before all tests
before(() => {
    // Remove the existing database
    cy.exec('npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so');
  
    // Populate the database with initial data
    cy.exec('npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so');
  });
  
  // Global teardown after all tests
after(() => {
    // Clean up the database after all tests have run
    cy.exec('npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so');
  });
  
  // Optionally, you can keep other support configurations below
  
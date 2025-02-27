describe('Page Load', () => {
    it('should load https://localhost:3000 within 1 second and have 1000 ".postTitle" elements', () => {
      // Visit the page you want to test
      cy.visit('http://localhost:3000', {
        // Set the timeout to 1 seconds
        timeout: 5000 
      });
  
      // After ensuring the page is loaded, check if the number of ".postTitle" elements equals 1000
      cy.get('.postTitle', { timeout: 5000 }).should('have.length', 1000);
    });
  });
  
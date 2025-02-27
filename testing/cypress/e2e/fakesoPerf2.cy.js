describe('Unanswered to Active Page Navigation Test', () => {
    it('should load localhost:3000, navigate to Unanswered and Active, and verify 1000 ".postTitle" elements within 1 second', () => {
      // Visit localhost:3000
      cy.visit('http://localhost:3000', { timeout: 5000 });
  
      // Click on the "Unanswered" button (adjust selector if necessary)
      cy.contains('Unanswered').click(); // Adjust the selector to match your "Unanswered" button
  
      // Click on the "Active" button (adjust selector if necessary)
      cy.contains('Active').click(); // Adjust the selector to match your "Active" button
  
      // Check that 1000 ".postTitle" elements are displayed within a second
      cy.get('.postTitle', { timeout: 5000 }).should('have.length', 1000);
    });
  });
  
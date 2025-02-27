describe('Search by tag', () => {
    it('searching by tag5 should show all posts with the tag5 within 1 second', () => {
      // Visit localhost:3000
      cy.visit('http://localhost:3000', { timeout: 5000 });
  
      // Search with tag "tag5"
      cy.get("#searchBar").type("[tag5]{enter}");; // Adjust the selector to match your "Active" button
  
      // Check that 1000 ".postTitle" elements are displayed within a second
      cy.get('.postTitle', { timeout: 5000 }).should('have.length', 587);
    });
  });
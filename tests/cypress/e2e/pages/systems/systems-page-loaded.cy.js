describe('Systems page loads correctly', () => {

    it('loads the systems page and displays main elements', () => {
        cy.visit('/systems')
        cy.get('.systems-page-title').contains('Information Systems')
        cy.get('.systems-page-description').contains('Manage and access your information systems')
        cy.get('.add-new-system-button').contains('Add New System')
        cy.get('.clear-all-systems-button').contains('Clear Systems')
    })
    
})
describe('Systems redirect button', () => {
    it('navigates to Systems page when clicked', () => {
        cy.visit('/')

        cy.get('.redirect_to_systems')
            .invoke('removeAttr', 'target')
            .click()

        cy.url().should('include', '/systems')
    })

})
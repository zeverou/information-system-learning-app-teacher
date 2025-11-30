describe('GitHub redirect button', () => {
    it('has correct href and opens in new tab', () => {
        cy.visit('/')

        cy.get('.redirect_to_github')
            .should('be.visible')
            .should('have.attr', 'href', 'https://github.com/sol239/information-system-learning-app')
            .and('have.attr', 'target', '_blank')
    })

    it('navigates to GitHub when clicked', () => {
        cy.visit('/')

        cy.get('.redirect_to_github')
            .invoke('removeAttr', 'target')
            .click()

        cy.url().should('include', 'github.com/sol239/information-system-learning-app')
    })

})
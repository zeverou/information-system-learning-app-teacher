describe('Settings language select', () => {
        
    it("clicking on language select shows options", () => {
        cy.visit('/settings')
        cy.get('.settings-language-select').click()
        cy.get('span').contains('English').should('be.visible')
        cy.get('span').contains('Čeština').should('be.visible')
    })

})
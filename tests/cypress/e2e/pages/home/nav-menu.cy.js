describe('Navigation menu', () => {

    it('displays navigation menu and navigates to correct pages', () => {
        cy.visit('/')
        cy.get('.global-nav-menu').should('be.visible')
        cy.get('.global-nav-menu').within(() => {
            cy.contains('Home').should('be.visible')
            cy.contains('Systems').should('be.visible')
            cy.contains('Settings').should('be.visible')
        })
    })

    it('navigates to Home page when Home is clicked', () => {
        cy.visit('/')
        cy.get('.global-nav-menu').within(() => {
            cy.contains('Home').click()
        })
        cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('navigates to Systems page when Systems is clicked', () => {
        cy.visit('/')
        cy.get('.global-nav-menu').within(() => {
            cy.contains('Systems').click()
        })
        cy.url().should('eq', Cypress.config().baseUrl + '/systems')
    })
    
    it('navigates to Settings page when Settings is clicked', () => {
        cy.visit('/')
        cy.get('.global-nav-menu').within(() => {
            cy.contains('Settings').click()
        })
        cy.url().should('eq', Cypress.config().baseUrl + '/settings')
    })
})

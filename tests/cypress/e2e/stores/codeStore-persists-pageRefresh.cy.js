describe('Component Code Store Persistence', () => {

    it('persists total components count after page refresh', () => {
        cy.visit('/component-explorer')
        cy.get('.initialize-components-button').click()

        // wait 2000 ms for initialization to complete
        cy.wait(2000)

        // Store the total components number after initialization
        cy.get('.total-components-badge').invoke('text').then((text) => {
            const totalComponents = text.match(/Total Components: (\d+)/)[1]
            cy.wrap(totalComponents).as('storedTotalComponents')
            console.log("Stored total components number: " + totalComponents)
        })

        // Refresh the page
        cy.reload()

        // wait 4000 ms for re-initialization to complete
        cy.wait(4000)

        // Check that the total components number is the same after refresh
        cy.get('.total-components-badge').invoke('text').then((text) => {
            const refreshedTotalComponents = text.match(/Total Components: (\d+)/)[1]
            cy.get('@storedTotalComponents').should('equal', refreshedTotalComponents)
        })
    })
})

describe('Add New System functionality', () => {

    it('opens the Add New System modal when the button is clicked', () => {
        cy.visit('/systems')
        cy.get('.add-new-system-button').click()
        cy.get('.system-zip-upload').should('be.visible')
    })

    // TODO: maybe more checks later, like title, and other system details after upload
    it('allows uploading a ZIP file and displays the system name preview', () => {
        const zipFilePath = 'tests/cypress/fixtures/test_system.zip'
        cy.visit('/systems')
        cy.get('.add-new-system-button').click()
        cy.get('.system-zip-upload input[type="file"]').selectFile(zipFilePath, { force: true });
        cy.get('.upload-system-button').should('be.visible')
    })

    it('uploads the system and displays it in the systems list', () => {
        const zipFilePath = 'tests/cypress/fixtures/test_system.zip'
        cy.visit('/systems')
        cy.get('.add-new-system-button').click()
        cy.get('.system-zip-upload input[type="file"]').selectFile(zipFilePath, { force: true });
        cy.get('.upload-system-button').click()
        cy.get('.system-name').contains('Školní tábor Pálava').should('be.visible')
    })
})

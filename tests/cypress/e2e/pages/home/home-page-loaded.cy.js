describe('Home page loads correctly', () => {

    it('loads the home page and displays main elements', () => {
        cy.visit('/')
        cy.get('h1').contains('Welcome to the error-finding application for information systems')
        cy.get('p').contains('This application allows you to browse various systems, manage shifts and participants, and perform other operations related to the information system. The application is intended for students in the 2nd stage of primary school and secondary school.')
    })
})
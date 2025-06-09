describe('Task Management E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Resetear el estado antes de cada prueba
    cy.window().then((win) => {
      win.taskStore.clearAllTasks()
    })
  })

  describe('Task Input', () => {
    it('should display input placeholder when empty', () => {
      cy.contains('Type to add new task').should('be.visible')
    })

    it('should focus input when plus button is clicked', () => {
      cy.get('[data-testid="task-input"]').should('not.be.focused')
      cy.get('button').contains('+').click({ force: true })
      cy.get('[data-testid="task-input"]').should('be.focused')
    })

    it('should show user avatar when input is focused', () => {
      cy.get('.user-avatar').should('not.exist')
      cy.get('[data-testid="task-input"]').focus()
      cy.get('.user-avatar').should('be.visible')
    })
  })

  describe('Task Creation', () => {
    it('should add a new task with Enter key', () => {
      const taskText = 'New task with #tag'
      cy.get('[data-testid="task-input"]').type(`${taskText}{enter}`)
      cy.contains(taskText).should('exist')
      cy.contains('#tag').should('have.class', 'text-category')
    })

    it('should parse different text patterns', () => {
      const text = 'Task with #tag @user email@test.com https://example.com'
      cy.get('[data-testid="task-input"]').type(`${text}{enter}`)

      cy.contains('#tag').should('have.class', 'text-category')
      cy.contains('@user').should('have.class', 'text-user')
      cy.contains('email@test.com').should('have.class', 'text-email')
      cy.contains('https://example.com').should('have.class', 'text-url')
    })

    it('should clear input after task creation', () => {
      cy.get('[data-testid="task-input"]').type('New task{enter}')
      cy.get('[data-testid="task-input"]').should('have.value', '')
    })
  })

  describe('Task Actions', () => {
    beforeEach(() => {
      cy.get('[data-testid="task-input"]').type('Test task{enter}')
    })

    it('should show action buttons when input is focused', () => {
      cy.get('.task-action-container').should('not.exist')
      cy.get('[data-testid="task-input"]').focus()
      cy.get('.task-action-container').should('be.visible')
    })

    it('should complete a task', () => {
      cy.get('[aria-label="Complete task"]').first().click()
      cy.get('[aria-label="Complete task"]').first().should('have.class', 'bg-blue-500')
      cy.contains('Test task').should('have.class', 'line-through')
    })

    it('should enter edit mode when task is clicked', () => {
      cy.contains('Test task').click()
      cy.get('.task-item input').should('be.visible')
    })

    it('should save edited task', () => {
      cy.contains('Test task').click()
      cy.get('.task-item input').clear().type('Edited task #newtag{enter}')
      cy.contains('Edited task').should('exist')
      cy.contains('#newtag').should('have.class', 'text-category')
    })

    it('should cancel editing when clicking outside', () => {
      cy.contains('Test task').click()
      cy.get('.task-item input').clear().type('This edit will be canceled')
      cy.get('body').click(0, 0) // Click outside
      cy.contains('Test task').should('exist')
      cy.contains('This edit will be canceled').should('not.exist')
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt task actions for small screens', () => {
      cy.viewport(600, 800)
      cy.get('[data-testid="task-input"]').focus()
      cy.get('.task-action-container button').should('have.length', 6)
      cy.get('.task-action-container button').first().should('have.attr', 'title')
    })
  })
})

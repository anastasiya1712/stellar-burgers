describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@test.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  describe('Модальные окна', () => {
    describe('Модальное окно ингредиента', () => {
      it('должно открываться при клике на ингредиент', () => {
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        cy.get('[data-test="modal"]').should('exist');
        cy.get('[data-test="modal"]').contains('Детали ингредиента');
        cy.get('[data-test="modal"]').contains('Краторная булка N-200i');
      });

      it('должно закрываться при клике на крестик', () => {
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        cy.get('[data-test="modal"]').should('exist');
        
        cy.get('[data-test="modal-close"]').click();
        
        cy.get('[data-test="modal"]').should('not.exist');
      });

      it('должно закрываться при клике на оверлей', () => {
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        cy.get('[data-test="modal"]').should('exist');
        
        cy.get('[data-test="modal-overlay"]').click({ force: true });
        
        cy.get('[data-test="modal"]').should('not.exist');
      });

      it('должно закрываться при нажатии на Esc', () => {
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        cy.get('[data-test="modal"]').should('exist');
        
        cy.get('body').type('{esc}');
        
        cy.get('[data-test="modal"]').should('not.exist');
      });

    });
  });
}); 
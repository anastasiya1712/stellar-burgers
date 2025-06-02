import ingredients from '../fixtures/ingredients.json';

describe('Order Creation Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@test.com',
          name: 'Test User'
        }
      }
    }).as('login');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@test.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space бургер',
        order: {
          number: 12345
        }
      }
    }).as('postOrder');

    cy.visit('/login');

    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Войти').click();

    cy.wait('@login');
    cy.url().should('not.include', '/login');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('создание заказа должно быть успешным', () => {
    const bun = ingredients.data.find((item) => item.type === 'bun');
    if (!bun) throw new Error('No bun found in ingredients');

    cy.get(`[data-test="ingredient-${bun._id}"]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    const filling = ingredients.data.find((item) => item.type !== 'bun');
    if (!filling) throw new Error('No filling found in ingredients');

    cy.get(`[data-test="ingredient-${filling._id}"]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('[data-test="constructor-filling"]').should('exist');

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@postOrder', { timeout: 10000 });

    cy.get('[data-test="modal"]').should('exist');
    cy.get('[data-test="modal"]')
      .find('.text.text_type_digits-large')
      .should('contain', '12345');

    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');

    cy.get('[data-test="constructor-filling"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});

import ingredients from '../fixtures/ingredients.json';

describe('Order Creation Tests', () => {
  beforeEach(() => {
    // Mock auth response
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

    // Mock user data response
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

    // Mock ingredients data
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    // Mock order creation response
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

    // Visit the main page and login
    cy.visit('/login');
    
    // Fill in login form
    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Войти').click();

    // Wait for login and redirect
    cy.wait('@login');
    cy.url().should('not.include', '/login');

    // Now visit the constructor page
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('should create an order successfully', () => {
    // Add a bun to the constructor
    const bun = ingredients.data.find(item => item.type === 'bun');
    if (!bun) throw new Error('No bun found in ingredients');
    
    cy.get(`[data-test="ingredient-${bun._id}"]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    // Add a filling to the constructor
    const filling = ingredients.data.find(item => item.type !== 'bun');
    if (!filling) throw new Error('No filling found in ingredients');
    
    cy.get(`[data-test="ingredient-${filling._id}"]`).within(() => {
      cy.get('button').contains('Добавить').click();
    });

    // Verify ingredients are added to constructor
    cy.get('[data-test="constructor-filling"]').should('exist');

    // Click the order button
    cy.contains('button', 'Оформить заказ').click();

    // Wait for the order to be created with longer timeout
    cy.wait('@postOrder', { timeout: 10000 });

    // Verify modal is opened and shows correct order number
    cy.get('[data-test="modal"]').should('exist');
    cy.get('[data-test="modal"]')
      .find('.text.text_type_digits-large')
      .should('contain', '12345');

    // Close the modal
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');

    // Verify constructor is empty after order completion
    cy.get('[data-test="constructor-filling"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
}); 
describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.window().then((window) => {
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('accessToken');
    });
  });

  it('should add bun to the constructor', () => {
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    
    cy.get('[data-test="constructor-bun"]').should('exist');
    cy.get('[data-test="constructor-bun"]').contains('Краторная булка N-200i');
  });

  it('should add filling to the constructor', () => {
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c8"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    
    cy.get('[data-test="constructor-filling"]').should('exist');
    cy.get('[data-test="constructor-filling"]').contains('Филе Люминесцентного тетраодонтимформа');
  });

  it('should open and close ingredient modal', () => {
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
    
    cy.get('[data-test="modal"]').should('exist');
    cy.get('[data-test="modal"]').contains('Краторная булка N-200i');
    
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('should create order and show order number', () => {
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c8"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');

    cy.get('[data-test="order-button"]').click();

    cy.wait('@createOrder');

    cy.get('[data-test="order-modal"]').should('exist');
    cy.get('[data-test="order-number"]').contains('12345');

    cy.get('[data-test="modal-close"]').click();

    cy.get('[data-test="constructor-bun"]').should('not.exist');
    cy.get('[data-test="constructor-filling"]').should('not.exist');
  });

  it('should close modal by clicking overlay', () => {
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
    
    cy.get('[data-test="modal-overlay"]').click('center');
    
    cy.get('[data-test="modal"]').should('not.exist');
  });
}); 
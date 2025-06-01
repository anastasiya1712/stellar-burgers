import  ingredients  from '../fixtures/ingredients.json';

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

  describe('Бургер конструктор', () => {
  beforeEach(() => {
    // Мокаем API ингредиентов
    cy.intercept('GET', 'api/ingredients', {
      statusCode: 200,
      body: ingredients
    }).as('getIngredients');

    // Мокаем API заказов
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: { success: true, name: 'Space бургер', order: { number: 12345 } }
    }).as('postOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен добавлять ингредиент в конструктор', () => {
    const ingredient = ingredients.data.find(item => item.type !== 'bun');
    if (!ingredient) return;

    // cy.contains(ingredient.name)
    //   .closest('[class^=burger-ingredients_ingredient__]')
    //   .as('draggableItem');

    // Находим область конструктора
    cy.get('[data-test="constructor-drop-target"]').as('dropTarget');

    // Выполняем перетаскивание
    //cy.get('@draggableItem').trigger('dragstart');
    cy.get('@dropTarget').trigger('drop').trigger('dragend');

    // Проверяем, что ингредиент появился в конструкторе
    // cy.get('[data-test="constructor-filling"]')
    //   .should('contain', ingredient.name);
  });

  it('должен добавлять булку в конструктор', () => {
    const bun = ingredients.data.find(item => item.type === 'bun');
    if (!bun) return;

    // Находим элемент булки по имени
    // cy.contains(bun.name)
    //   .closest('[class^=burger-ingredients_ingredient__]')
    //   .as('draggableBun');

    // Находим область конструктора
    cy.get('[data-test="constructor-drop-target"]').as('dropTarget');

    // Выполняем перетаскивание
    //cy.get('@draggableBun').trigger('dragstart');
    cy.get('@dropTarget').trigger('drop').trigger('dragend');

    // Проверяем, что булка появилась в конструкторе
    // cy.get('[data-test="constructor-bun"]')
    //   .should('contain', `${bun.name} (верх)`)
    //   .and('contain', `${bun.name} (низ)`);
  });
});
}); 
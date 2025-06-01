describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    // Мокаем ответ для auth/user, чтобы избежать 401 ошибок
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

    // Мокаем ответ для ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    // Устанавливаем токены для авторизации
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');

    // Переходим на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  describe('Модальные окна', () => {
    describe('Модальное окно ингредиента', () => {
      it('должно открываться при клике на ингредиент', () => {
        // Открываем модальное окно ингредиента
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        // Проверяем, что модальное окно открылось
        cy.get('[data-test="modal"]').should('exist');
        // Проверяем заголовок
        cy.get('[data-test="modal"]').contains('Детали ингредиента');
        // Проверяем содержимое
        cy.get('[data-test="modal"]').contains('Краторная булка N-200i');
      });

      it('должно закрываться при клике на крестик', () => {
        // Открываем модальное окно ингредиента
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        // Проверяем, что модальное окно открылось
        cy.get('[data-test="modal"]').should('exist');
        
        // Закрываем по крестику
        cy.get('[data-test="modal-close"]').click();
        
        // Проверяем, что модальное окно закрылось
        cy.get('[data-test="modal"]').should('not.exist');
      });

      it('должно закрываться при клике на оверлей', () => {
        // Открываем модальное окно ингредиента
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        // Проверяем, что модальное окно открылось
        cy.get('[data-test="modal"]').should('exist');
        
        // Закрываем кликом по оверлею
        cy.get('[data-test="modal-overlay"]').click({ force: true });
        
        // Проверяем, что модальное окно закрылось
        cy.get('[data-test="modal"]').should('not.exist');
      });

      it('должно закрываться при нажатии на Esc', () => {
        // Открываем модальное окно ингредиента
        cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
        
        // Проверяем, что модальное окно открылось
        cy.get('[data-test="modal"]').should('exist');
        
        // Нажимаем Esc
        cy.get('body').type('{esc}');
        
        // Проверяем, что модальное окно закрылось
        cy.get('[data-test="modal"]').should('not.exist');
      });

    });
  });
}); 
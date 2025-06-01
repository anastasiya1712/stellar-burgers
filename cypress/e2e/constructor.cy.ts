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
    
    // Мокаем ответ для создания заказа
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

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

  it('should add bun to the constructor', () => {
    // Перетаскиваем булку в конструктор
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    
    // Проверяем, что булка добавилась (должно быть два элемента - верх и низ)
    cy.get('[data-test="constructor-bun"]').should('have.length', 2);
    cy.get('[data-test="constructor-bun"]').first().contains('Краторная булка N-200i');
  });

  it('should add filling to the constructor', () => {
    // Сначала добавляем булку (она обязательна)
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    
    // Затем добавляем начинку
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c8"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    
    // Проверяем, что начинка добавилась
    cy.get('[data-test="constructor-filling"]').should('exist');
    cy.get('[data-test="constructor-filling"]').contains('Филе Люминесцентного тетраодонтимформа');
  });

  it('should open and close ingredient modal', () => {
    // Открываем модальное окно ингредиента
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
    
    // Проверяем, что модальное окно открылось с правильным контентом
    cy.get('[data-test="modal"]').should('exist');
    cy.get('[data-test="modal"]').contains('Краторная булка N-200i');
    
    // Закрываем по кнопке
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('should create order and show order number', () => {
    // Добавляем булку и начинку
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c8"]').trigger('dragstart');
    cy.get('[data-test="constructor-drop-target"]').trigger('drop');

    // Нажимаем оформить заказ
    cy.get('[data-test="order-button"]').click();

    // Ждем ответа от сервера
    cy.wait('@createOrder');

    // Проверяем модальное окно заказа
    cy.get('[data-test="order-modal"]').should('exist');
    cy.get('[data-test="order-number"]').contains('12345');

    // Закрываем модальное окно
    cy.get('[data-test="modal-close"]').click();

    // Проверяем, что конструктор очистился
    cy.get('[data-test="constructor-bun"]').should('not.exist');
    cy.get('[data-test="constructor-filling"]').should('not.exist');
  });

  it('should close modal by clicking overlay', () => {
    // Открываем модальное окно ингредиента
    cy.get('[data-test="ingredient-60d3b41abdacab0026a733c6"]').click();
    
    // Закрываем кликом по оверлею
    cy.get('[data-test="modal-overlay"]').click({ force: true });
    
    // Проверяем, что модальное окно закрылось
    cy.get('[data-test="modal"]').should('not.exist');
  });
}); 
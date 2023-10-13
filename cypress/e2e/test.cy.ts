describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');

    cy.get('[data-cy="signup-btn"]').click();
    cy.url().should('include', '/signup');

    // Generate a random username for testing.
    const a = [
      'Small',
      'Blue',
      'Ugly',
      'Big',
      'Yellow',
      'Green',
      'John',
      'Smith',
      'Jane',
      'Doe',
      'James',
      'Bond',
      'Jack',
      'Sparrow',
      'Tom',
      'Hanks',
      'Tom',
      'Cruise',
      'Alberto',
      'Garcia',
      'Miguel',
      'Rodriguez',
    ];
    const b = [
      'Fernandez',
      'Bear',
      'Dog',
      'Banana',
      'Apple',
      'Orange',
      'Car',
      'Bike',
      'Plane',
      'Train',
      'Ship',
      'House',
      'Tree',
      'Bird',
      'Cat',
      'Fish',
      'Cow',
    ];

    const rA = Math.floor(Math.random() * a.length);
    const rB = Math.floor(Math.random() * b.length);
    const randomUsername = a[rA] + b[rB];

    // Signup
    cy.get('[data-cy="username-input-signup"]').type(randomUsername);
    cy.get('[data-cy="password-input-signup"]').type('PasswdForTesting.12#1');
    cy.get('[data-cy="createAccount-btn"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="options-menu"]').click();
    cy.get('[data-cy="logout-btn"]').click();

    // Login
    cy.url().should('include', '/login');
    cy.get('[data-cy="login-btn"]').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="username-input-login"]').type(randomUsername);
    cy.get('[data-cy="password-input-login"]').type('PasswdForTesting.12#1');
    cy.get('[data-cy="login-btn"]').click();
    cy.url().should('include', '/dashboard');

    // Notes interaction
    cy.get('[data-cy="create-note-btn"]').click();
    cy.get('[data-cy="note"]').click();
    cy.get('[data-cy="editor-mode-btn"]').click();
    cy.contains('# Type here your awesome note').type(
      'This is a test note, Hello World!'
    );
    cy.get('[data-cy="save-note-btn"]').click();
    cy.contains('Note saved!');

    cy.get('[data-cy="editor-mode-btn"]').click();
    cy.get('[data-cy="delete-note-btn"]').click();
    cy.contains('Note deleted!');

    cy.get('[data-cy="options-menu"]').click();
    cy.get('[data-cy="logout-btn"]').click();

    cy.url().should('include', '/login');
  });
});

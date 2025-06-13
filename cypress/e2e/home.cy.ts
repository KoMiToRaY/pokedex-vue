describe('Pokedex Homepage', () => {
  it('affiche les pokémons au chargement', () => {
    cy.visit('http://localhost:5173')

    cy.get('[data-testid="pokemon-card"]', { timeout: 10000 })
      .should('exist')
      .and('have.length.greaterThan', 0)

    cy.contains('Pokédex').should('be.visible')
  })

  it('permet de rechercher un Pokémon (Pikachu)', () => {
    cy.visit('http://localhost:5173')

    // 1. Taper "pikachu" dans l'input
    cy.get('input[type="search"], input[placeholder*="Pokémon"]')
      .type('pikachu')

    // 2. Attendre que la carte apparaisse
    cy.get('[data-testid="pokemon-card"]', { timeout: 10000 })
      .should('contain.text', 'Pikachu')
  })
})

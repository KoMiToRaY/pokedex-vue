import { render } from '@testing-library/vue'
import PokemonCard from '../../src/components/PokemonCard.vue'

test('affiche le nom localisé du Pokémon', () => {
  const pokemon = {
    id: 25,
    name: 'pikachu',
    sprites: {
      front_default: '',
      other: { 'official-artwork': { front_default: '' } }
    },
    types: [{ type: { name: 'electric' } }]
  }

  const { getByText } = render(PokemonCard, {
    props: {
      pokemon,
      localizedName: 'Pikachu'
    }
  })

  getByText(/pikachu/i)
})
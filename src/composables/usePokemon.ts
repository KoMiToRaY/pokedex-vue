import { ref } from 'vue'
import type { Pokemon } from '../interfaces/Pokemon'

export function usePokemon() {
  const pokemon = ref<Pokemon | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPokemon(name: string) {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      if (!res.ok) throw new Error('Pokémon non trouvé')
      pokemon.value = await res.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { pokemon, fetchPokemon, loading, error }
}

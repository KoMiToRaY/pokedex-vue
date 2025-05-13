import { ref } from 'vue'
import type { Pokemon } from '../interfaces/Pokemon'

export function usePokemon() {
  const pokemon = ref<Pokemon | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🌟 Nouvelle variable pour stocker tous les noms
  // pour fix le probleme des search query et que je puisse retourner celebi si j'ai "celeb" en query
  const allPokemonNames = ref<{ name: string; url: string }[]>([])

  async function loadAllPokemonNames() {
    if (allPokemonNames.value.length > 0) return // déjà chargé

    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
      const data = await res.json()
      allPokemonNames.value = data.results
    } catch {
      console.warn('Échec du chargement des noms de Pokémon')
    }
  }

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

  return { pokemon, fetchPokemon, loadAllPokemonNames, allPokemonNames, loading, error }
}

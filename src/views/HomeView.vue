<template>
  <div
    class="h-screen overflow-y-auto px-4 py-6 bg-gradient-to-b from-white to-slate-100"
    @scroll.passive="handleScroll"
    ref="scrollContainer"
  >
    <div class="flex justify-center mb-6">
      <img src="/pokemon-logo.png" alt="Pokémon Logo" class="h-24 md:h-32 object-contain" />
    </div>

    <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Pokédex</h1>

    <div class="flex justify-center gap-4 mb-6">
      <input
        v-model="searchQuery"
        placeholder="Rechercher un Pokémon"
        class="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        v-model="selectedLanguage"
        class="px-3 py-2 border border-gray-300 shadow-sm rounded-lg bg-white"
      >
        <option value="fr">🇫🇷 FR</option>
        <option value="en">🇬🇧 EN</option>
        <option value="ja">🇯🇵 JA</option>
      </select>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <PokemonCard
        v-for="poke in filteredPokemons"
        :key="poke.id"
        :pokemon="poke"
        :localizedName="localizedNames[poke.id] ?? poke.name"
      />
    </div>

    <div class="mt-6 text-center text-gray-600" v-if="loading">
      Chargement...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePokemon } from '../composables/usePokemon'
import type { Pokemon } from '../interfaces/Pokemon'
import PokemonCard from '../components/PokemonCard.vue'

const pokemons = ref<Pokemon[]>([])
// const loading = ref(false)
const offset = ref(0)
const limit = 151
const searchQuery = ref('')
const scrollContainer = ref<HTMLElement | null>(null)
const selectedLanguage = ref('fr')
const localizedNames = ref<Record<number, string>>({})
const {
  fetchPokemon,
  pokemon,
  loading,
  error,
  allPokemonNames,
  loadAllPokemonNames
} = usePokemon()

async function loadMore() {
  if (loading.value) return

  loading.value = true
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`)
    const data = await res.json()

    const pokemonDetails = await Promise.all(
      data.results.map((p: { name: string }) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`).then(res => res.json())
      )
    )

    const speciesResponses = await Promise.all(
      pokemonDetails.map((p) =>
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`)
          .then(res => res.json())
          .catch(() => null)
      )
    )

    speciesResponses.forEach((species, index) => {
      if (!species) return
      const nameEntry = species.names.find((n: any) => n.language.name === selectedLanguage.value)
      if (nameEntry) {
        localizedNames.value[pokemonDetails[index].id] = nameEntry.name
      }
    })

    pokemons.value.push(...pokemonDetails)
    offset.value += limit
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleScroll() {
  const container = scrollContainer.value
  if (!container) return

  const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50
  if (nearBottom) {
    loadMore()
  }
}

const filteredPokemons = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return pokemons.value.filter(p => {
    const name = (localizedNames.value[p.id] ?? p.name).toLowerCase()
    return name.includes(query)
  })
})

onMounted(() => {
  loadMore(),
  loadAllPokemonNames()
})

watch(selectedLanguage, async (newLang) => {
  const promises = pokemons.value.map(async (poke) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}`)
      const data = await res.json()
      const nameEntry = data.names.find((n: any) => n.language.name === newLang)
      if (nameEntry) {
        localizedNames.value[poke.id] = nameEntry.name
      }
    } catch {
      // silencieux si erreur
    }
  })

  await Promise.all(promises)
})

watch(searchQuery, async (val) => {
  const query = val.trim().toLowerCase()

  if (!query || query.length < 2) return

  const alreadyInList = filteredPokemons.value.length > 0
  if (alreadyInList) return

  // Recherche dans la liste locale des noms complets
  const match = allPokemonNames.value.find(p =>
    p.name.toLowerCase().startsWith(query)
  )

  if (match) {
    await fetchPokemon(match.name)

    // Ajoute à la liste principale si pas déjà dedans
    if (pokemon.value) {
      const alreadyAdded = pokemons.value.some(p => p.id === pokemon.value!.id)
      if (!alreadyAdded) {
        pokemons.value.push(pokemon.value)
      }
    }
  }
})
</script>

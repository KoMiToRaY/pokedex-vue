<template>
  <div
      class="rounded-xl p-4 shadow flex flex-col items-center text-white bg-gradient-to-br from-[var(--from)] to-[var(--to)]"
      :style="{
        '--from': getColor(type1),
        '--to': getColor(type2 ?? type1)
      }"
    >
    <h2 class="text-lg font-bold text-gray-800 mb-2 text-center">
      #{{ pokemon.id }} – {{ localizedName }}
    </h2>
    <div class="flex justify-center items-center w-full h-32">
      <img :src="imageUrl" :alt="localizedName" class="h-full object-contain" />
    </div>
    <p class="mt-3 text-sm text-gray-600">
      Types : {{ pokemon.types.map(t => t.type.name).join(', ') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces/Pokemon'

const props = defineProps<{
  pokemon: Pokemon
  localizedName: string
}>()

const imageUrl =
  props.pokemon.sprites.other?.['official-artwork']?.front_default ||
  props.pokemon.sprites.front_default

const typeColors: Record<string, string> = {
  fire: '#f87171',
  water: '#60a5fa',
  grass: '#4ade80',
  electric: '#facc15',
  bug: '#a3e635',
  normal: '#d4d4d4',
  ground: '#fcd34d',
  rock: '#a8a29e',
  poison: '#c084fc',
  psychic: '#f472b6',
  ghost: '#818cf8',
  ice: '#67e8f9',
  dragon: '#818cf8',
  dark: '#6b7280',
  fairy: '#f9a8d4',
  fighting: '#fb923c',
  steel: '#cbd5e1',
  flying: '#93c5fd',
}

function getColor(type: string): string {
  return typeColors[type] ?? '#d4d4d4'
}

const [type1, type2] = props.pokemon.types.map(t => t.type.name)
</script>

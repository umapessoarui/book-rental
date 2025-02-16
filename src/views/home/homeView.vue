<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { searchBestSellers } from '../../shared/services/bookServices'
import BookCard from './components/bookCard/BookCard.vue'
import type { Book } from '@/shared/types/bookTypes'

interface Column {
  books: (Book & { height?: number })[]
  isHovered: boolean
}

const bestSellers = ref<Book[]>([])
const columns = ref<Column[]>([])
const animationDurations = ref<number[]>([])

const screenWidth = ref(window.innerWidth)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

const columnCount = computed(() => {
  if (screenWidth.value > 1440) return 8
  if (screenWidth.value > 1024) return 5
  if (screenWidth.value > 768) return 3
  if (screenWidth.value > 440) return 2
  return 1
})

const fetchBooks = async () => {
  try {
    const bookQuantity = screenWidth.value < 500 ? 10 : 40
    bestSellers.value = await searchBestSellers('best sellers', bookQuantity)
    generateColumns()
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
  }
}

const generateColumns = (): void => {
  if (bestSellers.value.length === 0) return

  const maxBooks = 40
  const booksToDistribute = bestSellers.value.slice(0, maxBooks)

  columns.value = Array.from({ length: columnCount.value }, () => ({ books: [], isHovered: false }))

  booksToDistribute.forEach((book, index) => {
    const colIndex = index % columnCount.value
    columns.value[colIndex].books.push(book)
  })

  generateAnimationSettings()
}

const generateAnimationSettings = () => {
  const baseDelay = screenWidth.value < 1025 ? 100 : 35
  const baseMultiplier = screenWidth.value < 1025 ? 12 : 2
  const delays = Array.from({ length: columnCount.value }, (_, i) => baseDelay + i * baseMultiplier)

  animationDurations.value = delays.sort(() => Math.random() - 0.5)
}

const goToBookPage = (book: Book) => {
  console.log(book)
}

onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <div class="container">
    <div class="columns-container">
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="column"
        @mouseenter="column.isHovered = true"
        @mouseleave="column.isHovered = false"
      >
        <div
          class="scrolling"
          :style="{
            animationDuration: `${animationDurations[index]}s`,
            animationPlayState: column.isHovered || screenWidth < 500 ? 'paused' : 'running',
          }"
        >
          <BookCard
            v-for="(book, bookIndex) in column.books"
            :key="bookIndex"
            :book="book"
            :onClick="goToBookPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Variáveis para breakpoints
$breakpoint-sm: 441px;
$breakpoint-md: 769px;
$breakpoint-lg: 1025px;
$breakpoint-xl: 1441px;

.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  @media (min-width: $breakpoint-sm) {
    overflow: hidden;
  }
}

.columns-container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  z-index: 1;
  padding: 1rem 1rem 0 1rem;
  overflow: visible;

  @media (min-width: $breakpoint-sm) {
    position: absolute;
    top: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
  }

  @media (max-width: $breakpoint-lg) {
    gap: 0.8rem;
  }

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    position: relative;
    top: 0;
    align-items: center;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 6.25rem;
  position: relative;
  z-index: -1;
  overflow: visible;
  margin-top: 100px;

  @media (max-width: $breakpoint-md) {
    min-width: 5rem;
  }

  @media (max-width: $breakpoint-sm) {
    min-width: 100%;
  }

  @media (min-width: $breakpoint-sm) {
    margin-top: 30px;
  }
}

.scrolling {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation-name: scrollUp;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  overflow: visible;
}

@keyframes scrollUp {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-50%);
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { searchBestSellers } from '../../shared/services/bookServices'
import BookCard from '@/components/BookCard/BookCard.vue'
import type { Book } from '@/shared/types/bookTypes'
import { useRouter } from 'vue-router'

interface Column {
  books: (Book & { height?: number })[]
  isHovered: boolean
}

const bestSellers = ref<Book[]>([])
const columns = ref<Column[]>([])
const animationDurations = ref<number[]>([])
const screenWidth = ref(window.innerWidth)
const isLoading = ref(true) // Estado para controlar o carregamento

const router = useRouter()

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

const columnCount = computed(() => {
  if (screenWidth.value > 1440) return 8
  if (screenWidth.value > 1024) return 5
  if (screenWidth.value > 768) return 3
  if (screenWidth.value > 440) return 2
  return 1
})

const fetchBooks = async () => {
  try {
    isLoading.value = true
    const bookQuantity = screenWidth.value < 500 ? 10 : 40
    bestSellers.value = await searchBestSellers('best sellers', bookQuantity)
    generateColumns()
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
  } finally {
    isLoading.value = false
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
  router.push(`/book/${book.id}`)
}

onMounted(() => {
  fetchBooks()
  window.addEventListener('resize', updateScreenWidth)
})
</script>

<template>
  <div class="columns-container">
    <template v-if="isLoading">
      <div v-for="index in columnCount" :key="index" class="column">
        <div v-for="i in 5" :key="i" class="skeleton-card"></div>
      </div>
    </template>

    <template v-else>
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
    </template>
  </div>
</template>

<style lang="scss">
.columns-container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  z-index: 1;
  padding: 1rem;
  overflow: visible;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 6.25rem;
  position: relative;
  overflow: visible;
  margin-top: 100px;
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

.skeleton-card {
  width: 100%;
  height: 180px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
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

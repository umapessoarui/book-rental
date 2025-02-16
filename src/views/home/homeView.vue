<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchBestSellers } from '../../shared/services/bookServices'
import BookCard from './components/bookCard/BookCard.vue'
import type { Book } from '@/shared/types/bookTypes'

interface Column {
  books: (Book & { height?: number })[]
  isHovered: boolean
}

const bestSellers = ref<Book[]>([])
const columns = ref<Column[]>([])
const columnCount = ref<number>(8) // Número fixo de colunas
const animationDurations = ref<number[]>([])

const fetchBooks = async () => {
  try {
    bestSellers.value = await searchBestSellers('best sellers', 40)
    generateColumns()
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
  }
}

const generateColumns = (): void => {
  if (bestSellers.value.length === 0) return

  columns.value = Array.from({ length: columnCount.value }, () => ({ books: [], isHovered: false }))

  for (let i = 0; i < bestSellers.value.length; i++) {
    const colIndex = i % columnCount.value

    columns.value[colIndex].books.push({
      ...bestSellers.value[i],
    })
  }

  columns.value.forEach((col) => {
    col.books = [...col.books, ...col.books]
  })

  generateAnimationSettings()
}

const generateAnimationSettings = () => {
  const delays = Array.from({ length: columnCount.value }, (_, i) => 35 + i * 2)
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
            animationPlayState: column.isHovered ? 'paused' : 'running',
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

<style>
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.columns-container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 16px 16px 0 16px;
  overflow: visible;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 100px;
  position: relative;
  z-index: -1;
  overflow: visible;
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchBestSellers, type Book } from '../../services/bookServices'

interface Column {
  books: (Book & { height?: number })[]
}

const bestSellers = ref<Book[]>([])
const columns = ref<Column[]>([])
const columnCount = ref<number>(8) // Número fixo de colunas
const minBookHeight = 300
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

  columns.value = Array.from({ length: columnCount.value }, () => ({ books: [] }))

  for (let i = 0; i < bestSellers.value.length; i++) {
    const colIndex = i % columnCount.value

    columns.value[colIndex].books.push({
      ...bestSellers.value[i],
      height: minBookHeight,
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
      <div v-for="(column, index) in columns" :key="index" class="column">
        <div
          class="scrolling"
          :style="{
            animationDuration: `${animationDurations[index]}s`,
          }"
        >
          <div
            v-for="(book, bookIndex) in column.books"
            :key="bookIndex"
            class="book-card"
            :style="{
              minHeight: `${book.height}px`,
            }"
            @click="goToBookPage(book)"
          >
            <div
              class="book-image-container"
              :style="{ backgroundImage: `url(${book.thumbnail})` }"
            ></div>
          </div>
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
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 100px;
  overflow: hidden;
  position: relative;
}

.scrolling {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation-name: scrollUp;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes scrollUp {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-50%);
  }
}

.book-card {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  will-change: transform;
  transform-origin: center;
}

.book-card:hover {
  transform: scale(1.04);
}

@keyframes scaleUp {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.04);
  }
}

.book-image-container {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  zoom: 1.5;
}
</style>

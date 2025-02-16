<script setup lang="ts">
import { defineProps } from 'vue'
import type { Book } from '@/shared/types/bookTypes'

defineProps<{
  book: Book
  onClick: (book) => void
}>()
</script>

<template>
  <div class="book-card" @click="onClick(book)">
    <div class="book-image-container" :style="{ backgroundImage: `url(${book.thumbnail})` }"></div>
    <div class="book-details">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-subtitle">{{ book.author?.[0] }}</p>
      <div class="row">
        <div class="book-rating">
          {{ book.averageRating }}
        </div>
        <p class="book-price">R$ {{ book.price }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  width: 240px;
  min-width: 240px;
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
  padding: 10px;
  border-radius: 8px;
}

.book-card:hover {
  transform: scale(1.04);
}

.book-image-container {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  zoom: 1.5;
}

.book-details {
  padding: 8px 2px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.book-title {
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  text-align: left;
}

.book-subtitle {
  font-size: 14px;
  color: gray;
  text-align: left;
}

.book-rating {
  margin: 4px 0;
  font-size: 12px;
}

.book-price {
  font-size: 12px;
  color: #09396a;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>

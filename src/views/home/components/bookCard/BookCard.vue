<script setup lang="ts">
import { defineProps } from 'vue'
import type { Book } from '@/shared/types/bookTypes'

defineProps<{
  book: Book
  onClick: (book: Book) => void
}>()
</script>

<template>
  <div class="book-card" @click="onClick(book)">
    <div
      class="book-card__image-container"
      :style="{ backgroundImage: `url(${book.thumbnail})` }"
    ></div>
    <div class="book-card__details">
      <h3 class="book-card__title">{{ book.title }}</h3>
      <p class="book-card__subtitle">{{ book.author?.[0] }}</p>
      <div class="row">
        <div class="book-card__rating">
          {{ book.averageRating }}
        </div>
        <p class="book-card__price">R$ {{ book.price }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Variáveis para breakpoints
$breakpoint-sm: 441px;
$breakpoint-md: 769px;
$breakpoint-lg: 1025px;
$breakpoint-xl: 1441px;
.book-card {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  will-change: transform;
  transform-origin: center;
  padding: 0.625rem;
  border-radius: 0.5rem;

  &:hover {
    transform: scale(1.04);
  }

  &__image-container {
    width: 100%;
    height: 12.5rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    zoom: 3;
    @media (min-width: $breakpoint-sm) {
      zoom: 2.5;
    }
    @media (min-width: $breakpoint-lg) {
      zoom: 2;
    }
  }

  &__details {
    padding: 0.5rem 0.125rem;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__title {
    font-size: 1rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 13.75rem;
    text-align: left;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: gray;
    text-align: left;
  }

  &__rating {
    margin: 0.25rem 0;
    font-size: 0.75rem;
  }

  &__price {
    font-size: 0.75rem;
    color: #09396a;
  }
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>

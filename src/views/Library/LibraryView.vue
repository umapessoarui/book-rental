<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'

import 'swiper/css'
import 'swiper/css/navigation'

import type { Book } from '@/shared/types/bookTypes'
import { fetchTopBooksByCategory } from '@/shared/services/bookServices'
import BookCard from '@/components/BookCard/BookCard.vue'

const categories = ['Horror', 'Fantasy', 'Fiction', 'Thriller', 'Anime']
const booksByCategory = ref<{ [category: string]: Book[] }>({})
const loading = ref(true)

const router = useRouter()

const goToBookPage = (book: Book) => {
  router.push(`/book/${book.id}`)
}

onMounted(async () => {
  booksByCategory.value = await fetchTopBooksByCategory(categories)
  loading.value = false
})
</script>

<template>
  <div class="book-list-wrapper">
    <div class="book-list">
      <div v-for="category in categories" :key="category" class="book-list__category">
        <h2 class="book-list__title">{{ category }}</h2>

        <swiper
          :modules="[Navigation]"
          :slides-per-view="'auto'"
          :space-between="16"
          navigation
          class="book-list__carousel"
        >
          <template v-if="loading">
            <swiper-slide v-for="n in 5" :key="n" class="book-list__item">
              <div class="skeleton skeleton-card"></div>
            </swiper-slide>
          </template>

          <template v-else>
            <swiper-slide
              v-for="book in booksByCategory[category]"
              :key="book.id"
              class="book-list__item"
            >
              <BookCard :book="book" :onClick="goToBookPage" />
            </swiper-slide>
          </template>
        </swiper>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.book-list-wrapper {
  width: 100%;
  overflow-x: hidden;
}

.book-list {
  padding: 2rem;
  max-width: 100%;

  &__category {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #09396a;
    position: relative;
    padding-bottom: 0.3125rem;
    transition: color 0.3s ease;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0.125rem;
      background-color: #ea762f;
      transition: width 0.3s ease-in-out;
    }

    &:hover {
      color: #ea762f;

      &::after {
        width: 100%;
      }
    }
  }

  &__carousel {
    width: 100%;
    overflow: visible;

    .swiper-slide {
      width: 250px !important;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 2rem;
      border-radius: 100%;
    }
  }

  &__item {
    text-align: center;
  }
}

.skeleton {
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-card {
  width: 250px;
  height: 350px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBookById } from '../../shared/services/bookServices'
import PaymentModal from './components/PaymentModal.vue'
import type { Book } from '../../shared/types/bookTypes'

const route = useRoute()
const book = ref<Book | null>(null)

const isPaymentModalOpen = ref(false)

const openModal = () => {
  isPaymentModalOpen.value = true
}

const closeModal = () => {
  isPaymentModalOpen.value = false
}

const handleSuccess = () => {
  console.log('Pagamento realizado com sucesso!')
}

async function fetchBookDetails(bookId: string): Promise<void> {
  book.value = await getBookById(bookId)
}

onMounted(() => {
  if (route.params.id) {
    fetchBookDetails(route.params.id as string)
  }
})
</script>

<template>
  <div class="book-detail" v-if="book">
    <div class="book-detail__container">
      <div class="book-detail__header">
        <div class="book-detail__cover">
          <img :src="book.thumbnail" :alt="book.title" />
        </div>
        <div class="book-detail__info">
          <h1 class="book-detail__title">{{ book.title }}</h1>
          <p class="book-detail__authors">
            <span v-for="(author, index) in book.author" :key="index">
              <span class="book-detail__author">{{ author }}</span>
              <span v-if="index < book.author.length - 1"> • </span>
            </span>
          </p>
        </div>
      </div>

      <div class="book-detail__meta">
        <span>{{ $t('book.rating') }} {{ book.averageRating }}</span>
        <span> - </span>
        <span>{{ book.pageCount }} {{ $t('book.pages') }}</span>
      </div>

      <button class="book-detail__buy" @click="openModal">
        {{ $t('book.rent') }} R$ {{ book.price.toFixed(2) }}
      </button>

      <div class="book-detail__description">
        <h3>Sobre este e-book</h3>
        <p v-html="book.description"></p>
      </div>
    </div>
  </div>
  <PaymentModal :isOpen="isPaymentModalOpen" @close="closeModal" @paymentSuccess="handleSuccess" />
</template>

<style scoped lang="scss">
.book-detail {
  display: flex;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  &__container {
    display: flex;
    flex-direction: column;
    max-width: 900px;
    width: 100%;
    gap: 1.5rem;

    @media (max-width: 768px) {
      align-items: center;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;

    @media (max-width: 768px) {
      flex-direction: row;
      align-items: center;
      text-align: left;
    }
  }

  &__cover {
    img {
      width: 120px;
      height: auto;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

      @media (max-width: 768px) {
        width: 80px;
      }
    }
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 0;
    }
  }

  &__authors {
    font-size: 1rem;
    color: #09396a;
    font-weight: bold;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  &__meta {
    display: flex;
    gap: 1rem;
  }

  &__buy {
    background: #09396a;
    color: white;
    font-size: 1rem;
    border: none;
    padding: 0.8rem 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0.8rem;
      max-width: 100%;
    }
  }
}
</style>

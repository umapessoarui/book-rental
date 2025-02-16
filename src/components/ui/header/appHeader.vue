<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LanguageSelector from './components/LanguageSelector/LanguageSelector.vue'

const searchQuery = ref('')
const screenWidth = ref(window.innerWidth)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

// onMounted(() => {
//   window.removeEventListener('resize', updateScreenWidth)
// })

const search = () => {
  console.log('Pesquisando:', searchQuery.value)
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__left">
        <div class="header__logo">
          <img src="@/assets/logo.svg" alt="Logo" />
        </div>
        <nav class="header__nav">
          <a href="#" class="nav__link">{{ $t('header.library') }}</a>
        </nav>
      </div>
      <div class="header__actions">
        <div class="search-box" v-if="screenWidth > 440">
          <input
            v-model="searchQuery"
            @keyup.enter="search"
            type="text"
            :placeholder="$t('header.search')"
            class="search-input"
          />
        </div>
        <LanguageSelector></LanguageSelector>
      </div>
    </div>
    <div class="search-box" v-if="screenWidth < 441">
      <input
        v-model="searchQuery"
        @keyup.enter="search"
        type="text"
        :placeholder="$t('header.search')"
        class="search-input"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
// Variáveis para breakpoints
$breakpoint-sm: 440px;

.header {
  background-color: #fff;
  box-shadow: 0.125rem 0.25rem 0.375rem rgba(0, 0, 0, 0.5);
  padding: 0.625rem 1.25rem;
  width: 100%;
  z-index: 100;
  height: 6.25rem;
  position: fixed;

  @media (min-width: $breakpoint-sm) {
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  &__logo img {
    width: 2.5rem;
  }

  &__nav {
    display: flex;
    gap: 1.25rem;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }
}

.nav {
  &__link {
    text-decoration: none;
    color: #09396a;
    font-size: 0.875rem;
    font-weight: bold;
    position: relative;
    padding-bottom: 0.3125rem;
    transition: color 0.3s ease;

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
}

.search-box {
  flex-grow: 1;
  margin-left: auto;
  margin-right: 1.25rem;
  position: relative;
  width: 100%;
  margin-top: 6px;
  @media (min-width: $breakpoint-sm) {
    margin-top: 0;
  }
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.3125rem;
  outline: none;
  font-size: 0.875rem;
  transition: 0.3s;

  @media (min-width: $breakpoint-sm) {
    width: 12.5rem;
  }

  &:focus {
    border-color: #ea762f;
    box-shadow: 0 0 0.3125rem rgba(230, 92, 0, 0.5);
  }
}
</style>

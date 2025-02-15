<script setup lang="ts">
import { ref } from 'vue'
import LanguageSelector from './components/languageSelector.vue'

const searchQuery = ref('')

const search = () => {
  console.log('Pesquisando:', searchQuery.value)
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo">
          <img src="@/assets/logo.svg" alt="Logo" />
        </div>
        <nav class="nav">
          <a href="#" class="nav-link">Busca</a>
          <a href="#" class="nav-link">Biblioteca</a>
        </nav>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <input
            v-model="searchQuery"
            @keyup.enter="search"
            type="text"
            placeholder="Buscar livros..."
            class="search-input"
          />
        </div>
        <LanguageSelector></LanguageSelector>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 100px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.logo img {
  width: 40px;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #09396a;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  padding-bottom: 5px;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: #ea762f;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover {
  color: #ea762f;
}

.nav-link:hover::after {
  width: 100%;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  flex-grow: 1;
  margin-left: auto;
  margin-right: 20px;
  position: relative;
}

.search-input {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  transition: 0.3s;
}

.search-input:focus {
  border-color: #ea762f;
  box-shadow: 0px 0px 5px rgba(230, 92, 0, 0.5);
}
</style>

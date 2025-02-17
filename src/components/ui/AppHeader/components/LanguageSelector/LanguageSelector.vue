<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = ref([
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
])

const selectedLanguage = ref('pt')
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectLanguage = (code: string) => {
  locale.value = code
  selectedLanguage.value = code
  showDropdown.value = false
}
</script>

<template>
  <div class="language-selector">
    <button @click="toggleDropdown" class="selected-language">
      {{ selectedLanguage }}
    </button>
    <div v-if="showDropdown" class="dropdown">
      <div
        v-for="lang in languages"
        :key="lang.code"
        @click="selectLanguage(lang.code)"
        class="dropdown-item"
      >
        {{ lang.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
  font-size: 14px;
}

.selected-language {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 5px;
  text-transform: uppercase;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  width: 140px;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f3f3f3;
}
</style>

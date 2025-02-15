import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    header: {
      library: 'Library',
      search: 'Search for books...',
    },
  },
  pt: {
    header: {
      library: 'Biblioteca',
      search: 'Busque por livros...',
    },
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages,
})

export default i18n

import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    header: {
      home: 'Home',
      library: 'Library',
      search: 'Search for books...',
    },
    book: {
      rent: 'Rent for',
      pages: 'Pages',
      rating: 'Rating:',
    },
  },
  pt: {
    header: {
      home: 'Início',
      library: 'Biblioteca',
      search: 'Busque por livros...',
    },
    book: {
      rent: 'Alugar por',
      pages: 'Pagínas',
      rating: 'Avaliação:',
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

import axios from 'axios'
import { GOOGLE_BOOKS_API, API_KEY } from '../../../env/env'
import type { Book } from '../types/bookTypes'

const API_URL = GOOGLE_BOOKS_API

const cache = new Map<string, { data: Book[]; expiry: number }>()
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutos

const saveToLocalStorage = (key: string, value: { data: Book[]; expiry: number }) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const loadFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export async function searchBestSellers(query: string, maxResults: number): Promise<Book[]> {
  const cacheKey = `books-${query}-${maxResults}`

  const cachedData = cache.get(cacheKey)
  if (cachedData && cachedData.expiry > Date.now()) {
    return cachedData.data
  }

  const localStorageData = loadFromLocalStorage(cacheKey)
  if (localStorageData && localStorageData.expiry > Date.now()) {
    cache.set(cacheKey, localStorageData) // Atualiza o cache na memória
    return localStorageData.data
  }

  try {
    const response = await axios.get(API_URL, {
      params: { q: query, key: API_KEY, maxResults },
    })

    const books = response.data.items.map(
      (item: {
        id: string
        volumeInfo: { title: string; authors: string[]; averageRating: number }
        saleInfo: { listPrice: { amount: number } }
      }) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors,
        averageRating: item.volumeInfo.averageRating || (Math.random() * 5).toFixed(1),
        price: item.saleInfo.listPrice ? item.saleInfo.listPrice.amount : 9.99,
        thumbnail: `https://play.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w256-h256`,
      }),
    )

    const cachedValue = { data: books, expiry: Date.now() + CACHE_DURATION }
    cache.set(cacheKey, cachedValue)
    saveToLocalStorage(cacheKey, cachedValue)

    return books
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
    return []
  }
}

export async function fetchTopBooksByCategory(
  categories: string[],
): Promise<{ [category: string]: Book[] }> {
  const maxResults = 10
  const booksByCategory: { [category: string]: Book[] } = {}

  for (const category of categories) {
    const cacheKey = `top-books-${category}-${maxResults}`

    const cachedData = cache.get(cacheKey)
    if (cachedData && cachedData.expiry > Date.now()) {
      booksByCategory[category] = cachedData.data
      continue
    }

    const localStorageData = loadFromLocalStorage(cacheKey)
    if (localStorageData && localStorageData.expiry > Date.now()) {
      cache.set(cacheKey, localStorageData)
      booksByCategory[category] = localStorageData.data
      continue
    }

    try {
      const response = await axios.get(API_URL, {
        params: { q: `subject:${category}`, key: API_KEY, maxResults, orderBy: 'newest' },
      })

      const books = response.data.items.map(
        (item: {
          id: string
          volumeInfo: { title: string; authors: string[]; averageRating: number }
          saleInfo: { listPrice: { amount: number } }
        }) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors || ['Desconhecido'],
          averageRating: item.volumeInfo.averageRating || (Math.random() * 5).toFixed(1),
          price: item.saleInfo.listPrice ? item.saleInfo.listPrice.amount : 9.99,
          thumbnail: `https://play.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w256-h256`,
        }),
      )

      booksByCategory[category] = books

      const cachedValue = { data: books, expiry: Date.now() + CACHE_DURATION }
      cache.set(cacheKey, cachedValue)
      saveToLocalStorage(cacheKey, cachedValue)
    } catch (error) {
      console.error(`Erro ao buscar livros de ${category}:`, error)
      booksByCategory[category] = []
    }
  }

  return booksByCategory
}

export async function getBookById(bookId: string): Promise<Book | null> {
  try {
    const response = await axios.get(`${API_URL}/${bookId}`, {
      params: { key: API_KEY, country: 'BR' },
    })

    const item = response.data

    return {
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors || ['Desconhecido'],
      averageRating: item.volumeInfo.averageRating || (Math.random() * 5).toFixed(1),
      price: item.saleInfo.listPrice ? item.saleInfo.listPrice.amount : 9.99,
      thumbnail: `https://play.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w256-h256`,
      description: item.volumeInfo.description || 'Descrição não disponível.',
      pageCount: item.volumeInfo.pageCount || 'Não informado',
      publishedDate: item.volumeInfo.publishedDate || 'Data não disponível',
      previewLink: item.volumeInfo.previewLink || '',
    }
  } catch (error) {
    console.error('Erro ao buscar livro por ID:', error)
    return null
  }
}

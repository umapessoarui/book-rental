import axios from 'axios'
import { GOOGLE_BOOKS_API, API_KEY } from '../../env/env'

const API_URL = GOOGLE_BOOKS_API

export interface Book {
  id?: string
  thumbnail: string
}

export async function searchBestSellers(query: string, maxResults: number): Promise<Book[]> {
  try {
    const response = await axios.get(API_URL, {
      params: { q: query, key: API_KEY, maxResults },
    })

    return response.data.items.map(
      (item: { id: string; volumeInfo: { imageLinks?: { thumbnail?: string } } }) => ({
        id: item.id,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      }),
    )
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
    return []
  }
}

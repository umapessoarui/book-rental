export interface Book {
  id?: string
  thumbnail: string
  title: string
  author: string[]
  averageRating: number
  price: { amount: number }
}

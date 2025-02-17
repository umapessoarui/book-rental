import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BookCard from '../BookCard.vue'
import type { Book } from '@/shared/types/bookTypes'

describe('BookCard.vue', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Livro Teste',
    author: ['Autor Teste'],
    price: 29.99,
    thumbnail: 'https://via.placeholder.com/150',
    averageRating: 4.5,
  }

  it('deve renderizar corretamente os detalhes do livro', () => {
    const wrapper = mount(BookCard, {
      props: {
        book: mockBook,
        onClick: vi.fn(),
      },
    })

    expect(wrapper.text()).toContain(mockBook.title)
    expect(wrapper.text()).toContain(mockBook.author[0])
    expect(wrapper.text()).toContain(`R$ ${mockBook.price}`)
    expect(wrapper.text()).toContain(mockBook.averageRating.toString())

    const imageContainer = wrapper.find('.book-card__image-container')
    expect(imageContainer.attributes('style')).toContain(`url(${mockBook.thumbnail})`)
  })

  it('deve chamar a função onClick ao clicar no card', async () => {
    const onClickMock = vi.fn()
    const wrapper = mount(BookCard, {
      props: {
        book: mockBook,
        onClick: onClickMock,
      },
    })

    await wrapper.trigger('click')

    expect(onClickMock).toHaveBeenCalledTimes(1)
    expect(onClickMock).toHaveBeenCalledWith(mockBook)
  })
})

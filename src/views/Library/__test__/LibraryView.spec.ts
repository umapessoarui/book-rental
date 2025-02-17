import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LibraryView from '@/views/Library/LibraryView.vue'
import { fetchTopBooksByCategory } from '@/shared/services/bookServices'

// Mock do serviço de busca de livros
vi.mock('@/shared/services/bookServices', () => ({
  fetchTopBooksByCategory: vi.fn(),
}))

// Mock do Vue Router
const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const mockBooks = {
  Horror: [
    { id: '1', title: 'Book 1', author: 'Author 1' },
    { id: '2', title: 'Book 2', author: 'Author 2' },
  ],
  Fantasy: [{ id: '3', title: 'Book 3', author: 'Author 3' }],
}

describe('LibraryView.vue', () => {
  it('renderiza os títulos das categorias corretamente', async () => {
    // Mockando retorno do serviço
    ;(fetchTopBooksByCategory as any).mockResolvedValue(mockBooks)

    const wrapper = mount(LibraryView)

    await flushPromises() // Espera a promessa ser resolvida

    // Verifica se os títulos das categorias foram renderizados corretamente
    expect(wrapper.text()).toContain('Horror')
    expect(wrapper.text()).toContain('Fantasy')
  })

  it('exibe skeletons enquanto os livros estão carregando', () => {
    const wrapper = mount(LibraryView)

    // Deve haver skeletons no carregamento inicial
    expect(wrapper.findAll('.skeleton-card').length).toBeGreaterThan(0)
  })

  it('exibe os livros corretamente após o carregamento', async () => {
    ;(fetchTopBooksByCategory as any).mockResolvedValue(mockBooks)

    const wrapper = mount(LibraryView)

    await flushPromises()

    // Deve exibir os livros após o carregamento
    expect(wrapper.text()).toContain('Book 1')
    expect(wrapper.text()).toContain('Book 2')
    expect(wrapper.text()).toContain('Book 3')

    // Skeletons devem desaparecer
    expect(wrapper.findAll('.skeleton-card').length).toBe(0)
  })

  it('navega para a página do livro ao clicar em um BookCard', async () => {
    ;(fetchTopBooksByCategory as any).mockResolvedValue(mockBooks)

    const wrapper = mount(LibraryView)

    await flushPromises()

    // Simula clique no primeiro livro
    await wrapper.findComponent({ name: 'BookCard' }).trigger('click')

    // Verifica se foi chamado o push do router
    expect(mockRouterPush).toHaveBeenCalledWith('/book/1')
  })
})

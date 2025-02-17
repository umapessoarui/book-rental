import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import HomeView from '@/views/Home/HomeView.vue'
import { searchBestSellers } from '@/shared/services/bookServices'

// Mock do serviço de busca de livros
vi.mock('@/shared/services/bookServices', () => ({
  searchBestSellers: vi.fn(),
}))

// Mock do Vue Router
const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const mockBooks = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Book ${i + 1}`,
  author: `Author ${i + 1}`,
}))

describe('HomeView.vue', () => {
  it('renderiza corretamente as colunas de livros', async () => {
    ;(searchBestSellers as vi.Mock).mockResolvedValue(mockBooks)

    const wrapper = mount(HomeView)

    await flushPromises()

    // Deve haver colunas renderizadas
    expect(wrapper.findAll('.column').length).toBeGreaterThan(0)

    // Deve exibir os livros após o carregamento
    expect(wrapper.text()).toContain('Book 1')
    expect(wrapper.text()).toContain('Book 5')
  })

  it('exibe skeletons enquanto os livros estão carregando', () => {
    const wrapper = mount(HomeView)

    // Deve haver skeletons no carregamento inicial
    expect(wrapper.findAll('.skeleton-card').length).toBeGreaterThan(0)
  })

  it('responde corretamente à mudança de tamanho da tela', async () => {
    ;(searchBestSellers as vi.Mock).mockResolvedValue(mockBooks)

    const wrapper = mount(HomeView)

    await flushPromises()

    // Simular mudança no tamanho da tela
    global.innerWidth = 500
    global.dispatchEvent(new Event('resize'))

    await flushPromises()

    // Deve ajustar corretamente o número de colunas
    expect(wrapper.findAll('.column').length).toBeGreaterThan(0)
  })

  it('navega para a página do livro ao clicar em um BookCard', async () => {
    ;(searchBestSellers as vi.Mock).mockResolvedValue(mockBooks)

    const wrapper = mount(HomeView)

    await flushPromises()

    // Simula clique no primeiro livro
    await wrapper.findComponent({ name: 'BookCard' }).trigger('click')

    // Verifica se foi chamado o push do router
    expect(mockRouterPush).toHaveBeenCalledWith('/book/1')
  })
})

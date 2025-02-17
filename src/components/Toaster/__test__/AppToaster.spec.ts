import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Toaster from '../AppToaster.vue'
import { toastService } from '@/components/Toaster/services/toasterService'

describe('Toaster.vue', () => {
  it('deve renderizar os toasts corretamente', async () => {
    // Mockando o estado dos toasts
    toastService.state.toasts = [
      { id: 1, type: 'success', message: 'Sucesso!' },
      { id: 2, type: 'error', message: 'Erro!' },
    ]

    const wrapper = mount(Toaster)

    // Verifica se os toasts estão sendo renderizados
    const toasts = wrapper.findAll('.toast')
    expect(toasts.length).toBe(2)
    expect(toasts[0].text()).toBe('Sucesso!')
    expect(toasts[1].text()).toBe('Erro!')

    // Verifica se as classes corretas foram aplicadas
    expect(toasts[0].classes()).toContain('bg-green') // success
    expect(toasts[1].classes()).toContain('bg-red') // error
  })
})

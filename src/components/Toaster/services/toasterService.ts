import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const state = reactive<{ toasts: Toast[] }>({
  toasts: [],
})

const addToast = (message: string, type: ToastType = 'success') => {
  const id = Date.now()
  state.toasts.push({ id, message, type })

  // Remover após 3 segundos
  setTimeout(() => removeToast(id), 3000)
}

const removeToast = (id: number) => {
  state.toasts = state.toasts.filter((toast) => toast.id !== id)
}

export const toastService = {
  state,
  addToast,
}

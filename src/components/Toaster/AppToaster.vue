<script setup lang="ts">
import { computed } from 'vue'
import { type ToastType, toastService } from './services/toasterService'

const toasts = computed(() => toastService.state.toasts)

const getToastClass = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-green'
    case 'error':
      return 'bg-red'
    case 'warning':
      return 'bg-yellow'
    default:
      return 'bg-gray'
  }
}
</script>

<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" :class="['toast', getToastClass(toast.type)]">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.toast {
  padding: 12px 20px;
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.bg-green {
  background-color: green;
}
.bg-red {
  background-color: red;
}
.bg-yellow {
  background-color: yellow;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

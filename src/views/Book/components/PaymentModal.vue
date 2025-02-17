<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import { toastService } from '@/components/Toaster/services/toasterService'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'paymentSuccess'])

const cardNumber = ref('')
const cardName = ref('')
const expiryDate = ref('')
const cvv = ref('')
const loading = ref(false)

// Guarda quais campos já foram tocados
const touchedFields = ref<{ [key: string]: boolean }>({
  cardNumber: false,
  cardName: false,
  expiryDate: false,
  cvv: false,
})

// 🔍 Validação dinâmica dos campos
const errors = computed(() => {
  const err: { [key: string]: string } = {}

  if (touchedFields.value.cardNumber && !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
    err.cardNumber = 'Número do cartão deve ter 16 dígitos'
  }

  if (touchedFields.value.cardName && !cardName.value.trim()) {
    err.cardName = 'Nome no cartão é obrigatório'
  }

  if (touchedFields.value.expiryDate && !/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
    err.expiryDate = 'Data deve estar no formato MM/AA'
  }

  if (touchedFields.value.cvv && !/^\d{3}$/.test(cvv.value)) {
    err.cvv = 'CVV deve ter 3 dígitos'
  }

  return err
})

// ✅ Desabilita o botão se houver erros
const isFormValid = computed(() => Object.keys(errors.value).length === 0)

// ⏳ Simula o pagamento
const processPayment = async () => {
  Object.keys(touchedFields.value).forEach((key) => (touchedFields.value[key] = true)) // Marca todos como tocados
  if (!isFormValid.value) return

  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simula API
  loading.value = false

  toastService.addToast('Pagamento aprovado com sucesso!', 'success')
  emit('paymentSuccess')
  emit('close')
}

// 🔄 Formata a data de validade (MM/AA)
const formatExpiryDate = () => {
  let value = expiryDate.value.replace(/\D/g, '').slice(0, 4)
  if (value.length >= 2) {
    value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2')
  }
  expiryDate.value = value
}
</script>

<template>
  <div v-if="props.isOpen" class="modal">
    <div class="modal__overlay" @click="emit('close')"></div>
    <div class="modal__content">
      <button class="modal__close-btn" @click="emit('close')">✖</button>
      <h2 class="modal__title">Pagamento com Cartão de Crédito</h2>

      <form class="modal__form" @submit.prevent="processPayment">
        <!-- Número do Cartão -->
        <label class="modal__label">Número do Cartão</label>
        <input
          class="modal__input"
          type="text"
          v-model="cardNumber"
          placeholder="**** **** **** ****"
          required
          maxlength="19"
          @blur="touchedFields.cardNumber = true"
        />
        <span v-if="errors.cardNumber" class="modal__error">{{ errors.cardNumber }}</span>

        <!-- Nome no Cartão -->
        <label class="modal__label">Nome no Cartão</label>
        <input
          class="modal__input"
          type="text"
          v-model="cardName"
          placeholder="Nome completo"
          required
          @blur="touchedFields.cardName = true"
        />
        <span v-if="errors.cardName" class="modal__error">{{ errors.cardName }}</span>

        <div class="modal__row">
          <!-- Validade -->
          <div>
            <label class="modal__label">Validade</label>
            <input
              class="modal__input"
              type="text"
              v-model="expiryDate"
              placeholder="MM/AA"
              required
              maxlength="5"
              @input="formatExpiryDate"
              @blur="touchedFields.expiryDate = true"
            />
            <span v-if="errors.expiryDate" class="modal__error">{{ errors.expiryDate }}</span>
          </div>

          <!-- CVV -->
          <div class="modal__cvv">
            <label class="modal__label">CVV</label>
            <input
              class="modal__input"
              type="text"
              v-model="cvv"
              placeholder="***"
              required
              maxlength="3"
              @blur="touchedFields.cvv = true"
            />
            <span v-if="errors.cvv" class="modal__error">{{ errors.cvv }}</span>
          </div>
        </div>

        <button type="submit" class="modal__pay-btn" :disabled="!isFormValid || loading">
          <span v-if="loading" class="modal__loader"></span>
          <span v-else>Alugar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  &__content {
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &__close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
  }

  &__title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 15px;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__input {
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }

  &__error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }

  &__row {
    display: flex;
    gap: 10px;
  }

  &__pay-btn {
    margin-top: 15px;
    padding: 12px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      background: gray;
      cursor: not-allowed;
    }
  }

  &__loader {
    border: 3px solid white;
    border-top: 3px solid transparent;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__cvv {
    max-width: 120px;
    min-width: 120px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>

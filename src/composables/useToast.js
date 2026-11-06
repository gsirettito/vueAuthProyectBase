// src/composables/useToast.js
import { ref } from 'vue';

// Estado global de las notificaciones
const toasts = ref([]);
let nextId = 0;

export function useToast() {
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = nextId++;
    toasts.value.push({ id, message, type });

    // Eliminar automáticamente después del tiempo especificado
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 4000),
    removeToast
  };
}
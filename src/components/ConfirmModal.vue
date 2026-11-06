<!-- src/components/ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-card">
        <div class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>¿Estás seguro?</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button @click="$emit('cancel')" class="btn-secondary">Cancelar</button>
          <button @click="$emit('confirm')" class="btn-danger">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
});
defineEmits(['confirm', 'cancel']);
</script>
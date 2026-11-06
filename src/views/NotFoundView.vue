<!-- src/views/NotFoundView.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <!-- Icono de advertencia -->
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la ruta a la que intentas acceder no existe o ha sido movida.</p>
      
      <!-- Botón dinámico según el estado de sesión -->
      <button @click="goHome" class="btn-primary" style="margin-top: 24px;">
        {{ isAuthenticated ? 'Volver al Panel' : 'Ir al Login' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user } = useAuth();

// Saber si hay un usuario logueado para cambiar el texto del botón
const isAuthenticated = computed(() => !!user.value);

const goHome = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
};
</script>
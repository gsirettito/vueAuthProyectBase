<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar" style="position: static; width: 100%; border-bottom: 1px solid #e5e7eb; box-shadow: none;">
     <!-- Zona izquierda: Botón de colapsar y Título -->
    <div style="display: flex; align-items: center; gap: 16px;">
      <button @click="$emit('toggle-sidebar')" style="background: none; border: none; cursor: pointer; color: #4b5563; display: flex; align-items: center;">
        <svg style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div style="font-weight: 600; color: #374151;">Panel de Administración</div>
    </div>

    <!-- Zona derecha: Usuario y Salir -->
    <div class="navbar-user">
      <RouterLink to="/profile" style="text-decoration: none; color: #4b5563; display: flex; align-items: center; gap: 8px;">
  <span>Hola, <strong>{{ user?.email }}</strong></span>
</RouterLink>
      <button @click="handleLogout" class="btn-logout">
        Salir
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// Definimos el evento que emitirá el botón
defineEmits(['toggle-sidebar']);

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
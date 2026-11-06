<!-- src/App.vue -->
<template>
  <ToastContainer />
  <!-- Si hay usuario, mostramos el Layout del Dashboard -->
  <div v-if="user" class="app-layout">
    <!-- Le pasamos el estado al Sidebar -->
    <Sidebar :isCollapsed="isCollapsed" />
    <!-- Ajustamos el margen del contenido dinámicamente -->
    <div class="main-wrapper" :class="{ 'expanded': isCollapsed }">
      <!-- Le pasamos el evento para cambiar el estado al Navbar -->
      <Navbar @toggle-sidebar="isCollapsed = !isCollapsed" />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Si NO hay usuario, mostramos solo el login/registro -->
  <div v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue'; // Importamos el nuevo menú
import { useAuth } from '@/composables/useAuth';
import ToastContainer from '@/components/ToastContainer.vue';

const { user } = useAuth();

// Estado para controlar si el menú está colapsado
const isCollapsed = ref(false);
</script>

<style>
/* Aquí puedes poner estilos globales si quieres */
</style>
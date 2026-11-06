<!-- src/views/SettingsView.vue -->
<template>
  <div class="content-wrapper">
    <div style="margin-bottom: 24px;">
      <h1>Ajustes ⚙️</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Gestiona tu cuenta y la configuración de la app.</p>
    </div>

    <!-- Pestañas de navegación -->
    <div class="tabs">
      <button 
        v-if="userRole === 'admin'" 
        class="tab-btn" 
        :class="{ active: activeTab === 'global' }" 
        @click="activeTab = 'global'"
      >
        Global
      </button>
      <!-- Solo mostramos esta pestaña si el usuario es admin -->
      <button 
        v-if="userRole === 'admin'" 
        class="tab-btn" 
        :class="{ active: activeTab === 'system' }" 
        @click="activeTab = 'system'"
      >
        Sistema
      </button>
    </div>

    <!-- Contenido de la Pestaña: Global -->
    <div v-if="activeTab === 'global'" class="tab-content">
      <h2 style="font-size: 18px; margin-bottom: 16px;">Configuración del Sistema</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Aquí irían las opciones avanzadas de administración, como activar/desactivar registros, cambiar el nombre de la intranet o configurar integraciones.
        </p>
      </div>
    </div>

    <!-- Contenido de la Pestaña: Sistema (Solo Admin) -->
    <div v-if="activeTab === 'system'" class="tab-content">
      <h2 style="font-size: 18px; margin-bottom: 16px;">Configuración del Sistema</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Aquí irían las opciones avanzadas de administración, como activar/desactivar registros, cambiar el nombre de la intranet o configurar integraciones.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { pb } from '@/composables/useAuth';

const { user, userRole } = useAuth();

const activeTab = ref('global'); // Pestaña activa por defecto
const loadingPassword = ref(false);

const passwords = reactive({
  old: '',
  new: '',
  confirm: ''
});

const message = reactive({
  text: '',
  type: 'success' // 'success' o 'error'
});

</script>
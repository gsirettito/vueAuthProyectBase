<!-- src/views/DashboardView.vue -->
<template>
  <div class="content-wrapper">
    <h1 style="margin-bottom: 8px;">Bienvenido a tu App Privada 🚀</h1>
    <p style="color: #6b7280; margin-bottom: 32px;">Este es tu panel principal.</p>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
      <p><strong>Usuario:</strong> {{ user?.email }}</p>
      <p style="margin-top: 8px;"><strong>Estado:</strong> <span style="color: #059669; font-weight: 600;">Verificado</span></p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
const { user } = useAuth();
</script>
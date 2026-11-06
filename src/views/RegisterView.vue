<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-container">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      <h1>Crear cuenta</h1>

      <form v-if="!registered" @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" required :disabled="loading" placeholder="tu@correo.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required minlength="8" :disabled="loading"
            placeholder="Mínimo 8 caracteres" />
        </div>
        <div class="form-group">
          <label>Confirmar contraseña</label>
          <input v-model="passwordConfirm" type="password" required :disabled="loading"
            placeholder="Repite la contraseña" />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarme' }}
        </button>

        <p class="auth-switch">
          ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>
        </p>
      </form>

      <!-- Mensaje de éxito -->
      <div v-else style="text-align: center;">
        <h2 style="color: #059669; margin-bottom: 16px;">✅ Cuenta creada</h2>
        <p style="margin-bottom: 16px; color: #4b5563;">
          Hemos enviado un correo a <strong>{{ email }}</strong>.
        </p>
        <p style="margin-bottom: 24px; font-size: 14px;">
          Ábrelo en <a href="http://localhost:1080" target="_blank" style="color: #1055c9;">MailDev</a> para confirmar
          tu cuenta.
        </p>
        <RouterLink to="/login" class="btn-primary" style="display: block; text-decoration: none;">
          Volver al login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { register } = useAuth();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const registered = ref(false);
const error = ref('');
const role = ref('user');

const handleRegister = async () => {
  error.value = '';
  if (password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }
  loading.value = true;
  try {
    await register(email.value, password.value);
    registered.value = true;
  } catch (e) {
    // PocketBase devuelve errores detallados en e.data
    console.error("Detalle del error:", JSON.stringify(e.data, null, 2));

    error.value = e?.data?.message || e?.message || 'Error al registrar la cuenta.';
    //error.value = e?.data?.message || e?.message || 'Error al registrar la cuenta.';
  } finally {
    loading.value = false;
  }
};
</script>
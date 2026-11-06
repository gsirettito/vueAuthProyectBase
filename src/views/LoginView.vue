<template>
  <div class="auth-container">
    <div class="auth-card">
     <div class="logo-container">
    <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  </div>

      <h1>Iniciar sesión</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" required :disabled="loading" placeholder="tu@correo.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required :disabled="loading" placeholder="••••••••" />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div v-if="notVerified" class="warning-message">
          <p style="margin-bottom: 8px;">Tu cuenta no está confirmada. Revisa MailDev.</p>
          <button type="button" @click="handleResend" :disabled="resending" style="background:none; border:none; color:#92400e; text-decoration:underline; cursor:pointer;">
            {{ resending ? 'Enviando...' : 'Reenviar correo' }}
          </button>
          <p v-if="resendMessage" style="margin-top: 8px; font-weight: bold;">{{ resendMessage }}</p>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="auth-switch">
          ¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { pb } from '@/composables/useAuth'; // exporta pb desde useAuth si no lo tienes ya

const router = useRouter();
const { login } = useAuth();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const notVerified = ref(false);
const resending = ref(false);
const resendMessage = ref('');

const handleLogin = async () => {
  error.value = '';
  notVerified.value = false;
  resendMessage.value = '';
  loading.value = true;
  try {
    const authData = await login(email.value, password.value);

    // PocketBase permite el login aunque el correo no esté verificado,
    // así que comprobamos el flag manualmente.
    if (!authData.record.verified) {
      notVerified.value = true;
      return;
    }

    router.push('/dashboard'); // o la ruta protegida que tengas
  } catch (e) {
    error.value = e?.data?.message || e?.message || 'Credenciales incorrectas.';
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  resending.value = true;
  resendMessage.value = '';
  try {
    await pb.collection('users').requestVerification(email.value);
    resendMessage.value = 'Correo reenviado. Revisa MailDev.';
  } catch (e) {
    resendMessage.value = 'No se pudo reenviar el correo.';
  } finally {
    resending.value = false;
  }
};
</script>
    <template>
  <div class="auth-container">
    <h1>Verificando cuenta</h1>

    <div v-if="status === 'loading'">
      <p>Procesando tu confirmación...</p>
    </div>

    <div v-else-if="status === 'success'" class="success">
      <h2>✅ Cuenta confirmada</h2>
      <p>Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.</p>
      <RouterLink to="/login">Ir al login</RouterLink>
    </div>

    <div v-else class="error-box">
      <h2>❌ No se pudo confirmar</h2>
      <p>{{ errorMessage }}</p>
      <RouterLink to="/login">Volver al login</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { pb } from '@/composables/useAuth';

const route = useRoute();
const status = ref('loading');
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    status.value = 'error';
    errorMessage.value = 'Falta el token de verificación en la URL.';
    return;
  }
  try {
    await pb.collection('users').confirmVerification(token);
    status.value = 'success';
  } catch (e) {
    status.value = 'error';
    errorMessage.value =
      e?.data?.message || 'El enlace puede haber expirado o ya fue usado.';
  }
});
</script>
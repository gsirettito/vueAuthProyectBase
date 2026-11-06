<!-- src/views/ProfileView.vue -->
<template>
  <div class="content-wrapper">
    <div style="margin-bottom: 24px;">
      <h1>Mi Perfil 👤</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Gestiona tu información personal y seguridad.</p>
    </div>

    <div class="profile-grid">
      <!-- Tarjeta de Información del Usuario -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-large">{{ user?.email?.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ user?.email }}</h2>
            <span :class="userRole === 'admin' ? 'badge badge-success' : 'badge badge-warning'">
              {{ userRole === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
            <span v-if="user?.verified" class="badge badge-success" style="margin-left: 8px;">Verificado</span>
          </div>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 14px;">
          <p><strong>Miembro desde:</strong> {{ formatDate(user?.created) }}</p>
        </div>
      </div>

      <!-- Tarjeta de Cambio de Contraseña -->
      <div class="profile-card">
        <h3 style="font-size: 18px; margin-bottom: 16px;">Cambiar Contraseña</h3>
        
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Contraseña Actual</label>
            <input v-model="passwords.old" type="password" required placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Nueva Contraseña</label>
            <input v-model="passwords.new" type="password" required minlength="8" placeholder="Mínimo 8 caracteres" />
          </div>
          <div class="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input v-model="passwords.confirm" type="password" required placeholder="Repite la nueva contraseña" />
          </div>

          <button type="submit" class="btn-primary" :disabled="loadingPassword">
            {{ loadingPassword ? 'Actualizando...' : 'Actualizar Contraseña' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { pb } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';

const { user, userRole } = useAuth();
const toast = useToast();

const loadingPassword = ref(false);

const passwords = reactive({
  old: '',
  new: '',
  confirm: ''
});

// Función para formatear la fecha (similar a la que usaste en UsersView)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

const changePassword = async () => {
  if (passwords.new !== passwords.confirm) {
    toast.error('Las contraseñas nuevas no coinciden.');
    return;
  }
  if (passwords.new.length < 8) {
    toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
    return;
  }

  loadingPassword.value = true;

  try {
    await pb.collection('users').update(user.value.id, {
      oldPassword: passwords.old,
      password: passwords.new,
      passwordConfirm: passwords.confirm,
    });

    toast.success('¡Contraseña actualizada correctamente!');
    
    // Limpiamos el formulario
    passwords.old = '';
    passwords.new = '';
    passwords.confirm = '';

  } catch (error) {
    console.error(error);
    toast.error('Error: La contraseña actual es incorrecta.');
  } finally {
    loadingPassword.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos para esta vista que no rompen el diseño global */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #eff6ff;
  color: #1055c9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 28px;
}

.profile-header h2 {
  font-size: 18px;
  color: #111827;
  margin-bottom: 4px;
  word-break: break-all;
}
</style>
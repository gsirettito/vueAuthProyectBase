<!-- src/views/UsersView.vue -->
<template>
  <div class="content-wrapper">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1>Gestión de Usuarios 👥</h1>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Administra los roles y elimina miembros.</p>
      </div>

      <!-- 👇 NUEVO BUSCADOR 👇 -->
      <div class="search-container">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por correo o rol..." 
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" style="text-align: center; padding: 40px; color: #6b7280;">
      Cargando usuarios...
    </div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Rol Actual</th>
            <th style="width: 120px; text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- 👇 CAMBIAMOS 'users' POR 'filteredUsers' 👇 -->
          <tr v-for="u in filteredUsers" :key="u.id">
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="avatar">{{ u.email ? u.email.charAt(0).toUpperCase() : '?' }}</div>
                <div>
                  <span style="font-weight: 500; display: block;">{{ u.email || 'Sin correo' }}</span>
                  <span v-if="u.id === currentUser?.id" style="font-size: 12px; color: #1055c9;">(Tú)</span>
                </div>
              </div>
            </td>
            <td>
              <span v-if="u.verified" class="badge badge-success">Verificado</span>
              <span v-else class="badge badge-warning">Pendiente</span>
            </td>
            <td>
              <select 
                v-model="u.role" 
                @change="updateRole(u, $event.target.value)"
                class="role-select"
                :class="u.role === 'admin' ? 'role-admin' : 'role-user'"
                :disabled="u.id === currentUser?.id" 
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </td>
            <td style="text-align: center;">
              <button 
                @click="deleteUser(u)" 
                class="btn-delete"
                :disabled="u.id === currentUser?.id || deletingId === u.id"
              >
                <svg v-if="deletingId !== u.id" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span v-else style="font-size: 12px;">...</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Mensaje si la búsqueda no da resultados -->
      <div v-if="filteredUsers.length === 0" style="text-align: center; padding: 40px; color: #6b7280;">
        No se encontraron usuarios que coincidan con "{{ searchQuery }}".
      </div>
    </div>

    <ConfirmModal 
      :show="showDeleteModal" 
      message="Esta acción eliminará permanentemente al usuario y no se puede deshacer."
      @cancel="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Añadimos 'computed'
import { pb } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast'; // Importamos Toast
import ConfirmModal from '@/components/ConfirmModal.vue'; // Importamos Modal

const users = ref([]);
const loading = ref(true);
const updatingId = ref(null);
const deletingId = ref(null);
const currentUser = pb.authStore.model;
const toast = useToast();
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// 👇 NUEVA VARIABLE PARA LA BÚSQUEDA 👇
const searchQuery = ref('');

// 👇 PROPIEDAD COMPUTADA PARA FILTRAR 👇
const filteredUsers = computed(() => {
  // Si la búsqueda está vacía, devolvemos todos los usuarios
  if (!searchQuery.value.trim()) {
    return users.value;
  }
  
  const term = searchQuery.value.toLowerCase().trim();
  
  // Filtramos por correo o por rol
  return users.value.filter(u => {
    const emailMatch = u.email && u.email.toLowerCase().includes(term);
    const roleMatch = u.role && u.role.toLowerCase().includes(term);
    return emailMatch || roleMatch;
  });
});

onMounted(async () => {
  try {
    const records = await pb.collection('users').getFullList({ sort: '-created' });
    users.value = records;
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  } finally {
    loading.value = false;
  }
});

// ... (tus funciones updateRole y deleteUser se mantienen exactamente igual)
const updateRole = async (user, newRole) => {
  if (user.id === currentUser?.id) return;
  updatingId.value = user.id;
  try {
    await pb.collection('users').update(user.id, { role: newRole });
    toast.success(`Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    toast.error('No se pudo actualizar el rol.');
  } finally {
    updatingId.value = null;
  }
};

const deleteUser = (user) => {
  if (user.id === currentUser?.id) return;
  userToDelete.value = user;
  showDeleteModal.value = true; // Mostramos el modal
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  deletingId.value = userToDelete.value.id;
  showDeleteModal.value = false; // Ocultamos el modal inmediatamente
  
  try {
    await pb.collection('users').delete(userToDelete.value.id);
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    toast.success('Usuario eliminado correctamente.'); // ¡Toast de éxito!
  } catch (error) {
    console.error('Error al eliminar:', error);
    toast.error('No se pudo eliminar al usuario.');
  } finally {
    deletingId.value = null;
    userToDelete.value = null;
  }
};
</script>
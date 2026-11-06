// src/composables/useAuth.js
import { ref, computed } from 'vue'; // Añade computed
import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// 1. Creamos un estado reactivo global para el usuario.
// Al inicializarse, lee automáticamente el localStorage. Si había sesión, la recupera.
const user = ref(pb.authStore.model);

// 2. Escuchamos cualquier cambio en la sesión (login, logout, token expirado)
pb.authStore.onChange((token, model) => {
  user.value = model; // Actualiza el ref automáticamente
});

export function useAuth() {
  //const user = ref(pb.authStore.model);
  // Rol del usuario reactivo
  const userRole = computed(() => user.value?.role || 'user'); // Por defecto 'user'

  // Función de Login
  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  };

  // Función de Registro
  const register = async (email, password) => {

    const payload = {
      email,
      password,
      passwordConfirm: password,
      role: 'user', // Asignamos 'user' por defecto a los nuevos registros
    };
    console.log("Enviando a PocketBase:", payload);
    const newUser = await pb.collection('users').create(payload);
    await pb.collection('users').requestVerification(email);
    return newUser;
  };

  // Función de Logout
  const logout = () => {
    pb.authStore.clear(); // Limpia la sesión de la memoria y del localStorage
  };

  // Función para verificar el correo
  const confirmVerification = async (token) => {
    await pb.collection('users').confirmVerification(token);
  };

  // Retornamos todo lo que necesitan las vistas
  return { user, pb, userRole, login, register, logout, confirmVerification };
}
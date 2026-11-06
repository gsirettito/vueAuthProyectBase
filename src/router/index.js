// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import VerifyEmailView from '../views/VerifyEmailView.vue';
import DashboardView from '@/views/DashboardView.vue'; // Nuestra nueva vista privada
import { useAuth } from '@/composables/useAuth';
import UsersView from '@/views/UsersView.vue';
import SettingsView from '@/views/SettingsView.vue';
import AdminView from '@/views/AdminView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import ProfileView from '@/views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/login', name: 'login', component: LoginView },
    // Ruta que recibirá el token desde el enlace del correo
    { path: '/verify-email', name: 'verify-email', component: VerifyEmailView },
    // Ruta Protegida
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/users', name: 'users', component: UsersView, meta: { requiresAuth: true } },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    },
  ],
});

// 🛡️ EL GUARDIÁN (Bouncer)
router.beforeEach((to, from, next) => {
  const { user, userRole } = useAuth(); // Obtenemos el usuario reactivo

  const isAuthenticated = !!user.value; // true si hay usuario
  const isVerified = user.value?.verified; // true si está verificado
  const isAdmin = user.value?.role == 'admin';

  if (to.meta.requiresAuth && !user.value) {
    if (!isAuthenticated) {
      next('/login');
    } else if (!isVerified) {
      next('/login'); // O a una página de "Pendiente de verificación"
    } else {
      next();
    }
  } else {
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated && isVerified && !isAdmin) {
      next('/dashboard');
    } else {
      next();
    }
  }
});


export default router;
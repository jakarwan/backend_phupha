import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginPage from "@/views/LoginPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import CustomerPage from "@/views/CustomerPage.vue";
import ProductPage from "@/views/ProductPage.vue";
import OrderPage from "@/views/OrderPage.vue";

const routes = [
  { path: "/login", component: LoginPage },
  {
    path: "/",
    component: MainLayout,
    children: [{ path: "", component: DashboardPage }],
    meta: { requiresAuth: true },
  },
  {
    path: "/customers",
    component: MainLayout,
    children: [{ path: "", component: CustomerPage }],
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    component: MainLayout,
    children: [{ path: "", component: OrderPage }],
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    component: MainLayout,
    children: [{ path: "", component: ProductPage }],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  // const auth = localStorage.getItem("token");
  if (to.meta.requiresAuth && !auth.token) {
    next("/login");
  } else {
    next();
  }
});

export default router;

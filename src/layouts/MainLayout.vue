<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="drawer"
      color="blue-grey-darken-4"
      class="text-white"
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Topbar -->
    <v-app-bar app color="blue-grey-darken-3" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title
        ><div class="d-flex justify-between">
          <div>
            <span class="font-bold">PHUPHA-HELP</span> ระบบจัดการหลังบ้าน
          </div>
          <!-- <span class="text-base"> -->
          <!-- ✅ Profile dropdown -->
          <v-menu offset-y>
            <template #activator="{ props }">
              <div
                v-bind="props"
                variant="text"
                class="d-flex align-items-center text-white text-base select-none md:d-none"
              >
                {{ user.first_name }} {{ user.family_name }}
                <v-icon end>mdi-menu-down</v-icon>
              </div>
            </template>

            <v-list class="cursor-pointer">
              <v-list-item>
                <v-list-item-title>โปรไฟล์</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleLogout()">
                <v-list-item-title>ออกจากระบบ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- </span> -->
        </div></v-toolbar-title
      >
    </v-app-bar>

    <!-- ✅ Main content -->
    <v-main app class="pa-100 bg-grey-lighten-5">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const auth = useAuthStore();
const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
const user = JSON.parse(localStorage.getItem("user"));
const drawer = ref(true);
const menuItems = [
  { title: "แดชบอร์ด", to: "/", icon: "mdi-view-dashboard" },
  { title: "รายชื่อลูกค้า", to: "/customers", icon: "mdi-account-group" },
  { title: "รายการสั่งซื้อ", to: "/orders", icon: "mdi-cart-outline" },
  { title: "รายชื่อสินค้า", to: "/products", icon: "mdi-shopping-outline" },
];
</script>

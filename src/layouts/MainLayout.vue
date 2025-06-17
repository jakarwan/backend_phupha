<template>
  <v-app>
    <!-- Modern Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      color="white"
      width="280"
      class="custom-drawer"
      :rail="mini"
    >
      <!-- Logo Section -->
      <div class="logo-section pa-1 text-center" v-if="!mini">
        <!-- <v-avatar size="56" color="green" class="mb-3 elevation-3"> -->
        <!-- <v-icon size="32" color="white">mdi-leaf</v-icon> -->
        <img src="@/assets/images/phupha.png" alt="" />
        <!-- </v-avatar> -->
        <!-- <h2 v-if="!mini" class="text-h6 font-weight-bold text-green-darken-3">
          PHUPHA-HELP
        </h2> -->
      </div>

      <v-divider></v-divider>

      <!-- Navigation Menu -->
      <v-list nav class="pa-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :title="item.title"
          :prepend-icon="item.icon"
          rounded="lg"
          class="mb-1 menu-item"
          color="green"
          exact
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="24"></v-icon>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-2">
          <v-list-item
            @click="toggleMini"
            rounded="lg"
            class="menu-item"
            :title="mini ? 'ขยาย' : 'ย่อ'"
          >
            <template v-slot:prepend>
              <v-icon
                :icon="mini ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                size="24"
              ></v-icon>
            </template>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Modern App Bar -->
    <v-app-bar app flat color="white" height="70" class="custom-appbar">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="grey-darken-2"
        class="d-lg-none"
      ></v-app-bar-nav-icon>
      <!-- Logo Section -->
      <div class="pa-6 text-center d-flex justify-between items-center">
        <h2 v-if="!mini" class="text-h6 font-weight-bold text-red-darken-3">
          PHUPHA-HELP
        </h2>
        <!-- <p v-if="!mini" class="text-green-darken-3 mx-1">ระบบจัดการหลังบ้าน</p> -->
      </div>
      <v-spacer></v-spacer>

      <!-- Action Buttons -->
      <div class="d-flex align-center">
        <v-divider vertical class="mx-3"></v-divider>

        <!-- User Menu -->
        <v-menu
          offset-y
          :close-on-content-click="false"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              variant="text"
              class="user-menu-btn pa-2 d-flex justify-between items-center"
            >
              <v-avatar size="36" color="green-lighten-4" class="mr-2">
                <span
                  class="text-body-1 text-green-darken-2 font-weight-medium"
                >
                  {{ user.first_name?.charAt(0)
                  }}{{ user.family_name?.charAt(0) }}
                </span>
              </v-avatar>
              <div class="text-left d-none d-sm-block">
                <p class="text-body-2 font-weight-medium mb-0">
                  {{ user.first_name }} {{ user.family_name }}
                </p>
              </div>
              <v-icon end>mdi-chevron-down</v-icon>
            </div>
          </template>

          <!-- Dropdown Menu -->
          <v-card width="280" class="user-dropdown">
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <v-avatar size="64" color="green-lighten-4" class="mb-3">
                  <span class="text-h5 text-green-darken-2">
                    {{ user.first_name?.charAt(0)
                    }}{{ user.family_name?.charAt(0) }}
                  </span>
                </v-avatar>
                <h3 class="text-h6 font-weight-medium">
                  {{ user.first_name }} {{ user.family_name }}
                </h3>
              </div>

              <!-- <v-divider class="mb-3"></v-divider>

              <v-list density="compact" class="pa-0">
                <v-list-item
                  prepend-icon="mdi-account-outline"
                  title="โปรไฟล์"
                  class="rounded-lg mb-1"
                  @click="goToProfile"
                ></v-list-item>
                
                <v-list-item
                  prepend-icon="mdi-cog-outline"
                  title="ตั้งค่า"
                  class="rounded-lg mb-1"
                  @click="goToSettings"
                ></v-list-item>
                
                <v-list-item
                  prepend-icon="mdi-help-circle-outline"
                  title="ช่วยเหลือ"
                  class="rounded-lg"
                  @click="goToHelp"
                ></v-list-item>
              </v-list> -->

              <v-divider class="my-3"></v-divider>

              <v-btn
                block
                color="red-lighten-1"
                variant="tonal"
                prepend-icon="mdi-logout"
                @click="handleLogout"
                class="text-none"
              >
                ออกจากระบบ
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main app class="main-content">
      <!-- Page Content -->
      <div class="page-content pa-1">
        <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Router & Store
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// Reactive Data
const drawer = ref(true);
const mini = ref(false);
const search = ref("");
const showFab = ref(true);

// User Data
const user = computed(() => {
  return (
    JSON.parse(localStorage.getItem("user")) || {
      first_name: "Guest",
      family_name: "User",
      email: "guest@example.com",
      role: "Guest",
    }
  );
});

// Menu Items
const menuItems = [
  {
    title: "แดชบอร์ด",
    to: "/",
    icon: "mdi-view-dashboard-outline",
    color: "green",
  },
  {
    title: "รายชื่อลูกค้า",
    to: "/customers",
    icon: "mdi-account-group-outline",
    color: "blue",
  },
  {
    title: "รายการสั่งซื้อ",
    to: "/orders",
    icon: "mdi-cart-outline",
    color: "orange",
  },
  {
    title: "รายชื่อสินค้า",
    to: "/products",
    icon: "mdi-package-variant-closed",
    color: "purple",
  },
  // {
  //   title: "รายงาน",
  //   to: "/reports",
  //   icon: "mdi-chart-box-outline",
  //   color: "red",
  // },
  // {
  //   title: "ตั้งค่า",
  //   to: "/settings",
  //   icon: "mdi-cog-outline",
  //   color: "grey",
  // },
];

// Breadcrumbs
const breadcrumbs = computed(() => {
  const items = [
    {
      title: "หน้าแรก",
      to: "/",
      disabled: false,
    },
  ];

  if (route.name && route.name !== "home") {
    items.push({
      title: route.meta.title || route.name,
      to: route.path,
      disabled: true,
    });
  }

  return items;
});

// Methods
const toggleMini = () => {
  mini.value = !mini.value;
};

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};

// Watch route changes
watch(
  () => route.path,
  (newPath) => {
    // Update FAB visibility based on route
    showFab.value = ["/", "/products", "/customers", "/orders"].includes(
      newPath
    );
  }
);
</script>

<style scoped>
/* Drawer Styles */
.custom-drawer {
  border-right: 1px solid #e0e0e0 !important;
}

.logo-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-bottom: 2px solid #4caf50;
}

.user-section {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border: 1px solid #c8e6c9;
}

/* Menu Items */
.menu-item {
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  transform: translateX(4px);
}

.menu-item.v-list-item--active {
  background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%) !important;
  color: white !important;
}

.menu-item.v-list-item--active :deep(.v-icon) {
  color: white !important;
}

/* App Bar Styles */
.custom-appbar {
  border-bottom: 1px solid #e0e0e0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04) !important;
}

.search-field :deep(.v-field) {
  background: #f5f5f5 !important;
  border-radius: 10px !important;
}

.search-field :deep(.v-field__input) {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

/* User Menu Button */
.user-menu-btn {
  border-radius: 12px !important;
  padding: 8px 12px !important;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background-color: #f5f5f5 !important;
}

/* User Dropdown */
.user-dropdown {
  margin-top: 8px;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Main Content */
.main-content {
  background: #f8f9fa !important;
  min-height: 100vh;
}

.breadcrumb-section {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.page-content {
  /* max-width: 1600px; */
  margin: 0 auto;
}

/* FAB Button */
.fab-button {
  bottom: 24px !important;
  right: 24px !important;
  transition: all 0.3s ease !important;
}

.fab-button:hover {
  transform: scale(1.1) rotate(90deg) !important;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 1280px) {
  .page-content {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .search-field {
    display: none !important;
  }

  .user-menu-btn .text-left {
    display: none !important;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2e7d32;
}
</style>

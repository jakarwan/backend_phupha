<template>
  <v-container
    class="fill-height d-flex align-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <v-card
      class="w-full max-w-md p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in"
    >
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white my-4">
          เข้าสู่ระบบ
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          กรอกข้อมูลเพื่อเข้าสู่ระบบของคุณ
        </p>
      </div>
      <div class="px-4">
        <v-form @submit.prevent="handleLogin" ref="loginForm">
          <v-text-field
            v-model="username"
            label="ชื่อผู้ใช้"
            variant="underlined"
            prepend-icon="mdi-account"
            class="mb-4"
            hide-details
            required
          />
          <v-text-field
            v-model="password"
            label="รหัสผ่าน"
            variant="underlined"
            prepend-icon="mdi-lock"
            type="password"
            class="mb-6"
            hide-details
            required
          />
          <div>
            <v-btn type="submit" color="primary" block elevation="2">
              เข้าสู่ระบบ
            </v-btn>
          </div>
        </v-form>
      </div>

      <div class="mt-4 text-center">
        <small class="text-gray-500 dark:text-gray-400"
          >ยังไม่มีบัญชี?
          <a href="#" class="text-blue-500 hover:underline"
            >สมัครใช้งาน</a
          ></small
        >
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/plugins/axios";
import { alertSuccess, alertError } from "@/utils/alert";

const username = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    auth.login(res.data.token, res.data.user);
    alertSuccess("เข้าสู่ระบบสำเร็จ");
    router.push("/");
  } catch (error) {
    alertError(error.response.data.msg);
  }
};
</script>

<style scoped>
.v-input__control {
  background-color: transparent !important;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>

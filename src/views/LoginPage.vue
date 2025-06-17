<template>
  <v-container fluid class="pa-0 fill-height login-container">
    <!-- Background Pattern -->
    <div class="login-background"></div>
    
    <!-- Login Card -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="5" xl="4">
        <v-card class="login-card elevation-24 rounded-xl">
          <!-- Header Section with Logo -->
          <div class="card-header text-center pa-8 pb-6">
            <!-- Logo Circle -->
            <div class="logo-container mb-4">
              <v-avatar size="80" color="white" class="elevation-4">
                <v-icon size="40" color="green-darken-2">mdi-leaf</v-icon>
              </v-avatar>
            </div>
            
            <h1 class="text-h4 font-weight-bold text-white mb-2">
              ยินดีต้อนรับ
            </h1>
            <p class="text-body-1 text-white-90">
              เข้าสู่ระบบเพื่อจัดการธุรกิจของคุณ
            </p>
          </div>

          <!-- Form Section -->
          <v-card-text class="pa-8 pt-10">
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <!-- Username Field -->
              <div class="input-group mb-6">
                <v-text-field
                  v-model="username"
                  label="ชื่อผู้ใช้"
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  variant="outlined"
                  color="green"
                  density="comfortable"
                  class="custom-input"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="[rules.required]"
                  hide-details="auto"
                ></v-text-field>
              </div>

              <!-- Password Field -->
              <div class="input-group mb-6">
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="รหัสผ่าน"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  variant="outlined"
                  color="green"
                  density="comfortable"
                  class="custom-input"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[rules.required]"
                  hide-details="auto"
                ></v-text-field>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  label="จดจำฉัน"
                  color="green"
                  density="compact"
                  hide-details
                  class="custom-checkbox"
                ></v-checkbox>
                
                <a href="#" class="forgot-link text-decoration-none">
                  ลืมรหัสผ่าน?
                </a>
              </div>

              <!-- Login Button -->
              <v-btn
                type="submit"
                block
                size="large"
                color="green"
                class="login-btn mb-4"
                :loading="isLoading"
                :disabled="!isFormValid"
              >
                <v-icon start>mdi-login</v-icon>
                เข้าสู่ระบบ
              </v-btn>

            </v-form>
          </v-card-text>

          <!-- Footer -->
          <v-card-actions class="pa-6 pt-0">
            <v-spacer></v-spacer>
            <div class="text-center w-100">
              <p class="text-body-2 text-medium-emphasis mb-0">
                ยังไม่มีบัญชี?
                <a href="#" class="register-link font-weight-medium">
                  สมัครใช้งานฟรี
                </a>
              </p>
            </div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>

        <!-- Copyright -->
        <div class="text-center mt-4">
          <p class="text-caption text-white-70">
            © 2025 PHUPHA-HELP. All rights reserved.
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Floating Shapes -->
    <div class="floating-shape shape-1"></div>
    <div class="floating-shape shape-2"></div>
    <div class="floating-shape shape-3"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/plugins/axios";
import { alertSuccess, alertError } from "@/utils/alert";

// Form Data
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const loginForm = ref();

// Router & Store
const router = useRouter();
const auth = useAuthStore();

// Validation Rules
const rules = {
  required: (value: string) => !!value || "กรุณากรอกข้อมูล",
};

// Form Validation
const isFormValid = computed(() => {
  return username.value.length > 0 && password.value.length > 0;
});

// Login Handler
const handleLogin = async () => {
  // Validate form
  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  isLoading.value = true;
  
  try {
    const res = await api.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    
    auth.login(res.data.token, res.data.user);
    alertSuccess("เข้าสู่ระบบสำเร็จ");
    
    // Save remember me
    if (rememberMe.value) {
      localStorage.setItem('rememberUsername', username.value);
    } else {
      localStorage.removeItem('rememberUsername');
    }
    
    router.push("/");
  } catch (error: any) {
    alertError(error.response?.data?.msg || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
  } finally {
    isLoading.value = false;
  }
};

// Check remember me on mount
const savedUsername = localStorage.getItem('rememberUsername');
if (savedUsername) {
  username.value = savedUsername;
  rememberMe.value = true;
}
</script>

<style scoped>
/* Container & Background */
.login-container {
  background: linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%);
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

/* Login Card */
.login-card {
  overflow: hidden;
  background: white !important;
  position: relative;
  backdrop-filter: blur(10px);
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

/* Logo Container */
.logo-container {
  display: inline-block;
  position: relative;
  z-index: 1;
}

.logo-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ripple 2s ease-in-out infinite;
}

/* Input Styling */
.custom-input :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.custom-input :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
}

/* Checkbox Styling */
.custom-checkbox :deep(.v-label) {
  color: #616161;
  font-size: 14px;
}

/* Links */
.forgot-link {
  color: #4CAF50;
  font-size: 14px;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #2E7D32;
  text-decoration: underline !important;
}

.register-link {
  color: #4CAF50;
  text-decoration: none;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #2E7D32;
  text-decoration: underline !important;
}

/* Login Button */
.login-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  height: 48px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

/* Social Buttons */
.social-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 400;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Divider */
.divider-container {
  display: flex;
  align-items: center;
  position: relative;
}

.divider-line {
  flex: 1;
}

.divider-text {
  color: #9E9E9E;
  font-size: 14px;
  background: white;
  position: relative;
  z-index: 1;
}

/* Floating Shapes */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  right: -75px;
  animation-delay: 5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: -50px;
  animation-delay: 10s;
}

/* Text Colors */
.text-white-90 {
  color: rgba(255, 255, 255, 0.9);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .card-header {
    padding: 2rem !important;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .login-card {
    margin: 1rem;
  }
}
</style>
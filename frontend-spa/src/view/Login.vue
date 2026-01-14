<template>
  <div class="login-container">
    <!-- Video background -->
    <video autoplay muted loop class="background-video">
      <source
        src="../assets/Recording 2025-07-10 174701.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>

    <!-- Background decorative elements -->
    <div class="background-overlay">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <!-- Main login card -->
    <div class="login-card">
      <!-- Compact header with icon -->
      <div class="form-header">
        <div class="logo-section">
          <h1 class="form-title">{{ isRegister ? "Đăng ký" : "Đăng nhập" }}</h1>
        </div>
      </div>

      <!-- Error message display -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Login form -->
      <form v-if="!isRegister" @submit.prevent="handleLogin" class="login-form">
        <!-- Email field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="form-input"
              required
            />
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>

        <!-- Password field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mật khẩu"
              class="form-input"
              required
            />
            <span class="input-icon"><i class="fas fa-lock"></i></span>
            <button
              type="button"
              @click="togglePassword"
              class="password-toggle"
            >
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
        </div>

        <!-- Remember me checkbox -->
        <div class="form-options">
          <label class="checkbox-label">
            <input v-model="rememberMe" type="checkbox" class="checkbox" />
            <span class="checkmark"></span>
            Ghi nhớ đăng nhập
          </label>
        </div>

        <!-- Login button -->
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
        </button>

        <!-- Toggle link -->
        <div class="form-footer">
          <p class="toggle-link">
            Chưa có tài khoản?
            <a href="#" class="link" @click.prevent="toggleForm"
              >Đăng ký ngay</a
            >
          </p>
        </div>
      </form>

      <!-- Register form -->
      <form v-else @submit.prevent="handleRegister" class="register-form">
        <!-- Email field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="form-input"
              required
            />
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>

        <!-- Password field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mật khẩu"
              class="form-input"
              required
            />
            <span class="input-icon"><i class="fas fa-lock"></i></span>
            <button
              type="button"
              @click="togglePassword"
              class="password-toggle"
            >
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu"
              class="form-input"
              required
            />
            <span class="input-icon"><i class="fas fa-lock"></i></span>
          </div>
        </div>

        <!-- Date of Birth field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="date_of_birth"
              type="date"
              placeholder="Ngày sinh"
              class="form-input"
            />
            <span class="input-icon"><i class="fas fa-calendar-alt"></i></span>
          </div>
        </div>

        <!-- Grade Level field -->
        <div class="input-group">
          <div class="input-wrapper">
            <select v-model="grade_level" class="form-input">
              <option value="" disabled selected>Chọn cấp học</option>
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
              <option value="university">Đại học</option>
              <option value="other">Khác</option>
            </select>
            <span class="input-icon"
              ><i class="fas fa-graduation-cap"></i
            ></span>
          </div>
        </div>

        <!-- Preferred Language field -->
        <div class="input-group">
          <div class="input-wrapper">
            <select v-model="preferred_language" class="form-input">
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh</option>
            </select>
            <span class="input-icon"><i class="fas fa-language"></i></span>
          </div>
        </div>

        <!-- Terms checkbox -->
        <div class="form-options">
          <label class="checkbox-label">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="checkbox"
              required
            />
            <span class="checkmark"></span>
            Đồng ý với điều khoản sử dụng
          </label>
        </div>

        <!-- Register button -->
        <button type="submit" class="register-button" :disabled="isLoading">
          {{ isLoading ? "Đang xử lý..." : "Đăng ký" }}
        </button>

        <!-- Toggle link -->
        <div class="form-footer">
          <p class="toggle-link">
            Đã có tài khoản?
            <a href="#" class="link" @click.prevent="toggleForm">Đăng nhập</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuth } from "../composables/useAuth";

export default {
  name: "LoginPage",
  setup() {
    const {
      isRegister,
      email,
      password,
      confirmPassword,
      date_of_birth,
      grade_level,
      preferred_language,
      showPassword,
      rememberMe,
      acceptTerms,
      isLoading,
      errorMessage,
      getRandomFormula,
      handleLogin,
      handleRegister,
      togglePassword,
      toggleForm,
      resetError,
    } = useAuth();

    return {
      isRegister,
      email,
      password,
      confirmPassword,
      date_of_birth,
      grade_level,
      preferred_language,
      showPassword,
      rememberMe,
      acceptTerms,
      isLoading,
      errorMessage,
      getRandomFormula,
      handleLogin,
      handleRegister,
      togglePassword,
      toggleForm,
      resetError,
    };
  },
};
</script>

<style scoped>
/* Giữ nguyên style */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
  margin-top: -5%;
  margin-left: -1%;
  margin-right: -1%;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.background-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 70%;
  right: 15%;
  animation-delay: 3s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  top: 35%;
  left: 80%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  max-width: 380px;
  width: 100%;
  padding: 32px 24px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.form-title {
  font-size: 36px;
  font-weight: 700;
  color: #6e08dc;
  margin: 0;
}

.login-form,
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1.5px solid #e1e8ed;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  color: #667eea;
  z-index: 1;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  z-index: 1;
  padding: 4px;
}

.form-options {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 4px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: #070606;
}

.checkbox {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.login-button,
.register-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-button:hover,
.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.login-button:disabled,
.register-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form-footer {
  text-align: center;
  margin-top: 16px;
}

.toggle-link {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.error-message {
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
  background: rgba(229, 62, 62, 0.1);
  padding: 8px;
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-card {
    max-width: 340px;
    padding: 24px 20px;
  }

  .form-title {
    font-size: 22px;
  }

  .form-input {
    padding: 11px 14px 11px 38px;
    font-size: 14px;
  }

  .input-icon {
    left: 12px;
    font-size: 15px;
  }

  .login-button,
  .register-button {
    padding: 12px 18px;
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .login-card {
    max-width: 300px;
    padding: 20px 16px;
  }

  .logo-section {
    flex-direction: column;
    gap: 8px;
  }

  .form-title {
    font-size: 20px;
  }
}
</style>

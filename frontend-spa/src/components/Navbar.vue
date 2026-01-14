<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <div class="atom-logo">
          <div class="nucleus"></div>
          <div class="electron-orbit">
            <div class="electron"></div>
          </div>
        </div>
        <span class="logo-text">MoleMind</span>
      </div>
      <div class="nav-links">
        <a href="#" class="nav-item" @click.prevent="setActive('home')">
          <span class="tooltip-wrapper">
            <i class="fas fa-home"></i> Trang chủ
            <span class="tooltip-text">Trang chủ</span>
          </span>
        </a>
        <a href="#" class="nav-item" @click.prevent="setActive('games')">
          <span class="tooltip-wrapper">
            <i class="fas fa-gamepad"></i> Trò chơi
            <span class="tooltip-text">Danh sách trò chơi</span>
          </span>
        </a>
        <a href="#" class="nav-item" @click.prevent="setActive('learn')">
          <span class="tooltip-wrapper">
            <i class="fas fa-book"></i> Học tập
            <span class="tooltip-text">Tài liệu học tập</span>
          </span>
        </a>
        <a href="#" class="nav-item" @click.prevent="setActive('experiments')">
          <span class="tooltip-wrapper">
            <i class="fas fa-flask"></i> Thí nghiệm
            <span class="tooltip-text">Thí nghiệm hóa học</span>
          </span>
        </a>
        <a href="#" class="nav-item" @click.prevent="setActive('leaderboard')">
          <span class="tooltip-wrapper">
            <i class="fas fa-trophy"></i> Bảng xếp hạng
            <span class="tooltip-text">Bảng xếp hạng người chơi</span>
          </span>
        </a>
      </div>
      <div class="nav-actions">
        <button class="login-btn" @click="goToLogin">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </button>
      </div>
    </div>
    <div class="mobile-menu-toggle" @click="toggleMobileMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <a href="#" @click.prevent="setActive('home')">
        <span class="tooltip-wrapper">
          <i class="fas fa-home"></i> Trang chủ
          <span class="tooltip-text">Trang chủ</span>
        </span>
      </a>
      <a href="#" @click.prevent="setActive('games')">
        <span class="tooltip-wrapper">
          <i class="fas fa-gamepad"></i> Trò chơi
          <span class="tooltip-text">Danh sách trò chơi</span>
        </span>
      </a>
      <a href="#" @click.prevent="setActive('learn')">
        <span class="tooltip-wrapper">
          <i class="fas fa-book"></i> Học tập
          <span class="tooltip-text">Tài liệu học tập</span>
        </span>
      </a>
      <a href="#" @click.prevent="setActive('experiments')">
        <span class="tooltip-wrapper">
          <i class="fas fa-flask"></i> Thí nghiệm
          <span class="tooltip-text">Thí nghiệm hóa học</span>
        </span>
      </a>
      <a href="#" @click.prevent="setActive('leaderboard')">
        <span class="tooltip-wrapper">
          <i class="fas fa-trophy"></i> Bảng xếp hạng
          <span class="tooltip-text">Bảng xếp hạng người chơi</span>
        </span>
      </a>
      <button class="login-btn" @click="goToLogin">
        <i class="fas fa-sign-in-alt"></i> Đăng nhập
      </button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "AppNavbar",
  data() {
    return {
      activeItem: "home",
      mobileMenuOpen: false,
    };
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  methods: {
    setActive(item) {
      this.activeItem = item;
      this.mobileMenuOpen = false;
      this.router.push(`/${item === "home" ? "" : item}`);
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    goToLogin() {
      this.router.push("/login");
      this.mobileMenuOpen = false;
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #030508, #4c307d);
  color: #fff;
  padding: 1rem 2rem;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.atom-logo {
  position: relative;
  width: 40px;
  height: 40px;
}

.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #facc15;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.electron-orbit {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: orbit 2s linear infinite;
}

.electron {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #22d3ee;
  border-radius: 50%;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate 1.5s linear infinite;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #facc15;
}

.nav-item .tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item .tooltip-text {
  visibility: hidden;
  background: linear-gradient(135deg, rgba(255, 217, 61, 0.9), rgba(255, 170, 0, 0.9));
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 10;
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 217, 61, 0.5);
}

.nav-item .tooltip-text::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(255, 217, 61, 0.9) transparent;
}

.nav-item:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(5px);
}

.nav-actions {
  display: flex;
  align-items: center;
}

.login-btn {
  background: #facc15;
  color: #1e3a8a;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-btn:hover {
  background: #eab308;
  transform: translateY(-1px);
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.3rem;
  cursor: pointer;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background: #fff;
  transition: all 0.3s ease;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1e3a8a;
  flex-direction: column;
  padding: 1rem;
  gap: 0.8rem;
  border-radius: 0 0 10px 10px;
}

.mobile-menu.active {
  display: flex;
}

.mobile-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-menu a:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #facc15;
}

.mobile-menu a .tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-menu a .tooltip-text {
  visibility: hidden;
  background: linear-gradient(135deg, rgba(255, 217, 61, 0.9), rgba(255, 170, 0, 0.9));
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 10;
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 217, 61, 0.5);
}

.mobile-menu a .tooltip-text::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(255, 217, 61, 0.9) transparent;
}

.mobile-menu a:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(5px);
}

.mobile-menu .login-btn {
  width: 100%;
  margin-top: 0.5rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .nav-actions {
    display: none;
  }
  .mobile-menu-toggle {
    display: flex;
  }
  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
  .mobile-menu a .tooltip-text {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }
  .logo-text {
    font-size: 1rem;
  }
  .atom-logo {
    width: 30px;
    height: 30px;
  }
  .nucleus {
    width: 8px;
    height: 8px;
  }
  .electron-orbit {
    width: 22px;
    height: 22px;
  }
  .mobile-menu {
    padding: 0.5rem;
  }
  .mobile-menu a {
    font-size: 1rem;
  }
  .mobile-menu a .tooltip-text {
    max-width: 200px;
    white-space: normal;
    text-align: left;
  }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate {
  from { transform: translateX(-50%) rotate(0deg); }
  to { transform: translateX(-50%) rotate(360deg); }
}
</style>
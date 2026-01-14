<template>
  <nav class="admin-sidebar-nav">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <img
          src="@/assets/logohomepage.png"
          alt="Logo Quản Lý"
          class="sidebar-logo"
        />
        <span class="brand-title">Quản lí </span>
      </div>
    </div>

    <div class="sidebar-menu">
      <router-link
        to="/admin"
        class="nav-item"
        :class="{ active: isRouteActive('/admin') && !isSubRouteActive }"
      >
        <i class="fas fa-users"></i>
        <span>Người Dùng</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin') && !isSubRouteActive"
        ></div>
      </router-link>

      <router-link
        to="/admin/games"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/games') }"
      >
        <i class="fas fa-gamepad"></i>
        <span>Game</span>
        <div class="nav-indicator" v-if="isRouteActive('/admin/games')"></div>
      </router-link>

      <router-link
        to="/admin/elements"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/elements') }"
      >
        <i class="fas fa-atom"></i>
        <span>Nguyên Tố</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin/elements')"
        ></div>
      </router-link>

      <router-link
        to="/admin/compounds"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/compounds') }"
      >
        <i class="fas fa-flask"></i>
        <span>Hợp Chất</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin/compounds')"
        ></div>
      </router-link>

      <router-link
        to="/admin/reactions"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/reactions') }"
      >
        <i class="fas fa-vial"></i>
        <span>Phản Ứng</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin/reactions')"
        ></div>
      </router-link>

      <router-link
        to="/admin/crosswords"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/crosswords') }"
      >
        <i class="fas fa-puzzle-piece"></i>
        <span>Ô Chữ</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin/crosswords')"
        ></div>
      </router-link>
      <router-link
        to="/admin/sessions"
        class="nav-item"
        :class="{ active: isRouteActive('/admin/sessions') }"
      >
        <i class="fas fa-history"></i>
        <span>Phiên</span>
        <div
          class="nav-indicator"
          v-if="isRouteActive('/admin/sessions')"
        ></div>
      </router-link>
    </div>

    <div class="sidebar-footer">
      <div class="user-info" v-if="loggedInUser">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-details">
          <span class="user-name">{{ loggedInUser.username }}</span>
          <span class="user-role">Admin</span>
        </div>
      </div>
      <button class="logout-btn" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Đăng Xuất</span>
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "AppAdminNavbar",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loggedInUser = ref(null);
    const currentPath = ref(route.path);

    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentPath.value = newPath;
      }
    );

    const isSubRouteActive = computed(() => {
      return [
        "/admin/games",
        "/admin/elements",
        "/admin/compounds",
        "/admin/reactions",
        "/admin/sessions",
        "/admin/questions",
        "/admin/achievements",
        "/admin/crosswords",
      ].some((path) => currentPath.value.startsWith(path));
    });

    const isRouteActive = (routePath) => {
      return (
        currentPath.value === routePath ||
        (currentPath.value.startsWith(routePath + "/") &&
          !isSubRouteActive.value)
      );
    };

    onMounted(() => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        loggedInUser.value = JSON.parse(userData);
      }
    });

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userId");
      router.push("/login");
    };

    return {
      loggedInUser,
      logout,
      isRouteActive,
      currentPath,
      isSubRouteActive,
    };
  },
};
</script>

<style scoped>
/* Giữ nguyên các style hiện tại */
.admin-sidebar-nav {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #2a2a72 0%, #4c2889 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-logo {
  width: 100px;
  height: 100 px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.brand-title {
  font-family: "Orbitron", monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.sidebar-menu {
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  margin: 4px 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item:hover {
  color: #ffffff;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transform: translateX(4px);
}

.nav-item.active::before {
  opacity: 0;
}

.nav-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(to bottom, #ffd93d, #ff6b6b);
  border-radius: 2px 0 0 2px;
  box-shadow: 0 0 8px rgba(255, 217, 61, 0.6);
}

.nav-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  transition: transform 0.3s ease;
}

.nav-item.active i {
  transform: scale(1.1);
}

.nav-item span {
  font-weight: 600;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  position: relative;
}

.user-avatar i {
  font-size: 2.2rem;
  color: #ffd93d;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.user-avatar::after {
  content: "";
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid white;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}

.logout-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b, #b91c1c);
  border: none;
  border-radius: 12px;
  padding: 14px 16px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.logout-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.logout-btn:hover::before {
  left: 100%;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar-header {
    padding: 20px 16px;
  }

  .brand-title {
    font-size: 1.3rem;
  }

  .nav-item {
    padding: 14px 20px;
    margin: 3px 8px;
    font-size: 0.9rem;
  }

  .sidebar-footer {
    padding: 16px;
  }

  .user-info {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .sidebar-header {
    padding: 16px 12px;
  }

  .brand-title {
    display: none;
  }

  .nav-item {
    padding: 12px 16px;
    margin: 2px 4px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item i {
    font-size: 1.4rem;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .user-details {
    align-items: center;
  }
}

/* Animation for active state changes */
@keyframes activeSlide {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.nav-item.active .nav-indicator {
  animation: activeSlide 0.3s ease;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

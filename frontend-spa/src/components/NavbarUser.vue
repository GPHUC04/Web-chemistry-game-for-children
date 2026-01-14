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
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeItem === 'home' }"
          @click.prevent="setActive('home')"
        >
          <i class="fas fa-home"></i> Trang chủ
        </a>
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeItem === 'games' }"
          @click.prevent="setActive('games')"
        >
          <i class="fas fa-gamepad"></i> Trò chơi
        </a>
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeItem === 'learn' }"
          @click.prevent="setActive('learn')"
        >
          <i class="fas fa-book"></i> Học tập
        </a>
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeItem === 'experiments' }"
          @click.prevent="setActive('experiments')"
        >
          <i class="fas fa-flask"></i> Thí nghiệm
        </a>
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeItem === 'leaderboard' }"
          @click.prevent="setActive('leaderboard')"
        >
          <i class="fas fa-trophy"></i> Bảng xếp hạng
        </a>
      </div>

      <div class="nav-actions">
        <div class="user-menu">
          <div class="user-info" @click="toggleUserDropdown">
            <div class="user-avatar"><i class="fas fa-user"></i></div>
            <div class="user-details">
              <span class="user-name">{{ displayUserName }}</span>
              <span class="user-level">{{ displayUserLevel }}</span>
            </div>
            <i
              class="fas fa-chevron-down dropdown-arrow"
              :class="{ active: showUserDropdown }"
            ></i>
          </div>

          <div class="user-dropdown" v-show="showUserDropdown">
            <div class="dropdown-user-info">
              <div class="dropdown-avatar"><i class="fas fa-user"></i></div>
              <div class="dropdown-user-details">
                <span class="dropdown-user-name">{{ displayUserName }}</span>
                <span class="dropdown-user-email">{{ userEmail }}</span>
                <span class="dropdown-user-stats">
                  <i class="fas fa-star"></i> Cấp {{ userLevel }} |
                  {{ userExperience }} XP
                </span>
                <span class="dropdown-user-stats">
                  <i class="fas fa-chart-line"></i> Điểm: {{ userTotalScore }} |
                  Trò chơi: {{ userTotalGames }}
                </span>
              </div>
            </div>
            <hr class="dropdown-divider" />
            <a href="#" class="dropdown-item" @click.prevent="goToProfile"
              ><i class="fas fa-user-circle"></i> Hồ sơ</a
            >
            <a href="#" class="dropdown-item" @click.prevent="goToSettings"
              ><i class="fas fa-cog"></i> Cài đặt</a
            >
            <hr class="dropdown-divider" />
            <a
              href="#"
              class="dropdown-item logout"
              @click.prevent="handleLogout"
              ><i class="fas fa-sign-out-alt"></i> Đăng xuất</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu-toggle" @click="toggleMobileMenu">
      <span></span><span></span><span></span>
    </div>

    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <a
        href="#"
        :class="{ active: activeItem === 'home' }"
        @click.prevent="setActive('home')"
        ><i class="fas fa-home"></i> Trang chủ</a
      >
      <a
        href="#"
        :class="{ active: activeItem === 'games' }"
        @click.prevent="setActive('games')"
        ><i class="fas fa-gamepad"></i> Trò chơi</a
      >
      <a
        href="#"
        :class="{ active: activeItem === 'learn' }"
        @click.prevent="setActive('learn')"
        ><i class="fas fa-book"></i> Học tập</a
      >
      <a
        href="#"
        :class="{ active: activeItem === 'experiments' }"
        @click.prevent="setActive('experiments')"
        ><i class="fas fa-flask"></i> Thí nghiệm</a
      >
      <a
        href="#"
        :class="{ active: activeItem === 'leaderboard' }"
        @click.prevent="setActive('leaderboard')"
        ><i class="fas fa-trophy"></i> Bảng xếp hạng</a
      >

      <div class="mobile-user-menu">
        <div class="mobile-user-info">
          <div class="user-avatar"><i class="fas fa-user"></i></div>
          <div class="user-details">
            <span class="user-name">{{ displayUserName }}</span>
            <span class="user-level">{{ displayUserLevel }}</span>
            <span class="user-stats">
              <i class="fas fa-star"></i> Cấp {{ userLevel }} |
              {{ userExperience }} XP
            </span>
            <span class="user-stats">
              <i class="fas fa-chart-line"></i> Điểm: {{ userTotalScore }} | Trò
              chơi: {{ userTotalGames }}
            </span>
          </div>
        </div>
        <hr class="mobile-divider" />
        <a href="#" class="mobile-dropdown-item" @click.prevent="goToProfile"
          ><i class="fas fa-user-circle"></i> Hồ sơ</a
        >
        <a href="#" class="mobile-dropdown-item" @click.prevent="goToSettings"
          ><i class="fas fa-cog"></i> Cài đặt</a
        >
        <a
          href="#"
          class="mobile-dropdown-item logout"
          @click.prevent="handleLogout"
          ><i class="fas fa-sign-out-alt"></i> Đăng xuất</a
        >
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  name: "NavbarUser",
  data() {
    return {
      activeItem: "home",
      mobileMenuOpen: false,
      showUserDropdown: false,
      userId: null,
      username: "",
      userEmail: "",
      userGradeLevel: "",
      userLevel: 1,
      userExperience: 0,
      userTotalScore: 0,
      userTotalGames: 0,
      userData: null,
      loginError: null,
    };
  },

  computed: {
    displayUserName() {
      if (this.username) return this.username;
      if (this.userEmail) return this.userEmail.split("@")[0];
      return "Người dùng";
    },
    displayUserLevel() {
      return this.formatGradeLevel(this.userGradeLevel);
    },
  },

  methods: {
    async checkAuthStatus() {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const userData = localStorage.getItem("userData");

      if (token && userId) {
        if (userData) {
          try {
            this.userData = JSON.parse(userData);
            this.loadUserDataFromResponse(this.userData);
          } catch (e) {
            console.error("Không thể parse userData từ localStorage");
          }
        }
        await this.fetchUserData(userId, token);
      } else {
        this.clearUserData();
      }
    },

    async fetchUserData(userId, token) {
      try {
        const response = await axios.get(
          `https://ct313hm01-project-gphuc04.onrender.com/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const user = response.data.result;
        if (user) {
          this.loadUserDataFromResponse(user);
          localStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu người dùng:", err);
        this.handleLogout();
      }
    },

    loadUserDataFromResponse(user) {
      this.userId = user.user_id || null;
      this.username = user.username || "";
      this.userEmail = user.email || "";
      this.userGradeLevel = user.grade_level || "";
      this.userLevel = user.level || 1;
      this.userExperience = user.experience_points || 0;
      this.userTotalScore = user.total_score || 0;
      this.userTotalGames = user.total_games_played || 0;
    },

    clearUserData() {
      this.userId = null;
      this.username = "";
      this.userEmail = "";
      this.userGradeLevel = "";
      this.userLevel = 1;
      this.userExperience = 0;
      this.userTotalScore = 0;
      this.userTotalGames = 0;
      this.userData = null;
    },

    formatGradeLevel(gradeLevel) {
      const gradeMap = {
        6: "Lớp 6",
        7: "Lớp 7",
        8: "Lớp 8",
        9: "Lớp 9",
        10: "Lớp 10",
        11: "Lớp 11",
        12: "Lớp 12",
        university: "Đại học",
        other: "Khác",
      };
      return gradeMap[gradeLevel] || "Không xác định";
    },

    setActive(item) {
      this.activeItem = item;
      this.mobileMenuOpen = false;
      this.showUserDropdown = false;
      const routes = {
        home: "/homepage",
        games: "/games",
        learn: "/learn",
        experiments: "/experiments",
        leaderboard: "/leaderboard",
      };
      this.$router.push(routes[item]);
    },

    updateActiveItem() {
      const routes = {
        "/homepage": "home",
        "/games": "games",
        "/learn": "learn",
        "/experiments": "experiments",
        "/leaderboard": "leaderboard",
      };
      this.activeItem = routes[this.$route.path] || "home";
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      this.showUserDropdown = false;
    },

    toggleUserDropdown() {
      this.showUserDropdown = !this.showUserDropdown;
    },

    goToProfile() {
      this.$router.push("/profile");
      this.showUserDropdown = false;
      this.mobileMenuOpen = false;
    },

    goToSettings() {
      this.$router.push("/settings");
      this.showUserDropdown = false;
      this.mobileMenuOpen = false;
    },

    handleLogout() {
      localStorage.clear();
      this.clearUserData();
      this.showUserDropdown = false;
      this.mobileMenuOpen = false;
      this.$router.push("/login");
    },

    handleClickOutside(event) {
      if (!event.target.closest(".user-menu")) {
        this.showUserDropdown = false;
      }
    },
  },

  mounted() {
    this.checkAuthStatus();
    this.updateActiveItem();
    window.addEventListener("storage", this.checkAuthStatus);
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    window.removeEventListener("storage", this.checkAuthStatus);
    document.removeEventListener("click", this.handleClickOutside);
  },

  watch: {
    "$route.path": {
      handler() {
        this.updateActiveItem();
      },
      immediate: true,
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

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: #facc15;
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 35px;
  height: 35px;
  background: #facc15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e3a8a;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-level {
  font-size: 0.75rem;
  color: #facc15;
  font-weight: 500;
}

.user-stats {
  font-size: 0.7rem;
  color: #22d3ee;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.dropdown-arrow.active {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1001;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: #f8f9fa;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  background: #facc15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e3a8a;
  font-size: 1.2rem;
}

.dropdown-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.dropdown-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.dropdown-user-email {
  font-size: 0.8rem;
  color: #666;
}

.dropdown-user-stats {
  font-size: 0.75rem;
  color: #4c307d;
  font-weight: 500;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #4c307d;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.dropdown-divider {
  border: none;
  height: 1px;
  background: #e9ecef;
  margin: 0.5rem 0;
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
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #facc15 #1e3a8a;
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

.mobile-menu a.active {
  background: rgba(255, 255, 255, 0.2);
  color: #facc15;
  font-weight: 600;
}

.mobile-user-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.mobile-divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0.5rem 0;
}

.mobile-dropdown-item {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.8rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.mobile-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #facc15;
}

.mobile-dropdown-item.logout {
  color: #ff6b6b;
}

.mobile-dropdown-item.logout:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
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
  .user-name {
    max-width: 120px;
  }
  .user-dropdown {
    min-width: 220px;
  }
}

@keyframes orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    transform: translateX(-50%) rotate(0deg);
  }
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}
</style>

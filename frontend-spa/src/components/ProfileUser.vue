<template>
  <!-- Template remains unchanged -->
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-banner">
        <div class="banner-content">
          <div class="user-avatar-large">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info-header">
            <h1 class="user-name">{{ displayUserName }}</h1>
            <p class="user-email">{{ userEmail }}</p>
            <div class="user-badges">
              <span class="badge level-badge">
                <i class="fas fa-star"></i> Cấp {{ userLevel }}
              </span>
              <span class="badge grade-badge">
                <i class="fas fa-graduation-cap"></i> {{ displayUserLevel }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-info">
            <h3>{{ userExperience }}</h3>
            <p>Điểm kinh nghiệm</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="stat-info">
            <h3>{{ userTotalScore }}</h3>
            <p>Tổng điểm</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-gamepad"></i>
          </div>
          <div class="stat-info">
            <h3>{{ userGameProfile.total_games || 0 }}</h3>
            <p>Tổng số trò chơi</p>
          </div>
        </div>
      </div>

      <div class="profile-sections">
        <div class="section-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'info' }"
            @click="setActiveTab('info')"
          >
            <i class="fas fa-info-circle"></i> Thông tin
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'achievements' }"
            @click="setActiveTab('achievements')"
          >
            <i class="fas fa-medal"></i> Thành tích
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'progress' }"
            @click="setActiveTab('progress')"
          >
            <i class="fas fa-chart-bar"></i> Tiến độ
          </button>
        </div>

        <div class="tab-content">
          <!-- Thông tin cá nhân -->
          <div v-if="activeTab === 'info'" class="tab-panel">
            <div class="info-card">
              <h3><i class="fas fa-user"></i> Thông tin cá nhân</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Tên người dùng:</label>
                  <span>{{ displayUserName }}</span>
                </div>
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ userEmail || "Chưa cập nhật" }}</span>
                </div>
                <div class="info-item">
                  <label>Cấp học:</label>
                  <span>{{ displayUserLevel }}</span>
                </div>
                <div class="info-item">
                  <label>ID người dùng:</label>
                  <span>{{ userId || "N/A" }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiến độ học tập -->
          <div v-if="activeTab === 'progress'" class="tab-panel">
            <div class="progress-card">
              <h3><i class="fas fa-chart-bar"></i> Tiến độ học tập</h3>
              <div class="progress-info">
                <div class="level-progress">
                  <div class="level-info">
                    <span>Cấp {{ userLevel }}</span>
                    <span>{{ userExperience }} XP</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: calculateProgressPercentage() + '%' }"
                    ></div>
                  </div>
                  <div class="next-level-info">
                    <span
                      >{{ getNextLevelXP() - userExperience }} XP để lên cấp
                      {{ userLevel + 1 }}</span
                    >
                  </div>
                </div>

                <div class="performance-stats">
                  <div class="performance-item">
                    <i class="fas fa-bullseye"></i>
                    <div>
                      <span class="performance-value">{{
                        calculateAverageScore()
                      }}</span>
                      <span class="performance-label">Điểm trung bình</span>
                    </div>
                  </div>
                  <div class="performance-item">
                    <i class="fas fa-fire"></i>
                    <div>
                      <span class="performance-value">{{
                        calculatePlayFrequency()
                      }}</span>
                      <span class="performance-label">Tần suất chơi</span>
                    </div>
                  </div>
                  <div class="performance-item">
                    <i class="fas fa-star"></i>
                    <div>
                      <span class="performance-value">{{
                        userGameProfile.total_games || 0
                      }}</span>
                      <span class="performance-label">Tổng số trò chơi</span>
                    </div>
                  </div>
                </div>

                <div class="difficulty-stats">
                  <h4>Thống kê theo độ khó</h4>
                  <div class="difficulty-grid">
                    <div
                      v-for="(stat, difficulty) in difficultyStats"
                      :key="difficulty"
                      class="difficulty-item"
                    >
                      <div class="difficulty-icon">
                        <i :class="getDifficultyIcon(difficulty)"></i>
                      </div>
                      <div class="difficulty-info">
                        <h5>{{ formatDifficulty(difficulty) }}</h5>
                        <p>Số trò chơi: {{ stat.count }}</p>
                        <p>Điểm trung bình: {{ stat.avgScore.toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="session-history">
                  <h4>Lịch sử phiên chơi</h4>
                  <div
                    v-for="session in userGameProfile.sessions"
                    :key="session.session_id"
                    class="session-item"
                  >
                    <div class="session-icon">
                      <i class="fas fa-gamepad"></i>
                    </div>
                    <div class="session-info">
                      <p><strong>Trò chơi:</strong> {{ session.game_id }}</p>
                      <p><strong>Điểm:</strong> {{ session.score }}</p>
                      <p>
                        <strong>Độ khó:</strong>
                        {{ formatDifficulty(session.difficulty) }}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>
                        {{ formatStatus(session.status) }}
                      </p>
                      <p>
                        <strong>Bắt đầu:</strong>
                        {{ formatDate(session.started_at) }}
                      </p>
                      <p v-if="session.completed_at">
                        <strong>Kết thúc:</strong>
                        {{ formatDate(session.completed_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thành tích -->
          <div v-if="activeTab === 'achievements'" class="tab-panel">
            <div class="achievements-card">
              <h3><i class="fas fa-medal"></i> Thành tích</h3>
              <div class="achievements-grid">
                <div
                  v-for="achievement in userAchievements"
                  :key="achievement.id"
                  class="achievement-item"
                  :class="{ unlocked: achievement.unlocked }"
                >
                  <div class="achievement-icon">
                    <i :class="achievement.icon"></i>
                  </div>
                  <div class="achievement-info">
                    <h4>{{ achievement.title }}</h4>
                    <p>{{ achievement.description }}</p>
                  </div>
                  <div class="achievement-status">
                    <i
                      v-if="achievement.unlocked"
                      class="fas fa-check-circle"
                    ></i>
                    <i v-else class="fas fa-lock"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải thông tin...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="retryFetch" class="retry-button">Thử lại</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileUser",
  data() {
    return {
      activeTab: "info",
      loading: true,
      error: null,
      userId: null,
      username: "",
      userEmail: "",
      userGradeLevel: "",
      userLevel: 1,
      userExperience: 0,
      userTotalScore: 0,
      userData: null,
      userCreatedAt: null,
      userGameProfile: {
        total_games: 0,
        total_score: 0,
        average_score: 0,
        sessions: [],
      },
      userAchievements: [
        {
          id: 1,
          title: "Người mới bắt đầu",
          description: "Chơi trò chơi đầu tiên",
          icon: "fas fa-play-circle",
          unlocked: false,
        },
        {
          id: 2,
          title: "Thách thức",
          description: "Chơi 10 trò chơi",
          icon: "fas fa-gamepad",
          unlocked: false,
        },
        {
          id: 3,
          title: "Cao thủ",
          description: "Đạt cấp 5",
          icon: "fas fa-crown",
          unlocked: false,
        },
        {
          id: 4,
          title: "Điểm cao",
          description: "Đạt 1000 điểm tổng",
          icon: "fas fa-trophy",
          unlocked: false,
        },
      ],
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
    difficultyStats() {
      const stats = {};
      if (Array.isArray(this.userGameProfile.sessions)) {
        this.userGameProfile.sessions.forEach((session) => {
          const difficulty = session.difficulty || "unknown";
          if (!stats[difficulty]) {
            stats[difficulty] = { count: 0, totalScore: 0 };
          }
          stats[difficulty].count += 1;
          stats[difficulty].totalScore += session.score || 0;
        });
        Object.keys(stats).forEach((difficulty) => {
          stats[difficulty].avgScore =
            stats[difficulty].totalScore / stats[difficulty].count;
        });
      } else {
        console.warn(
          "userGameProfile.sessions is not an array:",
          this.userGameProfile.sessions
        );
      }
      return stats;
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
            console.error("Không thể parse userData từ localStorage:", e);
          }
        }
        await this.fetchUserData(userId, token);
      } else {
        this.error = "Không tìm thấy thông tin đăng nhập";
        this.loading = false;
      }
    },

    async fetchUserData(userId, token) {
      try {
        this.loading = true;
        this.error = null;

        // Fetch user data
        const userResponse = await axios.get(
          `https://ct313hm01-project-gphuc04.onrender.com/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = userResponse.data.result;
        if (user) {
          this.loadUserDataFromResponse(user);
          localStorage.setItem("userData", JSON.stringify(user));
        }

        // Fetch game session profile
        const gameProfileResponse = await axios.get(
          `https://ct313hm01-project-gphuc04.onrender.com/game-sessions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Game profile response:", gameProfileResponse.data);

        // Ensure sessions is an array
        const sessions = Array.isArray(gameProfileResponse.data.sessions)
          ? gameProfileResponse.data.sessions
          : [];

        this.userGameProfile = {
          total_games: gameProfileResponse.data.total_games || 0,
          total_score: gameProfileResponse.data.total_score || 0,
          average_score: gameProfileResponse.data.average_score || 0,
          sessions,
        };

        this.updateAchievements();
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
        this.error =
          "Không thể tải thông tin người dùng hoặc hồ sơ trò chơi. Vui lòng thử lại.";
        // Ensure sessions is an empty array on error
        this.userGameProfile.sessions = [];
      } finally {
        this.loading = false;
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

    formatDifficulty(difficulty) {
      const difficultyMap = {
        easy: "Dễ",
        medium: "Trung bình",
        hard: "Khó",
        expert: "Chuyên gia",
      };
      return difficultyMap[difficulty] || difficulty;
    },

    formatStatus(status) {
      const statusMap = {
        playing: "Đang chơi",
        completed: "Hoàn thành",
        abandoned: "Đã bỏ",
      };
      return statusMap[status] || status;
    },

    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },

    getDifficultyIcon(difficulty) {
      const iconMap = {
        easy: "fas fa-star",
        medium: "fas fa-star-half-alt",
        hard: "fas fa-star",
        expert: "fas fa-crown",
      };
      return iconMap[difficulty] || "fas fa-question";
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    calculateProgressPercentage() {
      const currentLevelXP = this.getCurrentLevelXP();
      const nextLevelXP = this.getNextLevelXP();
      const progressInLevel = this.userExperience - currentLevelXP;
      const totalXPForLevel = nextLevelXP - currentLevelXP;
      return Math.min(100, (progressInLevel / totalXPForLevel) * 100);
    },

    getCurrentLevelXP() {
      return (this.userLevel - 1) * 100;
    },

    getNextLevelXP() {
      return this.userLevel * 100;
    },

    calculateAverageScore() {
      return this.userGameProfile.average_score
        ? this.userGameProfile.average_score.toFixed(2)
        : "0.00";
    },

    calculatePlayFrequency() {
      const totalGames = this.userGameProfile.total_games || 0;
      if (totalGames < 5) return "Mới bắt đầu";
      if (totalGames < 20) return "Thường xuyên";
      return "Rất tích cực";
    },

    updateAchievements() {
      this.userAchievements.forEach((achievement) => {
        switch (achievement.id) {
          case 1: // Người mới bắt đầu
            achievement.unlocked = this.userGameProfile.total_games > 0;
            break;
          case 2: // Thách thức
            achievement.unlocked = this.userGameProfile.total_games >= 10;
            break;
          case 3: // Cao thủ
            achievement.unlocked = this.userLevel >= 5;
            break;
          case 4: // Điểm cao
            achievement.unlocked = this.userGameProfile.total_score >= 1000;
            break;
        }
      });
    },

    retryFetch() {
      this.checkAuthStatus();
    },
  },

  mounted() {
    this.checkAuthStatus();
  },
};
</script>

<style scoped>
/* Style remains unchanged */
.profile-container {
  min-height: 100vh;
  background: transparent;
  padding-top: 20px;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-banner {
  background: linear-gradient(
    135deg,
    rgba(30, 27, 75, 0.9),
    rgba(76, 29, 149, 0.9)
  );
  backdrop-filter: blur(10px);
  color: white;
  padding: 3rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.profile-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 30% 20%,
      rgba(168, 85, 247, 0.4) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 80%,
      rgba(59, 130, 246, 0.3) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e3a8a;
  font-size: 3rem;
  box-shadow: 0 8px 32px rgba(250, 204, 21, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.2);
}

.user-info-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.user-email {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 1rem 0;
}

.user-badges {
  display: flex;
  gap: 1rem;
}

.badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.level-badge {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.grade-badge {
  background: rgba(34, 211, 238, 0.2);
  color: #22d3ee;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #7c3aed, #4c1d95);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 0.5rem 0;
}

.stat-info p {
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.profile-sections {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-tabs {
  display: flex;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

.tab-button {
  flex: 1;
  padding: 1.2rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-button:hover {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.9);
  color: #7c3aed;
  border-bottom: 3px solid #7c3aed;
  box-shadow: 0 -2px 10px rgba(124, 58, 237, 0.2);
}

.tab-content {
  padding: 2rem;
}

.info-card,
.progress-card,
.achievements-card {
  background: transparent;
}

.info-card h3,
.progress-card h3,
.achievements-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4c1d95;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-item label {
  font-weight: 600;
  color: #7c3aed;
}

.info-item span {
  color: #4c1d95;
  font-weight: 500;
}

.level-progress {
  margin-bottom: 2rem;
}

.level-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4c1d95;
}

.progress-bar {
  height: 12px;
  background: rgba(226, 232, 240, 0.6);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #a855f7, #facc15);
  transition: width 0.3s ease;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
}

.next-level-info {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
}

.performance-item i {
  font-size: 2rem;
  color: #4c307d;
}

.performance-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
}

.performance-label {
  display: block;
  color: #64748b;
  font-size: 0.9rem;
}

.difficulty-stats h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4c1d95;
  margin: 0 0 1rem 0;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.difficulty-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid #7c3aed;
}

.difficulty-icon {
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #64748b;
}

.difficulty-info h5 {
  margin: 0 0 0.5rem 0;
  color: #1e3a8a;
  font-size: 1.1rem;
}

.difficulty-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.session-history h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4c1d95;
  margin: 2rem 0 1rem 0;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid #22d3ee;
}

.session-icon {
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #64748b;
}

.session-info p {
  margin: 0.3rem 0;
  color: #4c1d95;
}

.session-info p strong {
  color: #7c3aed;
}

.achievements-grid {
  display: grid;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-left: 4px solid #facc15;
}

.achievement-icon {
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #64748b;
}

.achievement-item.unlocked .achievement-icon {
  background: #facc15;
  color: #1e3a8a;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 0.5rem 0;
  color: #1e3a8a;
  font-size: 1.1rem;
}

.achievement-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.achievement-status {
  font-size: 1.5rem;
}

.achievement-item.unlocked .achievement-status {
  color: #22c55e;
}

.achievement-item:not(.unlocked) .achievement-status {
  color: #94a3b8;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
  color: #4c307d;
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  text-align: center;
  padding: 3rem;
  color: #dc3545;
}

.error-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  background: #4c307d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
}

.retry-button:hover {
  background: #030508;
}

@media (max-width: 768px) {
  .profile-container {
    padding-top: 70px;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .user-avatar-large {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .user-info-header h1 {
    font-size: 2rem;
  }

  .user-badges {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-tabs {
    flex-direction: column;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .performance-stats {
    grid-template-columns: 1fr;
  }

  .difficulty-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-content {
    padding: 0 1rem;
  }

  .profile-banner {
    padding: 2rem 1rem 1.5rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .tab-content {
    padding: 1rem;
  }
}
</style>

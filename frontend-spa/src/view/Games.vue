<template>
  <div class="games-page">
    <NavbarUser />

    <!-- YouTube Audio Player (không có visualizer) -->
    <div class="youtube-audio-player">
      <div
        data-video="-YqXGNHQPxc"
        data-autoplay="1"
        data-loop="1"
        id="youtube-audio"
      ></div>
    </div>

    <!-- Floating Chemical Formulas -->
    <div class="chemical-formulas">
      <span class="formula" v-for="n in 10" :key="n">{{
        getRandomFormula()
      }}</span>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1 class="main-title">
          <i class="fas fa-gamepad"></i>
          Danh Sách Trò Chơi
        </h1>
        <p class="subtitle">Khám phá thế giới trò chơi giáo dục thú vị</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <i class="fas fa-layer-group stat-icon"></i>
          <span class="stat-number">{{ games.length }}</span>
          <span class="stat-label">Trò chơi</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-play-circle stat-icon"></i>
          <span class="stat-number">{{ activeGamesCount }}</span>
          <span class="stat-label">Đang hoạt động</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p class="loading-text">Đang tải danh sách trò chơi...</p>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <button @click="loadGames" class="retry-button">
        <i class="fas fa-redo-alt"></i>
        Thử lại
      </button>
    </div>

    <!-- Games Grid -->
    <div v-else-if="games.length > 0" class="games-grid">
      <div
        v-for="game in games"
        :key="game.game_id"
        class="game-card"
        :class="{ 'inactive-game': !game.is_active }"
      >
        <!-- Game Card Header -->
        <div class="game-card-header">
          <div class="game-icon-wrapper">
            <div class="game-icon">
              <i :class="getGameIcon(game.category)"></i>
            </div>
            <div class="game-type-badge">
              {{ formatCategory(game.category) }}
            </div>
          </div>
          <div class="game-status-wrapper">
            <div class="status-indicator" :class="{ active: game.is_active }">
              <div class="status-dot"></div>
            </div>
            <span class="status-text">
              {{ game.is_active ? "Hoạt động" : "Tạm dừng" }}
            </span>
          </div>
        </div>

        <!-- Game Content -->
        <div class="game-content">
          <div class="game-title-section">
            <h3 class="game-title">
              <span class="tooltip-wrapper">
                {{ truncateTitle(game.name_vi) }}
                <span class="tooltip-text">{{ game.name_vi }}</span>
              </span>
            </h3>
            <p class="game-title-en">{{ game.name_en }}</p>
          </div>

          <p class="game-description">
            <span class="tooltip-wrapper">
              {{ truncateDescription(game.description_vi) }}
              <span class="tooltip-text">{{ game.description_vi }}</span>
            </span>
          </p>

          <!-- Game Statistics -->
          <div class="game-stats">
            <div class="stat-box">
              <div class="stat-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Điểm tối đa</span>
                <span class="stat-value">{{
                  game.max_score.toLocaleString()
                }}</span>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Thời gian</span>
                <span class="stat-value">{{
                  formatTime(game.time_limit)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Game Settings -->
          <div v-if="game.game_settings" class="game-settings">
            <div class="settings-header">
              <i class="fas fa-cogs"></i>
              <span>Cài đặt</span>
            </div>
            <div class="settings-list">
              <div
                v-for="(value, key) in parseGameSettings(game.game_settings)"
                :key="key"
                class="setting-item"
              >
                <span class="setting-name">{{ formatSettingKey(key) }}</span>
                <span class="setting-value">{{
                  formatSettingValue(value)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Game Footer -->
        <div class="game-footer">
          <div class="game-meta">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ formatDate(game.created_at) }}</span>
          </div>
          <button
            class="play-button"
            :class="{ disabled: !game.is_active }"
            :disabled="!game.is_active"
            @click="playGame(game)"
          >
            <i class="fas fa-play"></i>
            <span>{{ game.is_active ? "Chơi ngay" : "Không khả dụng" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- No games -->
    <div v-else class="no-games">
      <div class="no-games-icon">
        <i class="fas fa-dice"></i>
      </div>
      <p class="no-games-message">Không có trò chơi nào được tìm thấy.</p>
      <button @click="loadGames" class="reload-button">
        <i class="fas fa-sync-alt"></i>
        Tải lại
      </button>
    </div>
  </div>
</template>

<script>
import NavbarUser from "@/components/NavbarUser.vue";
import { useGames } from "@/composables/useGames";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

export default {
  name: "AppGames",
  components: {
    NavbarUser,
  },
  setup() {
    const { games, loading, errorMessage, activeGamesCount, loadGames } =
      useGames();
    const router = useRouter();
    const isPlayerReady = ref(false);
    let player = null;

    // Load YouTube API
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializeYouTubePlayer();
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = () => {
        console.error("Failed to load YouTube API");
        alert(
          "Không thể tải API YouTube. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau."
        );
      };
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
    };

    // Initialize YouTube Player
    const initializeYouTubePlayer = () => {
      if (!window.YT || !window.YT.Player) {
        console.warn("YouTube API not loaded, retrying...");
        setTimeout(initializeYouTubePlayer, 500);
        return;
      }
      try {
        player = new window.YT.Player("youtube-audio", {
          height: "1",
          width: "1",
          videoId: "-YqXGNHQPxc",
          playerVars: {
            autoplay: 1, // Tự động phát khi vào trang
            loop: 1,
            playlist: "-YqXGNHQPxc",
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(30); // Giảm âm lượng
              isPlayerReady.value = true;
              console.log("YouTube Player is ready");
            },
            onError: (event) => {
              console.error("YouTube Player Error:", event.data);
              let errorMsg = "Lỗi khi tải video YouTube. ";
              switch (event.data) {
                case 2:
                  errorMsg += "Video ID không hợp lệ.";
                  break;
                case 5:
                  errorMsg += "Lỗi trình phát HTML5.";
                  break;
                case 100:
                  errorMsg += "Video không tìm thấy.";
                  break;
                case 101:
                case 150:
                  errorMsg += "Video không cho phép nhúng.";
                  break;
                default:
                  errorMsg += "Mã lỗi: " + event.data;
              }
              alert(errorMsg + " Vui lòng chọn video khác.");
              isPlayerReady.value = false;
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                player.playVideo(); // Lặp lại video
              }
            },
          },
        });
      } catch (error) {
        console.error("Error initializing YouTube Player:", error);
        alert("Không thể khởi tạo trình phát nhạc. Vui lòng thử lại sau.");
        isPlayerReady.value = false;
      }
    };

    onMounted(() => {
      loadYouTubeAPI();
    });

    const getRandomFormula = () => {
      const formulas = [
        "H₂O",
        "CO₂",
        "NaCl",
        "CH₄",
        "O₂",
        "NH₃",
        "HCl",
        "C₆H₁₂O₆",
        "SO₂",
        "N₂",
        "H₂SO₄",
        "NaOH",
        "KNO₃",
        "CaCO₃",
        "Fe₂O₃",
        "C₂H₅OH",
        "HNO₃",
        "Ca(OH)₂",
        "MgSO₄",
        "CH₃COOH",
        "CuSO₄",
        "KOH",
        "BaCl₂",
        "NaHCO₃",
        "H₂",
        "Cl₂",
        "NO₂",
        "O₃",
        "H₂O₂",
      ];
      return formulas[Math.floor(Math.random() * formulas.length)];
    };

    const getGameIcon = (category) => {
      const iconMap = {
        lab_simulation: "fas fa-flask",
        reaction_game: "fas fa-bolt",
        quiz: "fas fa-question-circle",
        puzzle: "fas fa-puzzle-piece",
        puzzle_knowledge: "fas fa-crossword",
        default: "fas fa-gamepad",
      };
      return iconMap[category] || iconMap.default;
    };

    const formatCategory = (category) => {
      const map = {
        lab_simulation: "Mô phỏng thí nghiệm",
        reaction_game: "Trò chơi phản xạ",
        quiz: "Câu đố",
        puzzle: "Trò chơi ghép hình",
        puzzle_knowledge: "Ô chữ kiến thức",
      };
      return map[category] || category;
    };

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remaining = seconds % 60;
      return `${minutes}:${remaining.toString().padStart(2, "0")}`;
    };

    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("vi-VN");

    const parseGameSettings = (str) => {
      try {
        return JSON.parse(str);
      } catch {
        return {};
      }
    };

    const formatSettingKey = (key) => {
      const map = {
        question_count: "Số câu hỏi",
        hints_allowed: "Cho phép gợi ý",
        difficulty: "Độ khó",
        time_bonus: "Thưởng thời gian",
      };
      return map[key] || key;
    };

    const formatSettingValue = (val) =>
      typeof val === "boolean" ? (val ? "Có" : "Không") : val;

    const truncateTitle = (title) => {
      const maxLength = 20;
      if (title.length > maxLength) {
        return title.substring(0, maxLength - 3) + "...";
      }
      return title;
    };

    const truncateDescription = (description) => {
      const maxLength = 50;
      if (description.length > maxLength) {
        return description.substring(0, maxLength - 3) + "...";
      }
      return description;
    };

    const playGame = (game) => {
      if (game.is_active) {
        router.push({ name: game.game_code });
      }
    };

    loadGames();

    return {
      games,
      loading,
      errorMessage,
      activeGamesCount,
      loadGames,
      getRandomFormula,
      getGameIcon,
      formatCategory,
      formatTime,
      formatDate,
      parseGameSettings,
      formatSettingKey,
      formatSettingValue,
      truncateTitle,
      truncateDescription,
      playGame,
      isPlayerReady,
    };
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

.games-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2a2a72 0%, #4c2889 100%);
  padding: 30px;
  margin: 0;
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow-x: hidden;
  margin-left: -1%;
}

/* YouTube Audio Player (không có visualizer) */
.youtube-audio-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

/* Chemical Formulas */
.chemical-formulas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.formula {
  position: absolute;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  animation: float 8s linear infinite;
}

.formula:nth-child(1) {
  left: 10%;
  animation-duration: 10s;
  animation-delay: 0s;
}
.formula:nth-child(2) {
  left: 20%;
  animation-duration: 12s;
  animation-delay: 1s;
}
.formula:nth-child(3) {
  left: 30%;
  animation-duration: 9s;
  animation-delay: 2s;
}
.formula:nth-child(4) {
  left: 40%;
  animation-duration: 11s;
  animation-delay: 3s;
}
.formula:nth-child(5) {
  left: 50%;
  animation-duration: 10s;
  animation-delay: 4s;
}
.formula:nth-child(6) {
  left: 60%;
  animation-duration: 13s;
  animation-delay: 5s;
}
.formula:nth-child(7) {
  left: 70%;
  animation-duration: 8s;
  animation-delay: 6s;
}
.formula:nth-child(8) {
  left: 80%;
  animation-duration: 11s;
  animation-delay: 7s;
}
.formula:nth-child(9) {
  left: 90%;
  animation-duration: 9s;
  animation-delay: 8s;
}
.formula:nth-child(10) {
  left: 95%;
  animation-duration: 12s;
  animation-delay: 9s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
    transform: translateY(80vh) scale(1.2);
  }
  80% {
    opacity: 0.7;
    transform: translateY(20vh) scale(0.8);
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

.header {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30%;
  padding: 50px 30px;
  margin-bottom: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.header:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.header:hover:before {
  left: 100%;
}

.header-content {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 3.5rem;
  color: #e5e7eb;
  margin-bottom: 15px;
  font-weight: 800;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 15px;
}

.main-title i {
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.2);
}

.stat-icon {
  font-size: 2rem;
  color: #6b21a8;
  text-shadow: 0 0 5px rgba(107, 33, 168, 0.3);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  margin: 0 auto;
  max-width: 600px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.loading-spinner i {
  font-size: 4rem;
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 1.5rem;
  margin-top: 20px;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  animation: fadePulse 2s ease-in-out infinite;
}

.error-container {
  text-align: center;
  padding: 80px 20px;
  color: #e5e7eb;
  background: rgba(220, 38, 38, 0.15);
  border-radius: 20px;
  margin: 0 auto;
  max-width: 600px;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.2);
  animation: shake 0.5s ease-in-out;
  position: relative;
  z-index: 2;
}

.error-icon i {
  font-size: 4rem;
  color: #dc2626;
  text-shadow: 0 0 5px rgba(220, 38, 38, 0.3);
}

.error-message {
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.retry-button {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
}

.retry-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
  background: linear-gradient(135deg, #b91c1c, #dc2626);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.game-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95),
    rgba(240, 240, 240, 0.9)
  );
  border-radius: 25px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.game-card:hover {
  transform: translateY(-8px) rotateX(3deg) rotateY(3deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.game-card:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.game-card:hover:before {
  left: 100%;
}

.inactive-game {
  opacity: 0.7;
  background: linear-gradient(
    145deg,
    rgba(200, 200, 200, 0.8),
    rgba(180, 180, 180, 0.7)
  );
}

.game-card-header {
  background: linear-gradient(135deg, #ca4d45, #2c3ad8);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.game-card-header:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  pointer-events: none;
}

.game-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.game-icon {
  width: 70px;
  height: 70px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #e5e7eb;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(75, 108, 183, 0.2);
}

.game-type-badge {
  background: linear-gradient(135deg, #5acd61, #79da41);
  color: #e5e7eb;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 5px rgba(107, 33, 168, 0.2);
}

.game-status-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e5e7eb;
}

.status-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #dc2626;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator.active {
  background: #16a34a;
}

.status-indicator.active:before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #16a34a;
  animation: pulse 2s infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

.status-text {
  font-size: 1rem;
  font-weight: 700;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.game-content {
  padding: 24px;
}

.game-title-section {
  margin-bottom: 20px;
}

.game-title {
  font-size: 2rem;
  color: #1e1b4b;
  margin-bottom: 8px;
  font-weight: 800;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.game-title-en {
  font-size: 1.1rem;
  color: #6b7280;
  font-style: italic;
  margin: 0;
}

.game-description {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 24px;
  font-size: 1rem;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 217, 61, 0.9),
    rgba(255, 170, 0, 0.9)
  );
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 217, 61, 0.5);
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(255, 217, 61, 0.9) transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

.game-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(75, 108, 183, 0.2);
}

.stat-box .stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #fff;
}

.stat-box:nth-child(1) .stat-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.stat-box:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #4b6cb7, #182848);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.9rem;
  color: #32a375;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2f73f9;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.game-settings {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: #e5e7eb;
  font-weight: 700;
  font-size: 1.1rem;
}

.settings-header i {
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-name {
  font-weight: 600;
  color: #5c5f64;
}

.setting-value {
  color: #16a34a;
  font-weight: 600;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.game-footer {
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.game-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5e7eb;
  font-size: 1rem;
}

.game-meta i {
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.play-button {
  background: linear-gradient(135deg, #4b6cb7, #6b21a8);
  color: #fff;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(75, 108, 183, 0.2);
}

.play-button:hover:not(.disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.3);
  background: linear-gradient(135deg, #6b21a8, #4b6cb7);
}

.play-button.disabled {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
  box-shadow: none;
}

.no-games {
  text-align: center;
  padding: 100px 20px;
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.no-games-icon {
  font-size: 6rem;
  margin-bottom: 30px;
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.no-games-message {
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.reload-button {
  background: linear-gradient(135deg, #4b6cb7, #6b21a8);
  color: #fff;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 0 10px rgba(75, 108, 183, 0.2);
}

.reload-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.3);
  background: linear-gradient(135deg, #6b21a8, #4b6cb7);
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .header-stats {
    flex-direction: column;
    gap: 30px;
  }

  .game-card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .game-footer {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .game-stats {
    grid-template-columns: 1fr;
  }

  .formula {
    font-size: 1rem;
  }

  .youtube-audio-player {
    bottom: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .games-page {
    padding: 20px;
  }

  .header {
    padding: 30px;
  }

  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .game-icon {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }

  .game-title {
    font-size: 1.6rem;
  }

  .stat-box .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .formula {
    font-size: 0.9rem;
  }

  .youtube-audio-player {
    bottom: 5px;
    right: 5px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadePulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-3px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(3px);
  }
}
</style>

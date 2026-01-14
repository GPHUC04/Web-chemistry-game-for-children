<template>
  <div class="leaderboard-wrapper">
    <NavbarUser />

    <!-- Background Animation -->
    <div class="chemical-formulas">
      <span class="formula" v-for="n in 10" :key="n">{{
        getRandomFormula()
      }}</span>
    </div>

    <div class="leaderboard-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="leaderboard-title">
          <h1>Bảng Xếp Hạng Người Chơi Xuất Sắc</h1>
          <p class="subtitle">Xem ai là thần đồng hóa học đây!</p>
        </div>

        <!-- Search and Filter Bar -->
        <div class="search-bar">
          <input
            v-model="searchQuery"
            class="search-input"
            placeholder="Tìm kiếm người chơi (ID hoặc tên)"
            @input="filterSessions"
            aria-label="Tìm kiếm người chơi"
          />
          <select
            v-model="selectedGame"
            class="game-filter"
            @change="filterSessions"
            aria-label="Lọc theo trò chơi"
          >
            <option value="">Tất cả trò chơi</option>
            <option
              v-for="game in games"
              :key="game.game_id"
              :value="game.game_id"
            >
              {{ game.game_name || "Thám Tử Công Thức" }}
            </option>
          </select>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="resetError" class="retry-button">
          <i class="fas fa-redo-alt"></i>
          Thử lại
        </button>
      </div>

      <!-- Top Players Section -->
      <div class="top-players" v-if="topPlayers.length">
        <h2><i class="fas fa-trophy"></i> Vinh Danh Người Chơi Xuất Sắc</h2>
        <div class="top-player-list">
          <div
            v-for="player in topPlayers"
            :key="player.game_id + '-' + player.user_id"
            class="top-player-card"
          >
            <div class="trophy">🏆</div>
            <p>
              <strong>Trò chơi:</strong>
              {{ player.game_name || "Thám Tử Công Thức" }}
            </p>
            <p
              class="username"
              :title="player.username || `Người chơi ${player.user_id}`"
            >
              <strong>Người chơi:</strong>
              {{
                truncateUsername(
                  player.username || `Người chơi ${player.user_id}`
                )
              }}
            </p>
            <p class="top-score">
              <strong>Điểm cao nhất:</strong> {{ player.top_score }}
            </p>
          </div>
        </div>
      </div>

      <!-- Leaderboard Table -->
      <div class="leaderboard-table" v-if="filteredSessions.length">
        <table>
          <thead>
            <tr>
              <th>Xếp hạng</th>
              <th class="username-column">Người chơi</th>
              <th>Trò chơi</th>
              <th>Điểm số</th>
              <th>Thời gian chơi</th>
              <th>Ngày chơi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(session, index) in paginatedSessions"
              :key="session.session_id"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td
                class="username-column"
                :title="session.username || `Người chơi ${session.user_id}`"
              >
                {{
                  truncateUsername(
                    session.username || `Người chơi ${session.user_id}`
                  )
                }}
              </td>
              <td>{{ session.game_name || "Thám Tử Công Thức" }}</td>
              <td>{{ session.score }}</td>
              <td>{{ formatTime(session.time_spent) }}</td>
              <td>{{ formatDate(session.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">Không tìm thấy phiên chơi nào.</div>

      <!-- Pagination -->
      <div class="pagination" v-if="filteredSessions.length > itemsPerPage">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="currentPage--"
          aria-label="Trang trước"
        >
          Trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          aria-label="Trang sau"
        >
          Sau
        </button>
      </div>

      <!-- Navigation -->
      <div class="navigation-controls">
        <button
          class="nav-button back-button"
          @click="goBack"
          aria-label="Quay lại"
        >
          <i class="fas fa-arrow-left"></i>
          <span>Quay Lại</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useLeaderboard } from "@/composables/useLeaderboard";
import NavbarUser from "@/components/NavbarUser.vue";

export default {
  name: "AppLeaderboard",
  components: {
    NavbarUser,
  },
  setup() {
    const {
      sessions,
      filteredSessions,
      topPlayers,
      searchQuery,
      selectedGame,
      games,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedSessions,
      errorMessage,
      userId,
      getRandomFormula,
      formatTime,
      formatDate,
      goBack,
      filterSessions,
      truncateUsername,
      resetError,
      loadData,
    } = useLeaderboard();

    return {
      sessions,
      filteredSessions,
      topPlayers,
      searchQuery,
      selectedGame,
      games,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedSessions,
      errorMessage,
      userId,
      getRandomFormula,
      formatTime,
      formatDate,
      goBack,
      filterSessions,
      truncateUsername,
      resetError,
      loadData,
    };
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap");

.leaderboard-wrapper {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #2a2a72 0%, #4c2889 100%);
  font-family: "Poppins", sans-serif;
}

.chemical-formulas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
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
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.leaderboard-container {
  min-height: 100vh;
  padding: 30px;
  color: #e5e7eb;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.leaderboard-title h1 {
  font-family: "Orbitron", monospace;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #ffd93d,
    #6bcf7f,
    #4ecdc4,
    #45b7d1
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbow 3s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

@keyframes rainbow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.subtitle {
  font-size: 1.2rem;
  margin-top: 10px;
  opacity: 0.9;
  font-weight: 300;
}

.search-bar {
  margin: 20px 0;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.search-input,
.game-filter {
  padding: 15px;
  width: 100%;
  max-width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #1e1b4b;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.search-input:focus,
.game-filter:focus {
  outline: none;
  border-color: #4b6cb7;
  background: white;
  box-shadow: 0 0 0 4px rgba(75, 108, 183, 0.2);
}

.search-input::placeholder {
  color: #6b7280;
}

.error-container {
  text-align: center;
  padding: 20px;
  background: rgba(220, 38, 38, 0.15);
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
  animation: shake 0.5s ease-in-out;
}

.error-icon i {
  font-size: 2rem;
  color: #dc2626;
  text-shadow: 0 0 5px rgba(220, 38, 38, 0.3);
}

.error-message {
  font-size: 1rem;
  color: #dc2626;
  margin: 10px 0;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.retry-button {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
}

.retry-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
}

.top-players {
  margin-bottom: 30px;
  text-align: center;
}

.top-players h2 {
  font-family: "Orbitron", monospace;
  font-size: 2rem;
  font-weight: 700;
  color: #1e1b4b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.top-player-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
}

.top-player-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  text-align: left;
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.top-player-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.3);
}

.trophy {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ffd93d;
}

.top-player-card p {
  font-size: 1rem;
  color: #1e1b4b;
  margin: 5px 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4b6cb7;
  background: rgba(75, 108, 183, 0.1);
  padding: 5px 10px;
  border-radius: 10px;
}

.leaderboard-table {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
  font-size: 1rem;
}

th {
  font-family: "Orbitron", monospace;
  font-weight: 700;
  color: #1e1b4b;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

td {
  color: #1e1b4b;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.username-column {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

tr:hover {
  background: rgba(75, 108, 183, 0.05);
}

.no-data {
  text-align: center;
  font-size: 1.2rem;
  color: #1e1b4b;
  margin: 20px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-button {
  background: linear-gradient(135deg, #4b6cb7, #6b21a8);
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:disabled {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.3);
}

.navigation-controls {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 100;
}

.nav-button {
  background: linear-gradient(135deg, #4b6cb7, #6b21a8);
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(75, 108, 183, 0.3);
}

.back-button:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

@media (max-width: 768px) {
  .leaderboard-title h1 {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .leaderboard-table {
    padding: 15px;
  }
  table {
    font-size: 0.9rem;
  }
  th,
  td {
    padding: 10px;
  }
  .top-players h2 {
    font-size: 1.8rem;
  }
  .username-column {
    max-width: 120px;
  }
  .search-input,
  .game-filter {
    max-width: 100%;
  }
  .formula {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .leaderboard-container {
    padding: 15px;
  }
  .leaderboard-title h1 {
    font-size: 2rem;
  }
  .top-player-card {
    width: 100%;
  }
  .username-column {
    max-width: 100px;
  }
  .pagination {
    flex-direction: column;
  }
  .pagination-button {
    width: 100%;
    max-width: 200px;
  }
  .formula {
    font-size: 0.9rem;
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

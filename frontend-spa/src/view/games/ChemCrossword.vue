<template>
  <div class="game-wrapper">
    <NavbarUser />

    <!-- Background Animation -->
    <div class="background-animation">
      <div class="molecule" v-for="n in 10" :key="n"></div>
    </div>

    <!-- Music Control -->
    <div class="music-control" v-if="game && userId">
      <button @click="toggleMusic" :class="{ active: isMusicPlaying }">
        <i
          class="fas"
          :class="{
            'fa-volume-up': isMusicPlaying,
            'fa-volume-mute': !isMusicPlaying,
          }"
        ></i>
      </button>
    </div>

    <div class="game-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="game-title">
          <h1>Ô Chữ Hóa Học</h1>
          <p class="subtitle">Khám phá kiến thức hóa học qua trò chơi ô chữ!</p>
        </div>

        <!-- Status Bar -->
        <div v-if="game && userId" class="status-bar">
          <div class="status-card score-card">
            <div class="status-icon">🏆</div>
            <div class="status-content">
              <span class="status-label">Điểm số</span>
              <span class="status-value">{{ score }}</span>
            </div>
          </div>
          <div class="status-card time-card">
            <div class="status-icon">⏰</div>
            <div class="status-content">
              <span class="status-label">Thời gian</span>
              <span class="status-value">{{ formatTime(timeRemaining) }}</span>
            </div>
          </div>
          <div class="status-card level-card">
            <div class="status-icon">🔬</div>
            <div class="status-content">
              <span class="status-label">Cấp độ</span>
              <span class="status-value">{{
                puzzle?.difficulty_level || "Dễ"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage || gamesError" class="error-notification">
        <div class="error-content">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ errorMessage || gamesError }}</span>
        </div>
      </div>

      <!-- Main Game Area -->
      <div v-if="game && userId && puzzle" class="main-game-area">
        <!-- Crossword Grid -->
        <div class="crossword-section">
          <div class="crossword-header">
            <h2>🧩 Bảng Ô Chữ</h2>
            <p>{{ puzzle.title_vi }}</p>
          </div>
          <div class="grid-container">
            <div
              class="crossword-grid"
              :style="{ 'grid-template-columns': `repeat(${gridSize}, 40px)` }"
            >
              <div
                v-for="(cell, index) in grid"
                :key="index"
                class="grid-cell"
                :class="{
                  'black-cell': cell.isBlack,
                  'active-cell': cell.isActive,
                  'correct-cell': cell.isCorrect,
                }"
                @click="selectCell(index)"
              >
                <input
                  v-if="!cell.isBlack"
                  v-model="cell.value"
                  maxlength="1"
                  @input="handleInput(index, $event)"
                  @keydown="handleKeydown($event, index)"
                  :disabled="gameOver"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Clues Section -->
        <div class="clues-section">
          <div class="clues-header">
            <h3>📝 Gợi Ý</h3>
          </div>
          <div class="clues-content">
            <div class="clues-group">
              <h4>Ngang</h4>
              <div
                v-for="clue in clues.across"
                :key="`across-${clue.number}`"
                class="clue-item"
                :class="{
                  'active-clue':
                    activeClue === clue.number && clueDirection === 'across',
                }"
                @click="highlightClue(clue.number, 'across')"
              >
                {{ clue.number }}. {{ clue.clue_vi }}
              </div>
            </div>
            <div class="clues-group">
              <h4>Dọc</h4>
              <div
                v-for="clue in clues.down"
                :key="`down-${clue.number}`"
                class="clue-item"
                :class="{
                  'active-clue':
                    activeClue === clue.number && clueDirection === 'down',
                }"
                @click="highlightClue(clue.number, 'down')"
              >
                {{ clue.number }}. {{ clue.clue_vi }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Over Modal -->
      <div v-if="gameOver" class="game-over-modal">
        <div class="modal-content">
          <div class="game-over-header">
            <h2>🎉 Trò Chơi Kết Thúc!</h2>
            <div class="fireworks"></div>
          </div>
          <div class="final-stats">
            <div class="stat-item">
              <i class="fas fa-trophy"></i>
              <span>Điểm cuối: {{ score }}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-star"></i>
              <span>Cấp độ: {{ puzzle?.difficulty_level || "Dễ" }}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-clock"></i>
              <span
                >Thời gian:
                {{ formatTime(game?.time_limit - timeRemaining) }}</span
              >
            </div>
          </div>
          <div class="modal-actions">
            <button class="save-button" @click="saveSession">
              <i class="fas fa-save"></i>
              Lưu Kết Quả
            </button>
            <button class="play-again-button" @click="restartGame">
              <i class="fas fa-redo"></i>
              Chơi Lại
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation-controls">
        <button class="nav-button back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>Quay Lại</span>
        </button>
        <button class="nav-button help-button" @click="showHelp">
          <i class="fas fa-question-circle"></i>
          <span>Hướng Dẫn</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import NavbarUser from "@/components/NavbarUser.vue";
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useGames } from "@/composables/useGames";

export default {
  name: "ChemCrossword",
  components: {
    NavbarUser,
  },
  setup() {
    const router = useRouter();
    const { games, errorMessage: gamesError, loadGames } = useGames();
    const score = ref(0);
    const timeRemaining = ref(300);
    const gameOver = ref(false);
    const puzzle = ref(null);
    const grid = ref([]);
    const clues = ref({ across: [], down: [] });
    const activeCell = ref(null);
    const activeClue = ref(null);
    const clueDirection = ref("across");
    const errorMessage = ref(null);
    const game = ref(null);
    const userId = ref(null);
    const gridSize = ref(15); // Default grid size, will be updated based on data
    let timer = null;
    const isMusicPlaying = ref(true);
    const audio = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    ); // URL nhạc mẫu, thay bằng file của bạn

    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const userIdFromStorage = localStorage.getItem("userId");
      if (token && userIdFromStorage) {
        userId.value = parseInt(userIdFromStorage, 10);
      } else {
        errorMessage.value = "Vui lòng đăng nhập để chơi trò chơi.";
        router.push("/login");
      }
    };

    const initializeGame = async () => {
      try {
        await loadGames();
        const crosswordGame = games.value.find(
          (g) => g.game_code === "chem_crossword"
        );
        if (crosswordGame) {
          game.value = crosswordGame;
          timeRemaining.value = crosswordGame.time_limit || 300;
        } else {
          errorMessage.value =
            "Không tìm thấy thông tin trò chơi Ô Chữ Hóa Học.";
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo trò chơi:", error);
        errorMessage.value =
          "Không thể tải thông tin trò chơi. Vui lòng thử lại.";
      }
    };

    const loadPuzzle = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://ct313hm01-project-gphuc04.onrender.com/crossword-puzzles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Puzzle response:", response.data);
        const puzzles = Array.isArray(response.data.result || response.data)
          ? response.data.result || response.data
          : [];
        if (puzzles.length > 0) {
          puzzle.value = puzzles[0];
          console.log("Selected puzzle:", puzzle.value);
          initializeGrid();
          initializeClues();
        } else {
          errorMessage.value = "Không tìm thấy ô chữ nào.";
        }
      } catch (error) {
        console.error("Lỗi khi tải ô chữ:", error);
        errorMessage.value =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : "Không thể tải ô chữ. Vui lòng thử lại.";
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    const initializeGrid = () => {
      let gridData, solution;
      try {
        gridData = puzzle.value.grid_data?.cells || [];
        solution = puzzle.value.solution?.cells || [];
        gridSize.value =
          gridData.length > 0 ? gridData.length : puzzle.value.grid_size || 15;
      } catch (error) {
        console.error("Error parsing grid_data or solution:", error);
        errorMessage.value = "Dữ liệu ô chữ không hợp lệ.";
        gridData = [];
        solution = [];
        gridSize.value = 15; // Fallback
      }
      grid.value = [];

      // Initialize all cells
      for (let i = 0; i < gridSize.value * gridSize.value; i++) {
        const row = Math.floor(i / gridSize.value);
        const col = i % gridSize.value;
        const isBlack = gridData[row]?.[col] === "" || !gridData[row]?.[col];
        grid.value.push({
          index: i,
          row,
          col,
          value: "",
          isBlack,
          number: null,
          isActive: false,
          isCorrect: false,
          solution: isBlack ? null : solution[row]?.[col] || "",
        });
      }

      // Assign numbers based on clue positions
      const allClues = [
        ...(puzzle.value.clues_across || []),
        ...(puzzle.value.clues_down || []),
      ];
      allClues.forEach((clue) => {
        const row = clue.row;
        const col = clue.col;
        const position = clue.position;
        const cellIndex = row * gridSize.value + col;
        if (grid.value[cellIndex] && !grid.value[cellIndex].isBlack) {
          grid.value[cellIndex].number = position;
        }
      });
    };

    const initializeClues = () => {
      try {
        clues.value.across = (puzzle.value.clues_across || []).map((clue) => ({
          number: clue.position,
          clue_vi: clue.clue,
          answer: clue.answer,
        }));
        clues.value.down = (puzzle.value.clues_down || []).map((clue) => ({
          number: clue.position,
          clue_vi: clue.clue,
          answer: clue.answer,
        }));
      } catch (error) {
        console.error("Error parsing clues:", error);
        errorMessage.value = "Dữ liệu gợi ý không hợp lệ.";
        clues.value = { across: [], down: [] };
      }
    };

    const selectCell = (index) => {
      if (gameOver.value || grid.value[index].isBlack) return;
      grid.value.forEach((cell) => (cell.isActive = false));
      grid.value[index].isActive = true;
      activeCell.value = index;

      const cell = grid.value[index];
      const acrossClue = clues.value.across.find((clue) => {
        const startCell = grid.value.find((c) => c.number === clue.number);
        if (!startCell) return false;
        return cell.row === startCell.row && cell.col >= startCell.col;
      });
      const downClue = clues.value.down.find((clue) => {
        const startCell = grid.value.find((c) => c.number === clue.number);
        if (!startCell) return false;
        return cell.col === startCell.col && cell.row >= startCell.row;
      });

      if (acrossClue && (!downClue || clueDirection.value === "across")) {
        activeClue.value = acrossClue.number;
        clueDirection.value = "across";
      } else if (downClue) {
        activeClue.value = downClue.number;
        clueDirection.value = "down";
      }
    };

    const highlightClue = (number, direction) => {
      activeClue.value = number;
      clueDirection.value = direction;
      const startCell = grid.value.find((cell) => cell.number === number);
      if (startCell) {
        selectCell(startCell.index);
      }
    };

    const handleInput = (index, event) => {
      const cell = grid.value[index];
      cell.value = event.target.value.toUpperCase();
      checkCorrectness(index);
      moveToNextCell(index);
    };

    const checkCorrectness = (index) => {
      const cell = grid.value[index];
      if (cell.value === cell.solution) {
        cell.isCorrect = true;
        score.value += 5;
      } else {
        cell.isCorrect = false;
      }
      checkGameCompletion();
    };

    const moveToNextCell = (index) => {
      let nextIndex;
      if (clueDirection.value === "across") {
        nextIndex = index + 1;
        while (nextIndex < grid.value.length && grid.value[nextIndex].isBlack) {
          nextIndex++;
        }
      } else {
        nextIndex = index + gridSize.value;
        while (nextIndex < grid.value.length && grid.value[nextIndex].isBlack) {
          nextIndex += gridSize.value;
        }
      }
      if (nextIndex < grid.value.length && !grid.value[nextIndex].isBlack) {
        selectCell(nextIndex);
      }
    };

    const handleKeydown = (event, index) => {
      if (event.key === "Backspace" && !grid.value[index].value) {
        let prevIndex;
        if (clueDirection.value === "across") {
          prevIndex = index - 1;
          while (prevIndex >= 0 && grid.value[prevIndex].isBlack) {
            prevIndex--;
          }
        } else {
          prevIndex = index - gridSize.value;
          while (prevIndex >= 0 && grid.value[prevIndex].isBlack) {
            prevIndex -= gridSize.value;
          }
        }
        if (prevIndex >= 0 && !grid.value[prevIndex].isBlack) {
          selectCell(prevIndex);
        }
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        clueDirection.value = "across";
        const delta = event.key === "ArrowRight" ? 1 : -1;
        let nextIndex = index + delta;
        while (
          nextIndex >= 0 &&
          nextIndex < grid.value.length &&
          grid.value[nextIndex].isBlack
        ) {
          nextIndex += delta;
        }
        if (nextIndex >= 0 && nextIndex < grid.value.length) {
          selectCell(nextIndex);
        }
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        clueDirection.value = "down";
        const delta =
          event.key === "ArrowDown" ? gridSize.value : -gridSize.value;
        let nextIndex = index + delta;
        while (
          nextIndex >= 0 &&
          nextIndex < grid.value.length &&
          grid.value[nextIndex].isBlack
        ) {
          nextIndex += delta;
        }
        if (nextIndex >= 0 && nextIndex < grid.value.length) {
          selectCell(nextIndex);
        }
      }
    };

    const checkGameCompletion = () => {
      const allCorrect = grid.value.every(
        (cell) => cell.isBlack || (cell.value && cell.value === cell.solution)
      );
      if (allCorrect) {
        gameOver.value = true;
        clearInterval(timer);
      }
    };

    const startTimer = () => {
      timer = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value -= 1;
        } else {
          gameOver.value = true;
          clearInterval(timer);
        }
      }, 1000);
    };

    const saveSession = async () => {
      if (!game.value || !userId.value) {
        errorMessage.value =
          "Không thể lưu phiên chơi: Thiếu thông tin người dùng hoặc trò chơi.";
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        await axios.post(
          "https://ct313hm01-project-gphuc04.onrender.com/game-sessions",
          {
            user_id: userId.value,
            game_id: game.value.game_id,
            score: score.value,
            time_spent: game.value.time_limit - timeRemaining.value,
            difficulty: puzzle.value.difficulty_level || "easy",
            status: "completed",
            game_data: JSON.stringify({
              puzzle_id: puzzle.value.puzzle_id,
              correct_cells: grid.value.filter((cell) => cell.isCorrect).length,
            }),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        router.push({ name: "Games" });
      } catch (error) {
        console.error("Lỗi khi lưu phiên chơi:", error);
        errorMessage.value =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : "Không thể lưu phiên chơi. Vui lòng thử lại.";
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    const restartGame = () => {
      score.value = 0;
      timeRemaining.value = game.value?.time_limit || 300;
      gameOver.value = false;
      activeCell.value = null;
      activeClue.value = null;
      clueDirection.value = "across";
      grid.value.forEach((cell) => {
        if (!cell.isBlack) {
          cell.value = "";
          cell.isCorrect = false;
          cell.isActive = false;
        }
      });
      errorMessage.value = null;
      startTimer();
    };

    const showHelp = () => {
      alert(`
🧩 Hướng dẫn chơi Ô Chữ Hóa Học:

1. Nhấn vào ô trong bảng để chọn ô chữ.
2. Nhập chữ cái (1 ký tự) vào ô được chọn.
3. Sử dụng các gợi ý ngang/dọc để điền đáp án đúng.
4. Mỗi ô đúng được 5 điểm.
5. Hoàn thành ô chữ trước khi hết thời gian!

🏆 Mẹo: Nhấn vào gợi ý để highlight các ô liên quan!
      `);
    };

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const goBack = () => {
      if (timer) clearInterval(timer);
      router.push({ name: "Games" });
    };

    const toggleMusic = () => {
      if (isMusicPlaying.value) {
        audio.pause();
      } else {
        audio.play();
      }
      isMusicPlaying.value = !isMusicPlaying.value;
    };

    onMounted(async () => {
      checkAuthStatus();
      if (userId.value) {
        await initializeGame();
        if (game.value) {
          await loadPuzzle();
          startTimer();
          audio.loop = true; // Lặp lại nhạc
          audio
            .play()
            .catch((error) => console.log("Audio play error:", error)); // Xử lý lỗi autoplay
        }
      }
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
      audio.pause(); // Dừng nhạc khi component bị hủy
      audio.currentTime = 0; // Đặt lại thời gian về 0
    });

    return {
      score,
      timeRemaining,
      gameOver,
      puzzle,
      grid,
      clues,
      activeCell,
      activeClue,
      clueDirection,
      errorMessage,
      gamesError,
      game,
      userId,
      gridSize,
      selectCell,
      handleInput,
      handleKeydown,
      highlightClue,
      saveSession,
      restartGame,
      showHelp,
      formatTime,
      goBack,
      isMusicPlaying,
      toggleMusic,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
}

.game-wrapper {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #2a2a72 0%, #4c2889 100%);
}

.molecule {
  position: absolute;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

.molecule:nth-child(odd) {
  animation-delay: -7s;
}

.molecule:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-duration: 20s;
}
.molecule:nth-child(2) {
  left: 20%;
  top: 80%;
  animation-duration: 15s;
}
.molecule:nth-child(3) {
  left: 30%;
  top: 40%;
  animation-duration: 18s;
}
.molecule:nth-child(4) {
  left: 40%;
  top: 60%;
  animation-duration: 17s;
}
.molecule:nth-child(5) {
  left: 50%;
  top: 10%;
  animation-duration: 22s;
}
.molecule:nth-child(6) {
  left: 60%;
  top: 70%;
  animation-duration: 14s;
}
.molecule:nth-child(7) {
  left: 70%;
  top: 30%;
  animation-duration: 19s;
}
.molecule:nth-child(8) {
  left: 80%;
  top: 50%;
  animation-duration: 16s;
}
.molecule:nth-child(9) {
  left: 90%;
  top: 90%;
  animation-duration: 21s;
}
.molecule:nth-child(10) {
  left: 5%;
  top: 50%;
  animation-duration: 23s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.game-container {
  min-height: 100vh;
  padding: 20px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.game-title h1 {
  font-family: "Orbitron", monospace;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(45deg, #4b6cb7, #6b21a8, #ff6b6b, #ffd93d);
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

.status-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.status-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 300;
}

.status-value {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: "Orbitron", monospace;
}

.error-notification {
  background: rgba(255, 107, 107, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 15px;
  padding: 15px;
  margin: 20px 0;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff6b6b;
  font-weight: 500;
}

.main-game-area {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.crossword-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.crossword-header {
  text-align: center;
  margin-bottom: 20px;
}

.crossword-header h2 {
  font-family: "Orbitron", monospace;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #ffffff;
}

.crossword-header p {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
}

.grid-container {
  display: flex;
  justify-content: center;
}

.crossword-grid {
  display: grid;
  gap: 2px;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 10px;
}

.grid-cell {
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.grid-cell input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  background: transparent;
  color: #000000;
}

.black-cell {
  background: #000000;
}

.active-cell {
  background: #ffd93d;
  border-color: #ffffff;
}

.correct-cell {
  background: #6bcf7f;
}

.number-cell::before {
  content: attr(data-number);
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #000000;
}

.cell-number {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #000000;
}

.clues-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px;
}

.clues-header h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #ffd93d;
  text-align: center;
}

.clues-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.clues-group {
  flex: 1;
}

.clues-group h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.clue-item {
  font-size: 1rem;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clue-item:hover {
  color: #ffd93d;
}

.active-clue {
  color: #ffd93d;
  font-weight: 700;
}

.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
}

.game-over-header {
  position: relative;
  margin-bottom: 30px;
}

.game-over-header h2 {
  font-family: "Orbitron", monospace;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffd93d;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 217, 61, 0.3);
}

.fireworks {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #ff6b6b 2px, transparent 2px),
    radial-gradient(circle, #ffd93d 2px, transparent 2px),
    radial-gradient(circle, #6bcf7f 2px, transparent 2px);
  background-size: 20px 20px, 30px 30px, 25px 25px;
  background-position: 0 0, 10px 10px, 15px 5px;
  animation: fireworks 2s infinite;
}

@keyframes fireworks {
  0%,
  100% {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.final-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
}

.stat-item i {
  font-size: 1.5rem;
  color: #ffd93d;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.save-button,
.play-again-button {
  padding: 12px 25px;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-button {
  background: linear-gradient(135deg, #6bcf7f, #4ecdc4);
}

.play-again-button {
  background: linear-gradient(135deg, #ff6b6b, #ffd93d);
}

.save-button:hover,
.play-again-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 12px 20px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.back-button:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.3);
}

.help-button:hover {
  background: rgba(255, 217, 61, 0.2);
  border-color: rgba(255, 217, 61, 0.3);
}

.music-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.music-control button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-control button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.music-control button.active {
  background: rgba(107, 201, 127, 0.3);
}

@media (max-width: 768px) {
  .game-title h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .status-bar {
    flex-direction: column;
    align-items: center;
  }

  .status-card {
    width: 100%;
    max-width: 300px;
  }

  .crossword-grid {
    grid-template-columns: repeat(15, 30px);
  }

  .grid-cell {
    width: 30px;
    height: 30px;
  }

  .grid-cell input {
    font-size: 1rem;
  }

  .clues-content {
    flex-direction: column;
  }

  .navigation-controls {
    bottom: 20px;
    flex-direction: column;
    align-items: center;
  }

  .nav-button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .music-control {
    top: 15px;
    right: 15px;
  }

  .music-control button {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 15px;
  }

  .game-title h1 {
    font-size: 2rem;
  }

  .crossword-section {
    padding: 20px;
  }

  .crossword-grid {
    grid-template-columns: repeat(15, 25px);
  }

  .grid-cell {
    width: 25px;
    height: 25px;
  }

  .grid-cell input {
    font-size: 0.9rem;
  }

  .modal-content {
    padding: 30px 20px;
  }

  .game-over-header h2 {
    font-size: 2rem;
  }

  .modal-actions {
    flex-direction: column;
    align-items: center;
  }

  .save-button,
  .play-again-button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .music-control {
    top: 10px;
    right: 10px;
  }

  .music-control button {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}
</style>

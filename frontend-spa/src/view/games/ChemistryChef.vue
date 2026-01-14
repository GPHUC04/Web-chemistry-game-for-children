<template>
  <div class="game-wrapper">
    <NavbarUser />

    <!-- Background Animation -->
    <div class="background-animation">
      <div class="molecule" v-for="n in 15" :key="n"></div>
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
          <h1>Đầu Bếp Hóa Học</h1>
          <p class="subtitle">Khám phá thế giới phản ứng hóa học kỳ diệu</p>
        </div>

        <!-- Game Status Bar -->
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
                Math.floor(score / 100) + 1
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
      <div v-if="game && userId" class="main-game-area">
        <!-- Laboratory Section -->
        <div class="laboratory-section">
          <div class="lab-header">
            <h2>🧬 Phòng Thí Nghiệm</h2>
            <p>Chọn các chất để tạo phản ứng hóa học</p>
          </div>

          <div class="lab-content">
            <div class="reactants-section">
              <h3>Chất Tham Gia Phản Ứng</h3>
              <div class="items-container">
                <div
                  v-for="item in availableItems"
                  :key="item.id"
                  class="chemical-item"
                  :class="{
                    selected: selectedItems.includes(item.id),
                    successful: successfulItems.includes(item.id),
                    'pulse-animation': selectedItems.includes(item.id),
                  }"
                  @click="selectItem(item.id)"
                >
                  <div class="item-symbol">
                    {{ item.symbol || item.formula }}
                  </div>
                  <div class="item-glow"></div>
                </div>
              </div>
            </div>

            <div class="reaction-controls">
              <button
                class="reaction-button"
                :class="{
                  ready: selectedItems.length >= 2,
                  disabled: selectedItems.length < 2,
                }"
                @click="performReaction"
                :disabled="selectedItems.length < 2"
              >
                <i class="fas fa-flask"></i>
                <span>Thực Hiện Phản Ứng</span>
                <div class="button-particles"></div>
              </button>

              <div class="selected-items-preview">
                <span v-if="selectedItems.length === 0"
                  >Chọn ít nhất 2 chất</span
                >
                <span v-else>Đã chọn: {{ selectedItems.length }}/2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reaction Result -->
        <div v-if="reactionResult" class="reaction-result-section">
          <div class="result-header">
            <h3>⚗️ Kết Quả Phản Ứng</h3>
          </div>
          <div class="result-content">
            <div class="equation-display">
              <span class="equation">{{ reactionResult.equation }}</span>
            </div>
            <p v-if="reactionResult.description_vi" class="description">
              {{ reactionResult.description_vi }}
            </p>
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
              <span>Cấp độ: {{ Math.floor(score / 100) + 1 }}</span>
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
  name: "ChemistryChef",
  components: {
    NavbarUser,
  },
  setup() {
    const router = useRouter();
    const { games, errorMessage: gamesError, loadGames } = useGames();
    const score = ref(0);
    const timeRemaining = ref(300);
    const gameOver = ref(false);
    const availableItems = ref([]);
    const selectedItems = ref([]);
    const successfulItems = ref([]);
    const reactionResult = ref(null);
    const errorMessage = ref(null);
    const game = ref(null);
    const userId = ref(null);
    let timer = null;
    const isMusicPlaying = ref(true);
    const audio = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
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
        const chemistryChef = games.value.find(
          (g) => g.game_code === "master_chef"
        );
        if (chemistryChef) {
          game.value = chemistryChef;
          timeRemaining.value = chemistryChef.time_limit || 300;
        } else {
          errorMessage.value =
            "Không tìm thấy thông tin trò chơi Đầu Bếp Hóa Học.";
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo trò chơi:", error);
        errorMessage.value =
          "Không thể tải thông tin trò chơi. Vui lòng thử lại.";
      }
    };

    const loadItems = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [elementsRes /*compoundsRes*/] = await Promise.all([
          axios.get("https://ct313hm01-project-gphuc04.onrender.com/elements", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // axios.get("https://ct313hm01-project-gphuc04.onrender.com/compounds", {
          //   headers: { Authorization: `Bearer ${token}` },
          // }),
        ]);

        const elements = Array.isArray(
          elementsRes.data.result || elementsRes.data
        )
          ? elementsRes.data.result || elementsRes.data
          : [];
        // const compounds = Array.isArray(
        //   compoundsRes.data.result || compoundsRes.data
        // )
        //   ? compoundsRes.data.result || compoundsRes.data
        //   : [];

        availableItems.value = [
          ...elements.map((e) => ({
            id: `element_${e.element_id}`,
            symbol: e.symbol,
          })),
          // ...compounds.map((c) => ({
          //   id: `compound_${c.compound_id}`,
          //   formula: c.formula,
          // })),
        ];

        if (availableItems.value.length === 0) {
          errorMessage.value = "Không tìm thấy nguyên tố hoặc hợp chất.";
        }
      } catch (error) {
        console.error("Lỗi khi lấy nguyên tố/hợp chất:", error);
        errorMessage.value =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : "Không thể tải dữ liệu nguyên tố/hợp chất. Vui lòng thử lại.";
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    const normalizeReactant = (symbol) => {
      const map = { H: "H2", O: "O2", N: "N2" };
      return map[symbol] || symbol;
    };

    const selectItem = (itemId) => {
      if (selectedItems.value.includes(itemId)) {
        selectedItems.value = selectedItems.value.filter((id) => id !== itemId);
      } else if (selectedItems.value.length < 2) {
        selectedItems.value.push(itemId);
      }
    };

    const performReaction = async () => {
      if (selectedItems.value.length < 2) {
        errorMessage.value = "Vui lòng chọn ít nhất 2 chất tham gia!";
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        const reactants = selectedItems.value.map((id) => {
          const [type] = id.split("_");
          const item = availableItems.value.find((i) => i.id === id);
          return type === "element"
            ? normalizeReactant(item.symbol)
            : item.formula;
        });

        const res = await axios.get(
          "https://ct313hm01-project-gphuc04.onrender.com/chemical-reactions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const reactions = Array.isArray(res.data.result || res.data)
          ? res.data.result || res.data
          : [];
        const reaction = reactions.find((r) => {
          try {
            const reactionReactants = JSON.parse(r.reactants);
            return reactants.every((reactant) =>
              reactionReactants.includes(reactant)
            );
          } catch (e) {
            return false;
          }
        });

        reactionResult.value = reaction || {
          equation: "Không tìm thấy phản ứng phù hợp",
        };

        if (reaction) {
          score.value += 10;
          successfulItems.value = [
            ...successfulItems.value,
            ...selectedItems.value,
          ];
        }

        selectedItems.value = [];
      } catch (error) {
        console.error("Lỗi khi kiểm tra phản ứng:", error);
        reactionResult.value = { equation: "Lỗi khi thực hiện phản ứng" };
        errorMessage.value =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : "Không thể thực hiện phản ứng. Vui lòng thử lại.";
        if (error.response?.status === 401) {
          router.push("/login");
        }
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
            difficulty: game.value.game_settings?.difficulty || "medium",
            status: "completed",
            game_data: JSON.stringify({
              reactionsPerformed: reactionResult.value ? 1 : 0,
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
      selectedItems.value = [];
      successfulItems.value = [];
      reactionResult.value = null;
      errorMessage.value = null;
      startTimer();
    };

    const showHelp = () => {
      alert(`
🧪 Hướng dẫn chơi Đầu Bếp Hóa Học:

1. Chọn 2 chất từ danh sách nguyên tố/hợp chất
2. Nhấn "Thực hiện phản ứng" để tạo phản ứng
3. Phản ứng thành công sẽ cộng 10 điểm và các chất sẽ đổi sang màu vàng
4. Hoàn thành trước khi hết thời gian!

🏆 Mẹo: Chọn đúng cặp chất để tạo phản ứng hợp lệ!
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
          await loadItems();
          startTimer();
          audio.loop = true;
          audio
            .play()
            .catch((error) => console.log("Audio play error:", error));
        }
      }
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    });

    return {
      score,
      timeRemaining,
      gameOver,
      availableItems,
      selectedItems,
      successfulItems,
      reactionResult,
      errorMessage,
      gamesError,
      game,
      userId,
      selectItem,
      performReaction,
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

/* Background Animation */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.molecule {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.molecule:nth-child(odd) {
  animation-delay: -10s;
}

.molecule:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-duration: 25s;
}
.molecule:nth-child(2) {
  left: 20%;
  top: 80%;
  animation-duration: 18s;
}
.molecule:nth-child(3) {
  left: 30%;
  top: 40%;
  animation-duration: 22s;
}
.molecule:nth-child(4) {
  left: 40%;
  top: 60%;
  animation-duration: 20s;
}
.molecule:nth-child(5) {
  left: 50%;
  top: 10%;
  animation-duration: 28s;
}
.molecule:nth-child(6) {
  left: 60%;
  top: 70%;
  animation-duration: 15s;
}
.molecule:nth-child(7) {
  left: 70%;
  top: 30%;
  animation-duration: 24s;
}
.molecule:nth-child(8) {
  left: 80%;
  top: 50%;
  animation-duration: 19s;
}
.molecule:nth-child(9) {
  left: 90%;
  top: 90%;
  animation-duration: 21s;
}
.molecule:nth-child(10) {
  left: 5%;
  top: 50%;
  animation-duration: 26s;
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

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.game-title h1 {
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

/* Status Bar */
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

/* Error Notification */
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

/* Main Game Area */
.main-game-area {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Laboratory Section */
.laboratory-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.lab-header {
  text-align: center;
  margin-bottom: 30px;
}

.lab-header h2 {
  font-family: "Orbitron", monospace;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #ffffff;
}

.lab-header p {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
}

.reactants-section h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: #ffd93d;
}

.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.chemical-item {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chemical-item:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.5);
}

.chemical-item.selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #ffd93d;
  box-shadow: 0 0 30px rgba(255, 217, 61, 0.4);
}

.chemical-item.successful {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  border-color: #ffffff;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

.chemical-item.pulse-animation {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.item-symbol {
  font-family: "Orbitron", monospace;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.item-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chemical-item:hover .item-glow {
  opacity: 1;
}

/* Reaction Controls */
.reaction-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.reaction-button {
  background: linear-gradient(135deg, #ff6b6b, #ffd93d);
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
}

.reaction-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
}

.reaction-button.disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
}

.reaction-button.ready {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  }
  to {
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
  }
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.reaction-button:hover .button-particles {
  transform: translateX(100%);
}

.selected-items-preview {
  font-size: 1rem;
  opacity: 0.8;
  text-align: center;
}

/* Reaction Result Section */
.reaction-result-section {
  background: rgba(108, 207, 127, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(108, 207, 127, 0.3);
  border-radius: 20px;
  padding: 25px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.result-header h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #6bcf7f;
  text-align: center;
}

.equation-display {
  text-align: center;
  margin-bottom: 15px;
}

.equation {
  font-family: "Orbitron", monospace;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px 25px;
  border-radius: 15px;
  display: inline-block;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  opacity: 0.9;
  margin: 0;
}

/* Game Over Modal */
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
  overflow: hidden;
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

/* Navigation Controls */
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

/* Responsive Design */
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

  .items-container {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 10px;
  }

  .chemical-item {
    padding: 15px;
  }

  .item-symbol {
    font-size: 1.2rem;
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

  .laboratory-section {
    padding: 20px;
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

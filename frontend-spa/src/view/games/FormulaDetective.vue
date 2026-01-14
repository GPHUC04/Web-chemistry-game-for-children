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
          <h1>Thám Tử Công Thức</h1>
          <p class="subtitle">Đoán tên hợp chất từ công thức hóa học!</p>
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
          <div class="status-card correct-card">
            <div class="status-icon">✅</div>
            <div class="status-content">
              <span class="status-label">Câu đúng</span>
              <span class="status-value">{{ correctAnswers }}</span>
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
      <div v-if="game && userId && currentCompound" class="main-game-area">
        <!-- Formula Section -->
        <div class="formula-section">
          <div class="formula-header">
            <h2>🧪 Công Thức Hóa Học</h2>
            <p>Đoán tên hợp chất dưới đây</p>
          </div>
          <div class="formula-display">
            <span class="formula">{{ currentCompound.formula }}</span>
          </div>
          <div class="answer-input">
            <input
              v-model="userAnswer"
              class="w-full p-2 border rounded"
              placeholder="Nhập tên hợp chất (VD: Nước hoặc Water)"
              :disabled="gameOver"
              @keyup.enter="submitAnswer"
            />
            <button
              class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              @click="submitAnswer"
              :disabled="gameOver"
            >
              Gửi Câu Trả Lời
            </button>
          </div>
          <div class="hint-section" v-if="showHint">
            <p>Gợi ý: {{ currentCompound.hint || "Không có gợi ý" }}</p>
          </div>
          <button class="hint-button" @click="toggleHint" :disabled="gameOver">
            {{ showHint ? "Ẩn Gợi Ý" : "Hiện Gợi Ý" }}
          </button>
        </div>

        <!-- Correct Answers -->
        <div v-if="answeredCompounds.length" class="answered-section">
          <h3>✅ Các Hợp Chất Đã Trả Lời</h3>
          <ul>
            <li v-for="(compound, index) in answeredCompounds" :key="index">
              {{ compound.formula }}: {{ compound.name_vi }} ({{
                compound.name_en
              }})
            </li>
          </ul>
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
              <i class="fas fa-check-circle"></i>
              <span>Câu đúng: {{ correctAnswers }}</span>
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
import { useFormulaDetective } from "@/composables/useFormulaDetective";
import NavbarUser from "@/components/NavbarUser.vue";
import { ref, onMounted, onUnmounted } from "vue";
export default {
  name: "FormulaDetective",
  components: {
    NavbarUser,
  },
  setup() {
    const {
      score,
      timeRemaining,
      gameOver,
      currentCompound,
      userAnswer,
      answeredCompounds,
      correctAnswers,
      errorMessage,
      gamesError,
      game,
      userId,
      showHint,
      getRandomFormula,
      formatTime,
      submitAnswer,
      toggleHint,
      saveSession,
      restartGame,
      showHelp,
      goBack,
      retryLoadData,
    } = useFormulaDetective();

    const isMusicPlaying = ref(true);
    const audio = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    ); // URL nhạc mẫu, thay bằng file của bạn

    const toggleMusic = () => {
      if (isMusicPlaying.value) {
        audio.pause();
      } else {
        audio.play();
      }
      isMusicPlaying.value = !isMusicPlaying.value;
    };

    onMounted(async () => {
      if (userId.value) {
        await getRandomFormula();
        audio.loop = true;
        audio.play().catch((error) => console.log("Audio play error:", error));
      }
    });

    onUnmounted(() => {
      audio.pause();
      audio.currentTime = 0;
    });

    return {
      score,
      timeRemaining,
      gameOver,
      currentCompound,
      userAnswer,
      answeredCompounds,
      correctAnswers,
      errorMessage,
      gamesError,
      game,
      userId,
      showHint,
      getRandomFormula,
      formatTime,
      submitAnswer,
      toggleHint,
      saveSession,
      restartGame,
      showHelp,
      goBack,
      retryLoadData,
      isMusicPlaying,
      toggleMusic,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap");

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
.molecule:nth-child(11) {
  left: 15%;
  top: 30%;
  animation-duration: 23s;
}
.molecule:nth-child(12) {
  left: 25%;
  top: 70%;
  animation-duration: 17s;
}
.molecule:nth-child(13) {
  left: 35%;
  top: 50%;
  animation-duration: 21s;
}
.molecule:nth-child(14) {
  left: 45%;
  top: 90%;
  animation-duration: 19s;
}
.molecule:nth-child(15) {
  left: 55%;
  top: 20%;
  animation-duration: 27s;
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
  padding: 30px;
  color: #e5e7eb;
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

.formula-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.formula-header h2 {
  font-family: "Orbitron", monospace;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #ffffff;
}

.formula-header p {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
}

.formula-display {
  margin: 20px 0;
}

.formula {
  font-family: "Orbitron", monospace;
  font-size: 2rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px 25px;
  border-radius: 15px;
  display: inline-block;
  color: #ffd93d;
}

.answer-input input {
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  margin-bottom: 10px;
}

.answer-input button {
  background: linear-gradient(135deg, #4b6cb7, #6b21a8);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-input button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(75, 108, 183, 0.3);
}

.hint-section {
  margin-top: 20px;
  font-size: 1.1rem;
  color: #6bcf7f;
}

.hint-button {
  background: linear-gradient(135deg, #ffd93d, #ffaa00);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.hint-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 217, 61, 0.3);
}

.answered-section {
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

.answered-section h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #6bcf7f;
  text-align: center;
}

.answered-section ul {
  list-style: none;
  padding: 0;
}

.answered-section li {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #ffffff;
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
  .formula-section {
    padding: 20px;
  }
  .formula {
    font-size: 1.5rem;
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

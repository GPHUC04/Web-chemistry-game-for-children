<template>
  <div class="game-wrapper">
    <NavbarUser />

    <!-- Background Animation -->
    <div class="background-animation">
      <div class="molecule" v-for="n in 15" :key="n"></div>
    </div>

    <div class="game-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="game-title">
          <h1>Xây Dựng Chuỗi Phản Ứng</h1>
          <p class="subtitle">Tạo chuỗi phản ứng hóa học liên tiếp dài nhất!</p>
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

          <div class="status-card chain-card">
            <div class="status-icon">🔗</div>
            <div class="status-content">
              <span class="status-label">Độ dài chuỗi</span>
              <span class="status-value">{{ chainLength }}</span>
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
        <!-- Laboratory Section -->
        <div class="laboratory-section">
          <div class="lab-header">
            <h2>🧬 Phòng Thí Nghiệm</h2>
            <p>
              Nhập phương trình hoặc chọn chất để tiếp tục chuỗi phản ứng hóa
              học
            </p>
          </div>

          <div class="lab-content">
            <div class="reactants-section">
              <h3>Chất Tham Gia Phản Ứng</h3>
              <div class="previous-product" v-if="lastProduct">
                <span>Sản phẩm trước: {{ lastProduct }}</span>
              </div>
              <div class="reaction-input">
                <input
                  v-model="currentEquation"
                  class="w-full p-2 border rounded"
                  placeholder="Nhập phương trình (VD: 2H2 + O2 → 2H2O)"
                  :disabled="gameOver"
                  @keyup.enter="performReaction"
                />
              </div>
              <div class="items-container">
                <div
                  v-for="item in availableItems"
                  :key="item.id"
                  class="chemical-item"
                  :class="{
                    selected: selectedItem === item.id,
                    successful: successfulItems.includes(item.id),
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
                  ready: selectedItem || currentEquation,
                  disabled: isReactionButtonDisabled,
                }"
                @click="performReaction"
                :disabled="isReactionButtonDisabled"
              >
                <i class="fas fa-flask"></i>
                <span>Thực Hiện Phản Ứng</span>
                <div class="button-particles"></div>
              </button>

              <div class="selected-items-preview">
                <span v-if="!selectedItem && !currentEquation">
                  Chọn một chất hoặc nhập phương trình để
                  {{
                    reactionChain.length === 0
                      ? "bắt đầu chuỗi"
                      : "tiếp tục chuỗi"
                  }}
                </span>
                <span v-else-if="selectedItem"
                  >Đã chọn: {{ selectedItemName }}</span
                >
                <span v-else>Phương trình: {{ currentEquation }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reaction Chain -->
        <div v-if="reactionChain.length" class="reaction-chain-section">
          <div class="result-header">
            <h3>🔗 Chuỗi Phản Ứng</h3>
          </div>
          <div class="result-content">
            <div
              v-for="(reaction, index) in reactionChain"
              :key="index"
              class="equation-display"
            >
              <span class="equation">{{ reaction.equation }}</span>
              <p v-if="reaction.description_vi" class="description">
                {{ reaction.description_vi }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Over Modal -->
      <div v-if="gameOver" class="game-over-modal">
        <div class="modal-content">
          <div class="game-over-header">
            <h2>🎉 Chuỗi Phản Ứng Hoàn Thành!</h2>
            <div class="fireworks"></div>
          </div>

          <div class="final-stats">
            <div class="stat-item">
              <i class="fas fa-trophy"></i>
              <span>Điểm cuối: {{ score }}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-link"></i>
              <span>Độ dài chuỗi: {{ chainLength }}</span>
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useGames } from "@/composables/useGames";

export default {
  name: "ChainReactionBuilder",
  components: {
    NavbarUser,
  },
  setup() {
    const router = useRouter();
    const { games, errorMessage: gamesError, loadGames } = useGames();
    const score = ref(0);
    const timeRemaining = ref(600); // 10 phút
    const gameOver = ref(false);
    const puzzle = ref(null);
    const availableItems = ref([]);
    const selectedItem = ref(null);
    const selectedItemName = ref("");
    const lastProduct = ref(null);
    const reactionChain = ref([]);
    const successfulItems = ref([]);
    const errorMessage = ref(null);
    const game = ref(null);
    const userId = ref(null);
    const currentEquation = ref("");
    let timer = null;

    // Computed property to handle button disabled state
    const isReactionButtonDisabled = computed(() => {
      return !selectedItem.value && !currentEquation.value;
    });

    const chainLength = computed(() => reactionChain.value.length);

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
        const chainReactionGame = games.value.find(
          (g) => g.game_code === "chain_reaction_builder"
        );
        if (chainReactionGame) {
          game.value = chainReactionGame;
          timeRemaining.value = chainReactionGame.time_limit || 600;
        } else {
          errorMessage.value =
            "Không tìm thấy thông tin trò chơi Xây Dựng Chuỗi Phản Ứng.";
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
        const puzzles = Array.isArray(response.data.result || response.data)
          ? response.data.result || response.data
          : [];
        if (puzzles.length > 0) {
          puzzle.value = puzzles[0];
          // Load available items based on allowed_elements
          availableItems.value = puzzle.value.allowed_elements.map(
            (symbol, index) => ({
              id: `element_${index}`,
              symbol,
            })
          );
        } else {
          errorMessage.value = "Không tìm thấy câu đố phản ứng.";
        }
      } catch (error) {
        console.error("Lỗi khi tải câu đố:", error);
        errorMessage.value =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : "Không thể tải câu đố. Vui lòng thử lại.";
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    const normalizeReactant = (symbol) => {
      const map = { H: "H2", O: "O2", N: "N2", Cl: "Cl2", Br: "Br2", S: "S" };
      return map[symbol] || symbol;
    };

    const parseEquation = (equation) => {
      const [reactants, products] = equation
        .split("→")
        .map((s) => s.trim().replace(/\s+/g, ""));
      if (!reactants || !products) return null;

      const reactantList = reactants.split("+").map((s) => s.trim());
      const productList = products.split("+").map((s) => s.trim());

      const parseCompound = (compound) => {
        const regex = /([A-Z][a-z]?)(\d*)/g;
        const elements = {};
        let match;
        while ((match = regex.exec(compound)) !== null) {
          const element = match[1];
          const count = match[2] ? parseInt(match[2], 10) : 1;
          elements[element] = (elements[element] || 0) + count;
        }
        return elements;
      };

      const reactantElements = reactantList.reduce((acc, compound) => {
        const elements = parseCompound(compound);
        Object.keys(elements).forEach((el) => {
          acc[el] = (acc[el] || 0) + elements[el];
        });
        return acc;
      }, {});

      const productElements = productList.reduce((acc, compound) => {
        const elements = parseCompound(compound);
        Object.keys(elements).forEach((el) => {
          acc[el] = (acc[el] || 0) + elements[el];
        });
        return acc;
      }, {});

      // Kiểm tra nguyên tố có trong puzzle.allowed_elements không
      const allowedElements = puzzle.value?.allowed_elements || [];
      const allElements = [
        ...Object.keys(reactantElements),
        ...Object.keys(productElements),
      ];
      if (!allElements.every((el) => allowedElements.includes(el))) {
        return null;
      }

      return {
        reactants: reactantList,
        products: productList,
        reactantElements,
        productElements,
      };
    };

    const isEquationBalanced = (equationData) => {
      if (!equationData) return false;
      const { reactantElements, productElements } = equationData;
      const elements = new Set([
        ...Object.keys(reactantElements),
        ...Object.keys(productElements),
      ]);
      for (const element of elements) {
        if (
          (reactantElements[element] || 0) !== (productElements[element] || 0)
        ) {
          return false;
        }
      }
      return true;
    };

    const isValidChain = (newReactants) => {
      if (reactionChain.value.length === 0) return true;
      const lastReaction = reactionChain.value[reactionChain.value.length - 1];
      return lastReaction.products.some((product) =>
        newReactants.includes(product)
      );
    };

    const selectItem = (itemId) => {
      if (selectedItem.value === itemId) {
        selectedItem.value = null;
        selectedItemName.value = "";
      } else {
        selectedItem.value = itemId;
        const item = availableItems.value.find((i) => i.id === itemId);
        selectedItemName.value = item.symbol || item.formula;
        currentEquation.value = "";
      }
    };

    const performReaction = async () => {
      let equation = currentEquation.value;
      let reactants = [];

      if (selectedItem.value && !equation) {
        const item = availableItems.value.find(
          (i) => i.id === selectedItem.value
        );
        const selectedReactant = normalizeReactant(item.symbol || item.formula);
        reactants =
          reactionChain.value.length === 0
            ? [selectedReactant]
            : [lastProduct.value, selectedReactant];
      } else if (equation) {
        const equationData = parseEquation(equation);
        if (!equationData) {
          errorMessage.value =
            "Phương trình không hợp lệ hoặc chứa nguyên tố không cho phép.";
          return;
        }
        if (!isEquationBalanced(equationData)) {
          errorMessage.value = "Phương trình không cân bằng. Hãy kiểm tra lại.";
          return;
        }
        if (!isValidChain(equationData.reactants)) {
          errorMessage.value =
            "Sản phẩm của phản ứng trước không có trong vế trái.";
          gameOver.value = true;
          clearInterval(timer);
          return;
        }
        reactants = equationData.reactants;
      } else {
        errorMessage.value = "Vui lòng chọn một chất hoặc nhập phương trình!";
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
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

        if (reaction) {
          reactionChain.value.push({
            ...reaction,
            equation:
              equation ||
              `${reactants.join(" + ")} → ${JSON.parse(reaction.products).join(
                " + "
              )}`,
          });
          score.value += 50;
          if (selectedItem.value) {
            successfulItems.value.push(selectedItem.value);
          }
          lastProduct.value = JSON.parse(reaction.products)[0];
          selectedItem.value = null;
          selectedItemName.value = "";
          currentEquation.value = "";
          errorMessage.value = null;

          if (
            reactionChain.value.length >= (puzzle.value?.max_reactions || 10)
          ) {
            gameOver.value = true;
            clearInterval(timer);
          }
        } else {
          errorMessage.value = "Không tìm thấy phản ứng hợp lệ. Hãy thử lại!";
          if (equation) {
            gameOver.value = true;
            clearInterval(timer);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra phản ứng:", error);
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
            difficulty: puzzle.value?.difficulty_level || "medium",
            status: "completed",
            game_data: JSON.stringify({
              puzzle_id: puzzle.value?.puzzle_id,
              chain_length: reactionChain.value.length,
              reactions: reactionChain.value,
            }),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        router.push({ name: "games" });
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
      timeRemaining.value = game.value?.time_limit || 600;
      gameOver.value = false;
      selectedItem.value = null;
      selectedItemName.value = "";
      lastProduct.value = null;
      reactionChain.value = [];
      successfulItems.value = [];
      currentEquation.value = "";
      errorMessage.value = null;
      startTimer();
    };

    const showHelp = () => {
      alert(`
Hướng dẫn chơi Xây Dựng Chuỗi Phản Ứng:

1. Nhập phương trình hóa học (VD: 2H2 + O2 → 2H2O) hoặc chọn một chất từ danh sách để tiếp tục chuỗi.
2. Phương trình phải cân bằng và sử dụng sản phẩm của phản ứng trước (nếu có).
3. Mỗi phản ứng thành công cộng 50 điểm và kéo dài chuỗi.
4. Tiếp tục để tạo chuỗi dài nhất trước khi hết thời gian!

🏆 Mẹo: Sử dụng các nguyên tố trong danh sách cho phép và kiểm tra kỹ phương trình!
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

    onMounted(async () => {
      checkAuthStatus();
      if (userId.value) {
        await initializeGame();
        if (game.value) {
          await loadPuzzle();
          startTimer();
        }
      }
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });

    return {
      score,
      timeRemaining,
      gameOver,
      puzzle,
      availableItems,
      selectedItem,
      selectedItemName,
      lastProduct,
      reactionChain,
      successfulItems,
      errorMessage,
      gamesError,
      game,
      userId,
      chainLength,
      currentEquation,
      isReactionButtonDisabled,
      selectItem,
      performReaction,
      saveSession,
      restartGame,
      showHelp,
      formatTime,
      goBack,
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

.previous-product {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: #6bcf7f;
  margin-bottom: 15px;
}

.reaction-input {
  margin-bottom: 20px;
}

.reaction-input input {
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
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

.reaction-chain-section {
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
}
</style>

import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useGames } from "@/composables/useGames";

export function useChemistryChef() {
  const router = useRouter();
  const { games, errorMessage: gamesError, loadGames } = useGames();
  const score = ref(0);
  const highScore = ref(0);
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

  const loadHighScore = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.get(`${apiUrl}/game-sessions/top-score`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userId.value, game_id: game.value?.game_id },
      });
      highScore.value = response.data.top_score || 0;
    } catch (error) {
      console.error("Lỗi khi lấy điểm cao nhất:", error);
      errorMessage.value = "Không thể tải điểm cao nhất. Vui lòng thử lại.";
    }
  };

  const loadItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const [elementsRes, compoundsRes] = await Promise.all([
        axios.get(`${apiUrl}/elements`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/compounds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const elements = Array.isArray(
        elementsRes.data.result || elementsRes.data
      )
        ? elementsRes.data.result || elementsRes.data
        : [];
      const compounds = Array.isArray(
        compoundsRes.data.result || compoundsRes.data
      )
        ? compoundsRes.data.result || compoundsRes.data
        : [];

      availableItems.value = [
        ...elements.map((e) => ({
          id: `element_${e.element_id}`,
          symbol: e.symbol,
        })),
        ...compounds.map((c) => ({
          id: `compound_${c.compound_id}`,
          formula: c.formula,
        })),
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
    const map = {
      H: "H₂",
      O: "O₂",
      N: "N₂",
      Cl: "Cl₂",
      F: "F₂",
      Br: "Br₂",
      I: "I₂",
    };
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
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const reactants = selectedItems.value.map((id) => {
        const [type] = id.split("_");
        const item = availableItems.value.find((i) => i.id === id);
        return type === "element"
          ? normalizeReactant(item.symbol)
          : item.formula;
      });

      const res = await axios.get(`${apiUrl}/chemical-reactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reactions = Array.isArray(res.data.result || res.data)
        ? res.data.result || res.data
        : [];
      const reaction = reactions.find((r) => {
        try {
          const reactionReactants = JSON.parse(r.reactants).map(
            (r) => r.compound
          );
          return (
            reactants.every((reactant) =>
              reactionReactants.includes(reactant)
            ) &&
            reactionReactants.every((reactant) => reactants.includes(reactant))
          );
        } catch (e) {
          console.error("Lỗi khi phân tích JSON reactants:", e);
          return false;
        }
      });

      reactionResult.value = reaction || {
        equation: "Không tìm thấy phản ứng phù hợp",
        description_vi: "Hãy thử kết hợp các chất khác!",
      };

      if (reaction) {
        const points =
          reaction.difficulty_level === "easy"
            ? 10
            : reaction.difficulty_level === "medium"
            ? 20
            : reaction.difficulty_level === "hard"
            ? 30
            : 50;
        score.value += points;
        successfulItems.value = [
          ...new Set([...successfulItems.value, ...selectedItems.value]),
        ];
        if (score.value > highScore.value) {
          highScore.value = score.value;
        }
      } else {
        errorMessage.value = "Phản ứng không hợp lệ. Hãy thử lại!";
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
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      await axios.post(
        `${apiUrl}/game-sessions`,
        {
          user_id: userId.value,
          game_id: game.value.game_id,
          score: score.value,
          time_spent: game.value.time_limit - timeRemaining.value,
          difficulty: game.value.game_settings?.difficulty || "medium",
          status: "completed",
          game_data: JSON.stringify({
            reactionsPerformed: reactionResult.value ? 1 : 0,
            highScore: highScore.value,
          }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push({ name: "Leaderboard" });
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
3. Phản ứng thành công sẽ cộng điểm (10-50 tùy độ khó) và các chất sẽ đổi sang màu vàng
4. Hoàn thành trước khi hết thời gian!

🏆 Mẹo: Chọn đúng cặp chất để tạo phản ứng hợp lệ và đạt điểm cao nhất!
    `);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const goBack = () => {
    if (timer) clearInterval(timer);
    router.push({ name: "Leaderboard" });
  };

  onMounted(async () => {
    checkAuthStatus();
    if (userId.value) {
      await initializeGame();
      if (game.value) {
        await loadItems();
        await loadHighScore();
        startTimer();
      }
    }
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    score,
    highScore,
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
  };
}

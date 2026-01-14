import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useGames } from "@/composables/useGames";

export function useFormulaDetective() {
  const router = useRouter();
  const { games, errorMessage: gamesError, loadGames } = useGames();
  const score = ref(0);
  const timeRemaining = ref(300); // 5 phút
  const gameOver = ref(false);
  const compounds = ref([]);
  const currentCompound = ref(null);
  const userAnswer = ref("");
  const answeredCompounds = ref([]);
  const correctAnswers = ref(0);
  const errorMessage = ref("");
  const game = ref(null);
  const userId = ref(null);
  const showHint = ref(false);
  let timer = null;

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
      const formulaGame = games.value.find(
        (g) => g.game_code === "formula_detective"
      );
      if (formulaGame) {
        game.value = formulaGame;
        timeRemaining.value = formulaGame.time_limit || 300;
      } else {
        errorMessage.value =
          "Không tìm thấy thông tin trò chơi Thám Tử Công Thức.";
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            router.push("/login");
            break;
          case 404:
            errorMessage.value = "Không tìm thấy trò chơi.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message ||
              "Không thể tải thông tin trò chơi.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    }
  };

  const loadCompounds = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.get(`${apiUrl}/compounds`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const data = Array.isArray(response.data.result || response.data)
        ? response.data.result || response.data
        : [];
      if (data.length > 0) {
        compounds.value = data;
        selectRandomCompound();
      } else {
        errorMessage.value = "Không tìm thấy hợp chất nào.";
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            router.push("/login");
            break;
          case 404:
            errorMessage.value = "Không tìm thấy dữ liệu hợp chất.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message ||
              "Không thể tải dữ liệu hợp chất.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    }
  };

  const retryLoadData = async () => {
    errorMessage.value = "";
    await initializeGame();
    if (game.value) {
      await loadCompounds();
      if (!timer) startTimer();
    }
  };

  const selectRandomCompound = () => {
    const unanswered = compounds.value.filter(
      (c) =>
        !answeredCompounds.value.some((ac) => ac.compound_id === c.compound_id)
    );
    if (unanswered.length === 0) {
      gameOver.value = true;
      if (timer) clearInterval(timer);
      return;
    }
    const randomIndex = Math.floor(Math.random() * unanswered.length);
    currentCompound.value = unanswered[randomIndex];
  };

  const submitAnswer = () => {
    if (!userAnswer.value.trim()) {
      errorMessage.value = "Vui lòng nhập tên hợp chất.";
      return;
    }

    const normalizedAnswer = userAnswer.value.trim().toLowerCase();
    const correctAnswerVi = currentCompound.value.name_vi?.toLowerCase() || "";
    const correctAnswerEn = currentCompound.value.name_en?.toLowerCase() || "";

    if (
      normalizedAnswer === correctAnswerVi ||
      normalizedAnswer === correctAnswerEn
    ) {
      score.value += 10;
      correctAnswers.value += 1;
      answeredCompounds.value.push(currentCompound.value);
      errorMessage.value = "";
      userAnswer.value = "";
      showHint.value = false;

      if (correctAnswers.value >= (game.value?.max_questions || 10)) {
        gameOver.value = true;
        if (timer) clearInterval(timer);
      } else {
        selectRandomCompound();
      }
    } else {
      errorMessage.value =
        "Câu trả lời không đúng. Thử lại bằng tiếng Việt hoặc tiếng Anh!";
    }
  };

  const toggleHint = () => {
    showHint.value = !showHint.value;
    if (showHint.value) {
      score.value = Math.max(0, score.value - 2); // Phạt 2 điểm khi xem gợi ý
    }
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value -= 1;
      } else {
        gameOver.value = true;
        if (timer) clearInterval(timer);
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
          difficulty: game.value.game_settings?.difficulty || "easy",
          status: "completed",
          game_data: JSON.stringify({
            correct_answers: correctAnswers.value,
            answered_compounds: answeredCompounds.value,
          }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      router.push({ name: "Games" });
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            router.push("/login");
            break;
          case 400:
            errorMessage.value = "Dữ liệu phiên chơi không hợp lệ.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Không thể lưu phiên chơi.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    }
  };

  const restartGame = () => {
    score.value = 0;
    timeRemaining.value = game.value?.time_limit || 300;
    gameOver.value = false;
    userAnswer.value = "";
    answeredCompounds.value = [];
    correctAnswers.value = 0;
    errorMessage.value = "";
    showHint.value = false;
    selectRandomCompound();
    startTimer();
  };

  const showHelp = () => {
    alert(`
Hướng dẫn chơi Thám Tử Công Thức:

1. Xem công thức hóa học được hiển thị (VD: H₂O).
2. Nhập tên hợp chất bằng tiếng Việt (VD: Nước) hoặc tiếng Anh (VD: Water).
3. Nhấn "Gửi Câu Trả Lời" hoặc Enter để kiểm tra.
4. Đúng: +10 điểm, chuyển sang hợp chất tiếp theo.
5. Sai: Thử lại hoặc dùng gợi ý (phạt 2 điểm).
6. Trò chơi kết thúc khi hết thời gian hoặc đạt số câu trả lời tối đa.

🏆 Mẹo: Nhớ các hợp chất phổ biến và thử cả tên tiếng Việt lẫn tiếng Anh!
    `);
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
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
        await loadCompounds();
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
    compounds,
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
  };
}

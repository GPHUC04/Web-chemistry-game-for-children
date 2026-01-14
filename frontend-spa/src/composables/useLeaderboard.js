import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export function useLeaderboard() {
  const router = useRouter();
  const sessions = ref([]);
  const filteredSessions = ref([]);
  const topPlayers = ref([]);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const errorMessage = ref("");
  const userId = ref(null);

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
      errorMessage.value = "Vui lòng đăng nhập để xem bảng xếp hạng.";
      router.push("/login");
    }
  };

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.get(`${apiUrl}/game-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const data = Array.isArray(response.data.result || response.data)
        ? response.data.result || response.data
        : [];

      sessions.value = data;
      sessions.value.sort((a, b) => b.score - a.score);
      filteredSessions.value = sessions.value;
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
            errorMessage.value = "Không tìm thấy dữ liệu bảng xếp hạng.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Không thể tải bảng xếp hạng.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    }
  };

  const loadTopPlayers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.get(`${apiUrl}/top-players`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const data = Array.isArray(response.data.result || response.data)
        ? response.data.result || response.data
        : [];

      topPlayers.value = data;
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
            errorMessage.value =
              "Không tìm thấy danh sách người chơi xuất sắc.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message ||
              "Không thể tải danh sách người chơi xuất sắc.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    }
  };

  const loadData = async () => {
    checkAuthStatus();
    if (userId.value) {
      await Promise.all([loadSessions(), loadTopPlayers()]);
    }
  };

  const filterSessions = () => {
    const query = searchQuery.value.toLowerCase();
    filteredSessions.value = sessions.value.filter(
      (session) =>
        (session.username && session.username.toLowerCase().includes(query)) ||
        session.user_id.toString().includes(query)
    );
    currentPage.value = 1;
  };

  const truncateUsername = (username) => {
    const maxLength = 15;
    if (username.length > maxLength) {
      return username.substring(0, maxLength - 3) + "...";
    }
    return username;
  };

  const totalPages = computed(() =>
    Math.ceil(filteredSessions.value.length / itemsPerPage)
  );

  const paginatedSessions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredSessions.value.slice(start, end);
  });

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goBack = () => {
    router.push({ name: "Games" });
  };

  const resetError = () => {
    errorMessage.value = "";
  };

  onMounted(loadData);

  return {
    sessions,
    filteredSessions,
    topPlayers,
    searchQuery,
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
}

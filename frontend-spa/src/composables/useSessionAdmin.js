import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useGameSessionsAdmin() {
  const sessions = ref([]);
  const currentSession = ref({
    session_id: null,
    user_id: null,
    game_id: null,
    score: 0,
    time_spent: 0,
    difficulty: "",
    status: "",
    started_at: "",
    completed_at: null,
  });
  const editingSessionId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => {
      const dateA = new Date(a.started_at);
      const dateB = new Date(b.started_at);
      return dateB - dateA;
    });
  });

  const chartData = computed(() => {
    const difficultyCounts = {
      easy: sessions.value.filter((s) => s.difficulty === "easy").length,
      medium: sessions.value.filter((s) => s.difficulty === "medium").length,
      hard: sessions.value.filter((s) => s.difficulty === "hard").length,
      expert: sessions.value.filter((s) => s.difficulty === "expert").length,
    };
    const labels = Object.keys(difficultyCounts).filter(
      (key) => difficultyCounts[key] > 0
    );
    const data = labels.map((key) => difficultyCounts[key]);
    return { labels, data };
  });

  const fetchSessions = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    if (!token) {
      errorMessage.value = "Vui lòng đăng nhập để truy cập.";
      isLoading.value = false;
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/game-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      sessions.value =
        response.data.result ||
        (Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Không có quyền truy cập. Vui lòng đăng nhập lại.";
            break;
          case 404:
            errorMessage.value = "Không tìm thấy dữ liệu phiên chơi.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Lỗi không xác định.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const saveSession = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        user_id: parseInt(currentSession.value.user_id),
        game_id: parseInt(currentSession.value.game_id),
        score: parseInt(currentSession.value.score),
        time_spent: parseInt(currentSession.value.time_spent),
        difficulty: currentSession.value.difficulty || null,
        status: currentSession.value.status || null,
        started_at: currentSession.value.started_at
          ? new Date(currentSession.value.started_at).toISOString()
          : null,
        completed_at: currentSession.value.completed_at
          ? new Date(currentSession.value.completed_at).toISOString()
          : null,
      };

      if (editingSessionId.value) {
        await axios.put(
          `${apiUrl}/game-sessions/${editingSessionId.value}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
      } else {
        await axios.post(`${apiUrl}/game-sessions`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
      }
      await fetchSessions(); // Refetch sessions to ensure latest data
      cancelEdit();
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
            break;
          case 401:
            errorMessage.value =
              "Không có quyền truy cập. Vui lòng đăng nhập lại.";
            break;
          case 404:
            errorMessage.value = "Không tìm thấy phiên chơi.";
            break;
          case 409:
            errorMessage.value = "Phiên chơi đã tồn tại.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Lỗi không xác định.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSession = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phiên chơi này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/game-sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      sessions.value = sessions.value.filter((s) => s.session_id !== id);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Không có quyền truy cập. Vui lòng đăng nhập lại.";
            break;
          case 404:
            errorMessage.value = "Phiên chơi không tồn tại.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Lỗi không xác định.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const showAddForm = () => {
    currentSession.value = {
      session_id: null,
      user_id: null,
      game_id: null,
      score: 0,
      time_spent: 0,
      difficulty: "",
      status: "",
      started_at: "",
      completed_at: null,
    };
    editingSessionId.value = null;
    isFormVisible.value = true;
  };

  const editSession = (session) => {
    currentSession.value = {
      ...session,
      started_at: session.started_at
        ? new Date(session.started_at).toISOString().slice(0, 16)
        : "",
      completed_at: session.completed_at
        ? new Date(session.completed_at).toISOString().slice(0, 16)
        : null,
    };
    editingSessionId.value = session.session_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentSession.value = {
      session_id: null,
      user_id: null,
      game_id: null,
      score: 0,
      time_spent: 0,
      difficulty: "",
      status: "",
      started_at: "",
      completed_at: null,
    };
    editingSessionId.value = null;
  };

  onMounted(fetchSessions);

  return {
    sessions,
    sortedSessions,
    chartData,
    currentSession,
    editingSessionId,
    isFormVisible,
    isLoading,
    errorMessage,
    fetchSessions,
    showAddForm,
    editSession,
    saveSession,
    deleteSession,
    cancelEdit,
  };
}

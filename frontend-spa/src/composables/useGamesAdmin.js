import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useGamesAdmin() {
  const games = ref([]);
  const currentGame = ref({
    game_id: null,
    game_code: "",
    name_vi: "",
    name_en: "",
    description_vi: "",
    description_en: "",
    category: "",
    max_score: 1000,
    time_limit: 300,
    is_active: true,
    game_settings: "",
    updated_at: null,
  });
  const editingGameId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const filteredGames = computed(() => {
    // Sắp xếp theo updated_at giảm dần (mới nhất lên đầu)
    return [...games.value].sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
      return dateB - dateA;
    });
  });

  const fetchGames = async () => {
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
      const response = await axios.get(`${apiUrl}/games`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      games.value =
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
            errorMessage.value = "Không tìm thấy dữ liệu game.";
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

  const saveGame = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        game_code: currentGame.value.game_code,
        name_vi: currentGame.value.name_vi,
        name_en: currentGame.value.name_en,
        description_vi: currentGame.value.description_vi || null,
        description_en: currentGame.value.description_en || null,
        category: currentGame.value.category,
        max_score: parseInt(currentGame.value.max_score),
        time_limit: parseInt(currentGame.value.time_limit),
        is_active: currentGame.value.is_active,
        game_settings: currentGame.value.game_settings || null,
      };

      let updatedGame;
      if (editingGameId.value) {
        const response = await axios.put(
          `${apiUrl}/games/${editingGameId.value}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
        updatedGame = {
          ...response.data.result,
          updated_at:
            response.data.result.updated_at || new Date().toISOString(),
        };
        // Cập nhật danh sách: đưa game vừa sửa lên đầu
        games.value = [
          updatedGame,
          ...games.value.filter((g) => g.game_id !== editingGameId.value),
        ];
      } else {
        const response = await axios.post(`${apiUrl}/games`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
        updatedGame = {
          ...response.data.result,
          updated_at:
            response.data.result.updated_at || new Date().toISOString(),
        };
        // Thêm game mới vào đầu danh sách
        games.value = [updatedGame, ...games.value];
      }
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
          case 409:
            errorMessage.value = "Mã game đã tồn tại.";
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

  const deleteGame = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa game này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      games.value = games.value.filter((g) => g.game_id !== id);
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
            errorMessage.value = "Game không tồn tại.";
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
    currentGame.value = {
      game_id: null,
      game_code: "",
      name_vi: "",
      name_en: "",
      description_vi: "",
      description_en: "",
      category: "",
      max_score: 1000,
      time_limit: 300,
      is_active: true,
      game_settings: "",
      updated_at: null,
    };
    editingGameId.value = null;
    isFormVisible.value = true;
  };

  const editGame = (game) => {
    currentGame.value = { ...game, updated_at: game.updated_at || null };
    editingGameId.value = game.game_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentGame.value = {
      game_id: null,
      game_code: "",
      name_vi: "",
      name_en: "",
      description_vi: "",
      description_en: "",
      category: "",
      max_score: 1000,
      time_limit: 300,
      is_active: true,
      game_settings: "",
      updated_at: null,
    };
    editingGameId.value = null;
  };

  onMounted(fetchGames);

  return {
    games,
    filteredGames,
    currentGame,
    editingGameId,
    isFormVisible,
    isLoading,
    errorMessage,
    showAddForm,
    editGame,
    saveGame,
    deleteGame,
    cancelEdit,
  };
}

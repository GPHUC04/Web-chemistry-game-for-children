import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useCrosswordPuzzlesAdmin() {
  const puzzles = ref([]);
  const filteredPuzzles = ref([]);
  const currentPuzzle = ref({
    puzzle_id: null,
    created_by: null,
    title_vi: "",
    title_en: "",
    grid_data: "",
    clues_across: "",
    clues_down: "",
    solution: "",
    difficulty_level: "",
    grid_size: 15,
    is_public: false,
    is_approved: false,
    times_played: 0,
    average_rating: 0,
  });
  const editingPuzzleId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const searchTitle = ref("");

  const chartData = computed(() => {
    const difficultyCounts = {
      easy: puzzles.value.filter((p) => p.difficulty_level === "easy").length,
      medium: puzzles.value.filter((p) => p.difficulty_level === "medium")
        .length,
      hard: puzzles.value.filter((p) => p.difficulty_level === "hard").length,
      expert: puzzles.value.filter((p) => p.difficulty_level === "expert")
        .length,
    };
    const labels = Object.keys(difficultyCounts).filter(
      (key) => difficultyCounts[key] > 0
    );
    const data = labels.map((key) => difficultyCounts[key]);
    return { labels, data };
  });

  const fetchPuzzles = async () => {
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
      const response = await axios.get(`${apiUrl}/crossword-puzzles`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      puzzles.value =
        response.data.result ||
        (Array.isArray(response.data) ? response.data : []);
      filteredPuzzles.value = [...puzzles.value];
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
            errorMessage.value = "Không tìm thấy dữ liệu ô chữ.";
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

  const filterPuzzles = () => {
    filteredPuzzles.value = puzzles.value.filter((puzzle) =>
      puzzle.title_vi.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
  };

  const showAddForm = () => {
    currentPuzzle.value = {
      puzzle_id: null,
      created_by: null,
      title_vi: "",
      title_en: "",
      grid_data: "",
      clues_across: "",
      clues_down: "",
      solution: "",
      difficulty_level: "",
      grid_size: 15,
      is_public: false,
      is_approved: false,
      times_played: 0,
      average_rating: 0,
    };
    editingPuzzleId.value = null;
    isFormVisible.value = true;
  };

  const editPuzzle = (puzzle) => {
    currentPuzzle.value = { ...puzzle };
    editingPuzzleId.value = puzzle.puzzle_id;
    isFormVisible.value = true;
  };

  const savePuzzle = async () => {
    isLoading.value = true;
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const method = editingPuzzleId.value ? "put" : "post";
      const url = editingPuzzleId.value
        ? `${apiUrl}/crossword-puzzles/${editingPuzzleId.value}`
        : `${apiUrl}/crossword-puzzles`;

      await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: currentPuzzle.value,
      });

      await fetchPuzzles();
      isFormVisible.value = false;
    } catch (error) {
      errorMessage.value =
        error.response?.data?.message || "Lỗi khi lưu ô chữ.";
    } finally {
      isLoading.value = false;
    }
  };

  const deletePuzzle = async (puzzleId) => {
    if (confirm("Bạn có chắc chắn muốn xóa ô chữ này?")) {
      isLoading.value = true;
      try {
        const token = localStorage.getItem("authToken");
        const apiUrl =
          process.env.API_URL ||
          "https://ct313hm01-project-gphuc04.onrender.com";
        await axios.delete(`${apiUrl}/crossword-puzzles/${puzzleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchPuzzles();
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || "Lỗi khi xóa ô chữ.";
      } finally {
        isLoading.value = false;
      }
    }
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
  };

  onMounted(fetchPuzzles);

  return {
    puzzles,
    filteredPuzzles,
    currentPuzzle,
    editingPuzzleId,
    isFormVisible,
    isLoading,
    errorMessage,
    searchTitle,
    chartData,
    showAddForm,
    editPuzzle,
    savePuzzle,
    deletePuzzle,
    cancelEdit,
    filterPuzzles,
  };
}

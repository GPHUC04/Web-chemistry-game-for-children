import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useReactionsAdmin() {
  const reactions = ref([]);
  const currentReaction = ref({
    reaction_id: null,
    equation: "",
    reactants: "",
    products: "",
    reaction_type: "",
    conditions: "",
    description_vi: "",
    description_en: "",
    difficulty_level: "",
    is_balanced: true,
    energy_change: null,
    updated_at: null,
  });
  const editingReactionId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const searchEquation = ref("");

  const filteredReactions = computed(() => {
    const filtered = searchEquation.value
      ? reactions.value.filter((reaction) =>
          reaction.equation
            .toLowerCase()
            .includes(searchEquation.value.toLowerCase())
        )
      : reactions.value;
    // Sắp xếp theo updated_at giảm dần (mới nhất lên đầu)
    return [...filtered].sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
      return dateB - dateA;
    });
  });

  const fetchReactions = async () => {
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
      const response = await axios.get(`${apiUrl}/chemical-reactions`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      reactions.value =
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
            errorMessage.value = "Không tìm thấy dữ liệu phản ứng.";
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

  const saveReaction = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        equation: currentReaction.value.equation,
        reactants: currentReaction.value.reactants || null,
        products: currentReaction.value.products || null,
        reaction_type: currentReaction.value.reaction_type || null,
        conditions: currentReaction.value.conditions || null,
        description_vi: currentReaction.value.description_vi || null,
        description_en: currentReaction.value.description_en || null,
        difficulty_level: currentReaction.value.difficulty_level || null,
        is_balanced: currentReaction.value.is_balanced,
        energy_change: currentReaction.value.energy_change || null,
      };

      let updatedReaction;
      if (editingReactionId.value) {
        const response = await axios.put(
          `${apiUrl}/chemical-reactions/${editingReactionId.value}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
        updatedReaction = {
          ...response.data.result,
          updated_at:
            response.data.result.updated_at || new Date().toISOString(),
        };
        // Cập nhật danh sách: đưa phản ứng vừa sửa lên đầu
        reactions.value = [
          updatedReaction,
          ...reactions.value.filter(
            (r) => r.reaction_id !== editingReactionId.value
          ),
        ];
      } else {
        const response = await axios.post(
          `${apiUrl}/chemical-reactions`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
        updatedReaction = {
          ...response.data.result,
          updated_at:
            response.data.result.updated_at || new Date().toISOString(),
        };
        // Thêm phản ứng mới vào đầu danh sách
        reactions.value = [updatedReaction, ...reactions.value];
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
            errorMessage.value = "Phương trình phản ứng đã tồn tại.";
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

  const deleteReaction = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phản ứng này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/chemical-reactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      reactions.value = reactions.value.filter((r) => r.reaction_id !== id);
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
            errorMessage.value = "Phản ứng không tồn tại.";
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
    currentReaction.value = {
      reaction_id: null,
      equation: "",
      reactants: "",
      products: "",
      reaction_type: "",
      conditions: "",
      description_vi: "",
      description_en: "",
      difficulty_level: "",
      is_balanced: true,
      energy_change: null,
      updated_at: null,
    };
    editingReactionId.value = null;
    isFormVisible.value = true;
  };

  const editReaction = (reaction) => {
    currentReaction.value = {
      ...reaction,
      updated_at: reaction.updated_at || null,
    };
    editingReactionId.value = reaction.reaction_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentReaction.value = {
      reaction_id: null,
      equation: "",
      reactants: "",
      products: "",
      reaction_type: "",
      conditions: "",
      description_vi: "",
      description_en: "",
      difficulty_level: "",
      is_balanced: true,
      energy_change: null,
      updated_at: null,
    };
    editingReactionId.value = null;
  };

  const filterReactions = () => {
    // Trigger re-computation of filteredReactions
  };

  onMounted(fetchReactions);

  return {
    reactions,
    filteredReactions,
    currentReaction,
    editingReactionId,
    isFormVisible,
    isLoading,
    errorMessage,
    searchEquation,
    showAddForm,
    editReaction,
    saveReaction,
    deleteReaction,
    cancelEdit,
    filterReactions,
  };
}

import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useCompoundsAdmin() {
  const compounds = ref([]);
  const currentCompound = ref({
    compound_id: null,
    formula: "",
    name_vi: "",
    name_en: "",
    molecular_mass: null,
    structure_info: "",
    properties: "",
    uses: "",
    compound_type: "",
    difficulty_level: "",
    image_url: "",
  });
  const editingCompoundId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const searchFormula = ref("");

  const filteredCompounds = computed(() => {
    if (!searchFormula.value) return compounds.value;
    return compounds.value.filter((compound) =>
      compound.formula.toLowerCase().includes(searchFormula.value.toLowerCase())
    );
  });

  const fetchCompounds = async () => {
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
      const response = await axios.get(`${apiUrl}/compounds`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      compounds.value =
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
            errorMessage.value = "Không tìm thấy dữ liệu hợp chất.";
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

  const saveCompound = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        formula: currentCompound.value.formula,
        name_vi: currentCompound.value.name_vi,
        name_en: currentCompound.value.name_en,
        molecular_mass: currentCompound.value.molecular_mass || null,
        structure_info: currentCompound.value.structure_info || null,
        properties: currentCompound.value.properties || null,
        uses: currentCompound.value.uses || null,
        compound_type: currentCompound.value.compound_type || null,
        difficulty_level: currentCompound.value.difficulty_level || null,
        image_url: currentCompound.value.image_url || null,
      };

      if (editingCompoundId.value) {
        await axios.put(
          `${apiUrl}/compounds/${editingCompoundId.value}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
      } else {
        await axios.post(`${apiUrl}/compounds`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
      }
      await fetchCompounds();
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
            errorMessage.value = "Công thức hợp chất đã tồn tại.";
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

  const deleteCompound = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa hợp chất này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/compounds/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      await fetchCompounds();
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
            errorMessage.value = "Hợp chất không tồn tại.";
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
    currentCompound.value = {
      compound_id: null,
      formula: "",
      name_vi: "",
      name_en: "",
      molecular_mass: null,
      structure_info: "",
      properties: "",
      uses: "",
      compound_type: "",
      difficulty_level: "",
      image_url: "",
    };
    editingCompoundId.value = null;
    isFormVisible.value = true;
  };

  const editCompound = (compound) => {
    currentCompound.value = { ...compound };
    editingCompoundId.value = compound.compound_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentCompound.value = {
      compound_id: null,
      formula: "",
      name_vi: "",
      name_en: "",
      molecular_mass: null,
      structure_info: "",
      properties: "",
      uses: "",
      compound_type: "",
      difficulty_level: "",
      image_url: "",
    };
    editingCompoundId.value = null;
  };

  const filterCompounds = () => {
    // Trigger re-computation of filteredCompounds
  };

  onMounted(fetchCompounds);

  return {
    compounds,
    filteredCompounds,
    currentCompound,
    editingCompoundId,
    isFormVisible,
    isLoading,
    errorMessage,
    searchFormula,
    showAddForm,
    editCompound,
    saveCompound,
    deleteCompound,
    cancelEdit,
    filterCompounds,
  };
}

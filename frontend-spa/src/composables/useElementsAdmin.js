import { ref, computed, onMounted } from "vue";
import axios from "axios";

export function useElementsAdmin() {
  const elements = ref([]);
  const currentElement = ref({
    element_id: null,
    symbol: "",
    name_en: "",
    atomic_number: 1,
    atomic_mass: 0.0,
    group_number: null,
    period_number: null,
    electron_configuration: "",
    properties: "",
    applications: "",
    category: "",
    updated_at: null,
  });
  const editingElementId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const searchSymbol = ref("");

  const filteredElements = computed(() => {
    if (!searchSymbol.value) {
      return [...elements.value].sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
        const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
        return dateB - dateA;
      });
    }
    return elements.value
      .filter((element) =>
        element.symbol.toLowerCase().includes(searchSymbol.value.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
        const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
        return dateB - dateA;
      });
  });

  const fetchElements = async () => {
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
      const response = await axios.get(`${apiUrl}/elements`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      elements.value =
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
            errorMessage.value = "Không tìm thấy dữ liệu nguyên tố.";
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

  const saveElement = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        symbol: currentElement.value.symbol,
        name_en: currentElement.value.name_en,
        atomic_number: parseInt(currentElement.value.atomic_number),
        atomic_mass: parseFloat(currentElement.value.atomic_mass),
        group_number: currentElement.value.group_number || null,
        period_number: currentElement.value.period_number || null,
        electron_configuration:
          currentElement.value.electron_configuration || null,
        properties: currentElement.value.properties || null,
        applications: currentElement.value.applications || null,
        category: currentElement.value.category || null,
      };

      if (editingElementId.value) {
        await axios.put(
          `${apiUrl}/elements/${editingElementId.value}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
      } else {
        await axios.post(`${apiUrl}/elements`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
      }
      await fetchElements(); // Refetch elements to ensure latest data
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
            errorMessage.value = "Ký hiệu nguyên tố đã tồn tại.";
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

  const deleteElement = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa nguyên tố này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/elements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      elements.value = elements.value.filter((e) => e.element_id !== id);
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
            errorMessage.value = "Nguyên tố không tồn tại.";
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
    currentElement.value = {
      element_id: null,
      symbol: "",
      name_en: "",
      atomic_number: 1,
      atomic_mass: 0.0,
      group_number: null,
      period_number: null,
      electron_configuration: "",
      properties: "",
      applications: "",
      category: "",
      updated_at: null,
    };
    editingElementId.value = null;
    isFormVisible.value = true;
  };

  const editElement = (element) => {
    currentElement.value = {
      ...element,
      updated_at: element.updated_at || null,
    };
    editingElementId.value = element.element_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentElement.value = {
      element_id: null,
      symbol: "",
      name_en: "",
      atomic_number: 1,
      atomic_mass: 0.0,
      group_number: null,
      period_number: null,
      electron_configuration: "",
      properties: "",
      applications: "",
      category: "",
      updated_at: null,
    };
    editingElementId.value = null;
  };

  const filterElements = () => {
    // Trigger re-computation of filteredElements
  };

  onMounted(fetchElements);

  return {
    elements,
    filteredElements,
    currentElement,
    editingElementId,
    isFormVisible,
    isLoading,
    errorMessage,
    searchSymbol,
    showAddForm,
    editElement,
    saveElement,
    deleteElement,
    cancelEdit,
    filterElements,
  };
}

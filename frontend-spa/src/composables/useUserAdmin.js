import { ref, onMounted } from "vue";
import axios from "axios";

export function useUsersAdmin() {
  const users = ref([]);
  const currentUser = ref({
    user_id: null,
    username: "",
    email: "",
    password: "",
    date_of_birth: null,
    school: null,
    grade_level: "",
    total_score: 0,
    total_games_played: 0,
    level: 1,
    experience_points: 0,
    is_active: true,
    preferred_language: "vi",
  });
  const editingUserId = ref(null);
  const isFormVisible = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const fetchUsers = async () => {
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
      const response = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      users.value =
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
            errorMessage.value = "Không tìm thấy dữ liệu người dùng.";
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

  const saveUser = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      const payload = {
        username: currentUser.value.username,
        email: currentUser.value.email,
        date_of_birth: currentUser.value.date_of_birth || null,
        school: currentUser.value.school || null,
        grade_level: currentUser.value.grade_level || null,
        total_score: parseInt(currentUser.value.total_score) || 0,
        total_games_played: parseInt(currentUser.value.total_games_played) || 0,
        level: parseInt(currentUser.value.level) || 1,
        experience_points: parseInt(currentUser.value.experience_points) || 0,
        is_active: currentUser.value.is_active,
        preferred_language: currentUser.value.preferred_language || "vi",
      };
      if (!editingUserId.value) {
        payload.password = currentUser.value.password;
      }

      if (editingUserId.value) {
        await axios.put(`${apiUrl}/users/${editingUserId.value}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
      } else {
        await axios.post(`${apiUrl}/users`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
      }
      await fetchUsers();
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
            errorMessage.value = "Tên đăng nhập hoặc email đã tồn tại.";
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

  const deleteUser = async (id) => {
    const user = users.value.find((u) => u.user_id === id);
    if (user && user.email === "admin@gmail.com") {
      errorMessage.value = "Không thể xóa tài khoản admin.";
      return;
    }

    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    isLoading.value = true;
    errorMessage.value = "";
    const token = localStorage.getItem("authToken");
    const apiUrl =
      process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";

    try {
      await axios.delete(`${apiUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      users.value = users.value.filter((u) => u.user_id !== id);
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
            errorMessage.value = "Người dùng không tồn tại.";
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
    currentUser.value = {
      user_id: null,
      username: "",
      email: "",
      password: "",
      date_of_birth: null,
      school: null,
      grade_level: "",
      total_score: 0,
      total_games_played: 0,
      level: 1,
      experience_points: 0,
      is_active: true,
      preferred_language: "vi",
    };
    editingUserId.value = null;
    isFormVisible.value = true;
  };

  const editUser = (user) => {
    currentUser.value = {
      user_id: user.user_id,
      username: user.username || "",
      email: user.email,
      password: "",
      date_of_birth: user.date_of_birth
        ? new Date(user.date_of_birth).toISOString().split("T")[0]
        : null,
      school: user.school || null,
      grade_level: user.grade_level || "",
      total_score: user.total_score || 0,
      total_games_played: user.total_games_played || 0,
      level: user.level || 1,
      experience_points: user.experience_points || 0,
      is_active: user.is_active !== undefined ? user.is_active : true,
      preferred_language: user.preferred_language || "vi",
    };
    editingUserId.value = user.user_id;
    isFormVisible.value = true;
  };

  const cancelEdit = () => {
    isFormVisible.value = false;
    currentUser.value = {
      user_id: null,
      username: "",
      email: "",
      password: "",
      date_of_birth: null,
      school: null,
      grade_level: "",
      total_score: 0,
      total_games_played: 0,
      level: 1,
      experience_points: 0,
      is_active: true,
      preferred_language: "vi",
    };
    editingUserId.value = null;
  };

  onMounted(fetchUsers);

  return {
    users,
    currentUser,
    editingUserId,
    isFormVisible,
    isLoading,
    errorMessage,
    fetchUsers,
    showAddForm,
    editUser,
    saveUser,
    deleteUser,
    cancelEdit,
  };
}

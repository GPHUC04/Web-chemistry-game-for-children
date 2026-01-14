import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export function useHomePage() {
  const router = useRouter();
  const isLoggedIn = ref(false);
  const userInfo = ref(null);
  const loading = ref(false);
  const errorMessage = ref("");

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

  const loadUserInfo = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      isLoggedIn.value = false;
      userInfo.value = null;
      errorMessage.value = "Vui lòng đăng nhập để xem thông tin cá nhân.";
      router.push("/login");
      return;
    }

    loading.value = true;
    errorMessage.value = "";

    try {
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.get(`${apiUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      isLoggedIn.value = true;
      userInfo.value = response.data.result || response.data;
    } catch (error) {
      isLoggedIn.value = false;
      userInfo.value = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");

      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value =
              "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            break;
          case 404:
            errorMessage.value = "Không tìm thấy thông tin người dùng.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message ||
              "Không thể tải thông tin người dùng.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
      router.push("/login");
    } finally {
      loading.value = false;
    }
  };

  const retryLoadUserInfo = async () => {
    errorMessage.value = "";
    await loadUserInfo();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatGradeLevel = (grade) => {
    if (!grade) return "N/A";
    const gradeMap = {
      1: "Lớp 1",
      2: "Lớp 2",
      3: "Lớp 3",
      4: "Lớp 4",
      5: "Lớp 5",
      6: "Lớp 6",
      7: "Lớp 7",
      8: "Lớp 8",
      9: "Lớp 9",
      10: "Lớp 10",
      11: "Lớp 11",
      12: "Lớp 12",
      university: "Đại học",
      other: "Khác",
    };
    return gradeMap[grade] || "N/A";
  };

  const formatLanguage = (lang) => {
    if (!lang) return "N/A";
    const langMap = {
      vi: "Tiếng Việt",
      en: "Tiếng Anh",
    };
    return langMap[lang] || "N/A";
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const goToGames = () => {
    router.push({ name: "games" });
  };

  onMounted(loadUserInfo);

  return {
    isLoggedIn,
    userInfo,
    loading,
    errorMessage,
    getRandomFormula,
    formatDate,
    formatGradeLevel,
    formatLanguage,
    loadUserInfo,
    retryLoadUserInfo,
    goToLogin,
    goToGames,
  };
}

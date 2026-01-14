import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export function useAuth() {
  const router = useRouter();
  const isRegister = ref(false);
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const date_of_birth = ref("");
  const grade_level = ref("");
  const preferred_language = ref("vi");
  const showPassword = ref(false);
  const rememberMe = ref(false);
  const acceptTerms = ref(false);
  const isLoading = ref(false);
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

  const handleLogin = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = "Vui lòng nhập đầy đủ email và mật khẩu";
      return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.post(
        `${apiUrl}/user/login`,
        {
          email: email.value,
          password: password.value,
        },
        {
          timeout: 10000,
        }
      );

      const { token, user } = response.data.result || response.data;

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.user_id.toString());
        localStorage.setItem("userData", JSON.stringify(user));

        if (rememberMe.value) {
          localStorage.setItem("userEmail", user.email);
        }

        if (
          email.value === "admin@gmail.com" &&
          password.value === "admin123@"
        ) {
          router.push("/admin");
        } else {
          router.push("/homepage");
        }
      } else {
        errorMessage.value = "Email hoặc mật khẩu không đúng.";
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage.value = "Email hoặc mật khẩu không đúng.";
            break;
          case 404:
            errorMessage.value = "Không tìm thấy tài khoản.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Đăng nhập thất bại.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleRegister = async () => {
    if (!email.value || !password.value || !confirmPassword.value) {
      errorMessage.value = "Vui lòng nhập đầy đủ email và mật khẩu";
      return;
    }

    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Mật khẩu xác nhận không khớp";
      return;
    }

    if (!acceptTerms.value) {
      errorMessage.value = "Vui lòng đồng ý với điều khoản sử dụng";
      return;
    }

    if (email.value.length > 100) {
      errorMessage.value = "Email không được vượt quá 100 ký tự";
      return;
    }

    if (
      date_of_birth.value &&
      !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth.value)
    ) {
      errorMessage.value = "Ngày sinh phải đúng định dạng YYYY-MM-DD";
      return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const response = await axios.post(
        `${apiUrl}/user/register`,
        {
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
          date_of_birth: date_of_birth.value || null,
          grade_level: grade_level.value || null,
          preferred_language: preferred_language.value,
        },
        {
          timeout: 10000,
        }
      );

      const { token, user } = response.data.result || response.data;

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.user_id.toString());
        localStorage.setItem("userData", JSON.stringify(user));
        if (rememberMe.value) {
          localStorage.setItem("userEmail", user.email);
        }

        router.push("/homepage");
      } else {
        isRegister.value = false;
        errorMessage.value = "Đăng ký thành công! Vui lòng đăng nhập.";
        resetForm();
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        errorMessage.value = "Yêu cầu quá thời gian. Vui lòng thử lại.";
      } else if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage.value = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
            break;
          case 409:
            errorMessage.value = "Email đã được sử dụng.";
            break;
          case 500:
            errorMessage.value = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage.value =
              error.response?.data?.message || "Đăng ký thất bại.";
        }
      } else {
        errorMessage.value = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleForm = () => {
    isRegister.value = !isRegister.value;
    resetForm();
  };

  const resetForm = () => {
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    date_of_birth.value = "";
    grade_level.value = "";
    preferred_language.value = "vi";
    rememberMe.value = false;
    acceptTerms.value = false;
    showPassword.value = false;
    errorMessage.value = "";
  };

  const resetError = () => {
    errorMessage.value = "";
  };

  return {
    isRegister,
    email,
    password,
    confirmPassword,
    date_of_birth,
    grade_level,
    preferred_language,
    showPassword,
    rememberMe,
    acceptTerms,
    isLoading,
    errorMessage,
    getRandomFormula,
    handleLogin,
    handleRegister,
    togglePassword,
    toggleForm,
    resetError,
  };
}

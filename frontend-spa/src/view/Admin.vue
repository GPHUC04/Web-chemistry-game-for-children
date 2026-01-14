<template>
  <div class="admin-container">
    <!-- Background decorative elements -->
    <div class="background-overlay">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <!-- Admin content -->
    <aside class="admin-sidebar">
      <AppAdminNavbar />
    </aside>

    <main class="users-admin-content">
      <div class="content-card">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-message">Đang tải dữ liệu...</div>

        <!-- Error message display -->
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <h2>Quản Lý Người Dùng</h2>

        <!-- Form thêm/sửa người dùng -->
        <div class="form-container" v-if="isFormVisible">
          <form @submit.prevent="saveUser" class="user-form">
            <div class="form-group">
              <label for="username">Tên Đăng Nhập:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentUser.username"
                  id="username"
                  type="text"
                  required
                  :disabled="isLoading"
                  maxlength="50"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-user"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentUser.email"
                  id="email"
                  type="email"
                  required
                  :disabled="isLoading"
                  maxlength="100"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-envelope"></i></span>
              </div>
            </div>
            <div class="form-group" v-if="!editingUserId">
              <label for="password">Mật Khẩu:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentUser.password"
                  id="password"
                  type="password"
                  required
                  :disabled="isLoading"
                  minlength="6"
                  maxlength="255"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-lock"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Ngày Sinh:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentUser.date_of_birth"
                  id="dateOfBirth"
                  type="date"
                  :disabled="isLoading"
                  class="form-input"
                />
                <span class="input-icon"
                  ><i class="fas fa-calendar-alt"></i
                ></span>
              </div>
            </div>
            <div class="form-group">
              <label for="school">Trường Học:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentUser.school"
                  id="school"
                  type="text"
                  :disabled="isLoading"
                  maxlength="100"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-school"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="gradeLevel">Cấp Học:</label>
              <div class="input-wrapper">
                <select
                  v-model="currentUser.grade_level"
                  id="gradeLevel"
                  :disabled="isLoading"
                  class="form-input"
                >
                  <option value="" disabled>Chọn cấp học</option>
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                  <option value="university">Đại học</option>
                  <option value="other">Khác</option>
                </select>
                <span class="input-icon"
                  ><i class="fas fa-graduation-cap"></i
                ></span>
              </div>
            </div>
            <div class="form-group">
              <label for="totalScore">Tổng Điểm:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentUser.total_score"
                  id="totalScore"
                  type="number"
                  :disabled="isLoading"
                  min="0"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-star"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="totalGamesPlayed">Tổng Số Trò Chơi:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentUser.total_games_played"
                  id="totalGamesPlayed"
                  type="number"
                  :disabled="isLoading"
                  min="0"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-gamepad"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="level">Cấp Độ:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentUser.level"
                  id="level"
                  type="number"
                  :disabled="isLoading"
                  min="1"
                  class="form-input"
                />
                <span class="input-icon"
                  ><i class="fas fa-level-up-alt"></i
                ></span>
              </div>
            </div>
            <div class="form-group">
              <label for="experiencePoints">Điểm Kinh Nghiệm:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentUser.experience_points"
                  id="experiencePoints"
                  type="number"
                  :disabled="isLoading"
                  min="0"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-trophy"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="isActive">Trạng Thái Hoạt Động:</label>
              <div class="input-wrapper">
                <select
                  v-model="currentUser.is_active"
                  id="isActive"
                  :disabled="isLoading"
                  class="form-input"
                >
                  <option :value="true">Hoạt động</option>
                  <option :value="false">Không hoạt động</option>
                </select>
                <span class="input-icon"><i class="fas fa-toggle-on"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="preferredLanguage">Ngôn Ngữ Ưa Thích:</label>
              <div class="input-wrapper">
                <select
                  v-model="currentUser.preferred_language"
                  id="preferredLanguage"
                  :disabled="isLoading"
                  class="form-input"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">Tiếng Anh</option>
                </select>
                <span class="input-icon"><i class="fas fa-language"></i></span>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isLoading" class="submit-button">
                {{ editingUserId ? "Cập Nhật" : "Thêm Mới" }}
              </button>
              <button
                type="button"
                @click="cancelEdit"
                :disabled="isLoading"
                class="cancel-button"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        <!-- Danh sách người dùng -->
        <div class="table-container">
          <button @click="showAddForm" class="add-button" :disabled="isLoading">
            Thêm Người Dùng Mới
          </button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Đăng Nhập</th>
                <th>Email</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.user_id">
                <td>{{ user.user_id }}</td>
                <td>{{ user.username || "N/A" }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <button
                    @click="editUser(user)"
                    :disabled="isLoading"
                    class="edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteUser(user.user_id)"
                    :disabled="isLoading"
                    class="delete-button"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              <tr v-if="!users.length && !errorMessage && !isLoading">
                <td colspan="4" class="no-data">Không có dữ liệu người dùng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useUsersAdmin } from "../composables/useUserAdmin";
import AppAdminNavbar from "../components/AdminNavbar.vue";

export default {
  name: "UsersAdmin",
  components: {
    AppAdminNavbar,
  },
  setup() {
    const {
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
    } = useUsersAdmin();

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
  },
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  margin-top: -3%;
}

.background-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 70%;
  right: 15%;
  animation-delay: 3s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  top: 35%;
  left: 80%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

.admin-sidebar {
  width: 250px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.users-admin-content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.content-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  padding: 24px;
  animation: slideUp 0.5s ease-out;
  margin-top: -5%;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  font-family: "Poppins", sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #6e08dc;
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  margin-bottom: 20px;
}

.user-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: #4b5563;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1.5px solid #e1e8ed;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  color: #667eea;
  z-index: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
}

.submit-button,
.cancel-button,
.add-button {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button,
.delete-button {
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d9f6d 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.cancel-button {
  background: #e5e7eb;
  color: #1f2937;
}

.cancel-button:hover:not(:disabled) {
  background: #d1d5db;
  transform: translateY(-1px);
}

.add-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 20px;
}

.add-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f6ef7 0%, #6c5ce7 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  margin-right: 5px;
}

.edit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e5940a 0%, #c27a05 100%);
}

.delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.delete-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e53e3e 0%, #b91c1c 100%);
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.table-container {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

tr:hover {
  background: rgba(102, 126, 234, 0.1);
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
}

.error-message {
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
  background: rgba(229, 62, 62, 0.1);
  padding: 8px;
  border-radius: 8px;
}

.loading-message {
  color: #667eea;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px;
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    margin-bottom: 20px;
  }

  .users-admin-content {
    margin-left: 0;
    padding: 10px;
  }

  .content-card {
    max-width: 100%;
    padding: 16px;
  }

  table {
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 8px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-button,
  .cancel-button,
  .add-button,
  .edit-button,
  .delete-button {
    width: 100%;
  }

  .user-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }

  table {
    font-size: 0.8rem;
  }

  .content-card {
    padding: 12px;
  }

  .form-group {
    gap: 3px;
  }

  .form-input {
    padding: 11px 14px 11px 38px;
    font-size: 14px;
  }

  .input-icon {
    left: 12px;
    font-size: 15px;
  }

  .edit-button,
  .delete-button {
    padding: 5px 8px;
    font-size: 13px;
  }
}
</style>

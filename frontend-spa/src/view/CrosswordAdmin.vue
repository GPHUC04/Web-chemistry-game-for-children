<template>
  <div class="admin-container">
    <!-- Admin content -->
    <aside class="admin-sidebar">
      <AppAdminNavbar />
    </aside>

    <main class="crossword-admin-content">
      <div class="content-card">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-message">Đang tải dữ liệu...</div>

        <!-- Error message display -->
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <h2>Quản Lý Ô Chữ Hóa Học</h2>

        <!-- Ô tìm kiếm -->
        <div class="search-container">
          <div class="input-wrapper">
            <input
              v-model="searchTitle"
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              @input="filterPuzzles"
              :disabled="isLoading"
              maxlength="100"
              class="form-input"
            />
            <span class="input-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Form thêm/sửa ô chữ -->
        <div class="form-container" v-if="isFormVisible">
          <form @submit.prevent="savePuzzle" class="puzzle-form">
            <div class="form-group">
              <label for="createdBy">Người Tạo (User ID):</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentPuzzle.created_by"
                  id="createdBy"
                  type="number"
                  :disabled="isLoading || editingPuzzleId"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-user"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="titleVi">Tiêu Đề (VI):</label>
              <div class="input-wrapper">
                <input
                  v-model="currentPuzzle.title_vi"
                  id="titleVi"
                  type="text"
                  required
                  :disabled="isLoading"
                  maxlength="100"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-language"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="titleEn">Tiêu Đề (EN):</label>
              <div class="input-wrapper">
                <input
                  v-model="currentPuzzle.title_en"
                  id="titleEn"
                  type="text"
                  required
                  :disabled="isLoading"
                  maxlength="100"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-language"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="gridData">Dữ Liệu Lưới:</label>
              <textarea
                v-model="currentPuzzle.grid_data"
                id="gridData"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="cluesAcross">Gợi Ý Hàng Ngang:</label>
              <textarea
                v-model="currentPuzzle.clues_across"
                id="cluesAcross"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="cluesDown">Gợi Ý Hàng Dọc:</label>
              <textarea
                v-model="currentPuzzle.clues_down"
                id="cluesDown"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="solution">Đáp Án:</label>
              <textarea
                v-model="currentPuzzle.solution"
                id="solution"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="difficultyLevel">Mức Độ Khó:</label>
              <div class="input-wrapper">
                <select
                  v-model="currentPuzzle.difficulty_level"
                  id="difficultyLevel"
                  :disabled="isLoading"
                  class="form-input"
                >
                  <option value="" disabled>Chọn mức độ</option>
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                  <option value="expert">Chuyên gia</option>
                </select>
                <span class="input-icon"
                  ><i class="fas fa-level-up-alt"></i
                ></span>
              </div>
            </div>
            <div class="form-group">
              <label for="gridSize">Kích Thước Lưới:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentPuzzle.grid_size"
                  id="gridSize"
                  type="number"
                  :disabled="isLoading"
                  min="1"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-th"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="isPublic">Công Khai:</label>
              <input
                v-model="currentPuzzle.is_public"
                id="isPublic"
                type="checkbox"
                :disabled="isLoading"
                class="form-checkbox"
              />
            </div>
            <div class="form-group">
              <label for="isApproved">Đã Duyệt:</label>
              <input
                v-model="currentPuzzle.is_approved"
                id="isApproved"
                type="checkbox"
                :disabled="isLoading"
                class="form-checkbox"
              />
            </div>
            <div class="form-group">
              <label for="timesPlayed">Số Lần Chơi:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentPuzzle.times_played"
                  id="timesPlayed"
                  type="number"
                  :disabled="isLoading"
                  min="0"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-play"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="averageRating">Đánh Giá Trung Bình:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentPuzzle.average_rating"
                  id="averageRating"
                  type="number"
                  step="0.01"
                  :disabled="isLoading"
                  min="0"
                  max="5"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-star"></i></span>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isLoading" class="submit-button">
                {{ editingPuzzleId ? "Cập Nhật" : "Thêm Mới" }}
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

        <!-- Danh sách ô chữ -->
        <div class="table-container">
          <button @click="showAddForm" class="add-button" :disabled="isLoading">
            Thêm Ô Chữ Mới
          </button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu Đề (VI)</th>
                <th>Tiêu Đề (EN)</th>
                <th>Mức Độ</th>
                <th>Kích Thước</th>
                <th>Số Lần Chơi</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="puzzle in filteredPuzzles" :key="puzzle.puzzle_id">
                <td>{{ puzzle.puzzle_id }}</td>
                <td>{{ puzzle.title_vi }}</td>
                <td>{{ puzzle.title_en }}</td>
                <td>{{ puzzle.difficulty_level || "-" }}</td>
                <td>{{ puzzle.grid_size || "15" }}</td>
                <td>{{ puzzle.times_played || "0" }}</td>
                <td>
                  <button
                    @click="editPuzzle(puzzle)"
                    :disabled="isLoading"
                    class="edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deletePuzzle(puzzle.puzzle_id)"
                    :disabled="isLoading"
                    class="delete-button"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredPuzzles.length && !errorMessage && !isLoading">
                <td colspan="7" class="no-data">Không có dữ liệu ô chữ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useCrosswordPuzzlesAdmin } from "../composables/useCrossword";
import AppAdminNavbar from "../components/AdminNavbar.vue";

export default {
  name: "CrosswordPuzzleAdmin",
  components: {
    AppAdminNavbar,
  },
  setup() {
    const {
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
    } = useCrosswordPuzzlesAdmin();

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
  },
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  margin-top: -5%;
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

.crossword-admin-content {
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
  max-width: 1000px; /* Tăng max-width giống các trang trước */
  width: 100%;
  padding: 24px;
  animation: slideUp 0.5s ease-out;
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

.search-container {
  margin-bottom: 20px;
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

.form-checkbox {
  width: auto;
  margin-top: 8px;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  color: #667eea;
  z-index: 1;
}

.form-container {
  margin-bottom: 20px;
}

.puzzle-form {
  display: flex;
  flex-direction: column;
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

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-button,
.cancel-button,
.add-button,
.edit-button,
.delete-button {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 9%;
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
  padding: 8px 12px;
  font-size: 13px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  margin-right: 5px;
}

.edit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e5940a 0%, #c27a05 100%);
}

.delete-button {
  padding: 8px 12px;
  font-size: 13px;
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
  max-width: 100%;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 1rem; /* Giữ font-size giống các trang trước */
}

th,
td {
  padding: 14px; /* Tăng padding giống các trang trước */
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

  .crossword-admin-content {
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
    padding: 10px;
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
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }

  table {
    font-size: 0.8rem;
  }

  th,
  td {
    padding: 8px;
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
}
</style>

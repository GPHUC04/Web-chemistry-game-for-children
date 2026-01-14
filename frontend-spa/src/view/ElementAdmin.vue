<template>
  <div class="admin-container">
    <!-- Admin content -->
    <aside class="admin-sidebar">
      <AppAdminNavbar />
    </aside>

    <main class="element-admin-content">
      <div class="content-card">
        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-message">Đang tải dữ liệu...</div>

        <!-- Error message display -->
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <h2>Quản Lý Nguyên Tố</h2>

        <!-- Ô tìm kiếm -->
        <div class="search-container">
          <div class="input-wrapper">
            <input
              v-model="searchSymbol"
              type="text"
              placeholder="Tìm kiếm theo ký hiệu..."
              @input="filterElements"
              :disabled="isLoading"
              maxlength="3"
              class="form-input"
            />
            <span class="input-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Form thêm/sửa nguyên tố -->
        <div class="form-container" v-if="isFormVisible">
          <form @submit.prevent="saveElement" class="element-form">
            <div class="form-group">
              <label for="symbol">Ký Hiệu:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentElement.symbol"
                  id="symbol"
                  type="text"
                  required
                  :disabled="isLoading || editingElementId"
                  maxlength="3"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-atom"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="nameEn">Tên Nguyên Tố (EN):</label>
              <div class="input-wrapper">
                <input
                  v-model="currentElement.name_en"
                  id="nameEn"
                  type="text"
                  required
                  :disabled="isLoading"
                  maxlength="50"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-language"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="atomicNumber">Số Nguyên Tử:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentElement.atomic_number"
                  id="atomicNumber"
                  type="number"
                  required
                  :disabled="isLoading"
                  min="1"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-hashtag"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="atomicMass">Khối Lượng Nguyên Tử:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentElement.atomic_mass"
                  id="atomicMass"
                  type="number"
                  step="0.0001"
                  required
                  :disabled="isLoading"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-weight"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="groupNumber">Số Nhóm:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentElement.group_number"
                  id="groupNumber"
                  type="number"
                  :disabled="isLoading"
                  min="1"
                  max="18"
                  class="form-input"
                />
                <span class="input-icon"
                  ><i class="fas fa-layer-group"></i
                ></span>
              </div>
            </div>
            <div class="form-group">
              <label for="periodNumber">Số Chu Kỳ:</label>
              <div class="input-wrapper">
                <input
                  v-model.number="currentElement.period_number"
                  id="periodNumber"
                  type="number"
                  :disabled="isLoading"
                  min="1"
                  max="7"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-redo"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="electronConfiguration">Cấu Hình Electron:</label>
              <div class="input-wrapper">
                <input
                  v-model="currentElement.electron_configuration"
                  id="electronConfiguration"
                  type="text"
                  :disabled="isLoading"
                  maxlength="100"
                  class="form-input"
                />
                <span class="input-icon"><i class="fas fa-bolt"></i></span>
              </div>
            </div>
            <div class="form-group">
              <label for="properties">Tính Chất:</label>
              <textarea
                v-model="currentElement.properties"
                id="properties"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="applications">Ứng Dụng:</label>
              <textarea
                v-model="currentElement.applications"
                id="applications"
                :disabled="isLoading"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="category">Danh Mục:</label>
              <div class="input-wrapper">
                <select
                  v-model="currentElement.category"
                  id="category"
                  :disabled="isLoading"
                  class="form-input"
                >
                  <option value="" disabled>Chọn danh mục</option>
                  <option value="metal">Kim loại</option>
                  <option value="nonmetal">Phi kim</option>
                  <option value="metalloid">Luyện kim</option>
                  <option value="noble_gas">Khí hiếm</option>
                  <option value="alkali_metal">Kim loại kiềm</option>
                  <option value="alkaline_earth_metal">
                    Kim loại kiềm thổ
                  </option>
                  <option value="transition_metal">Kim loại chuyển tiếp</option>
                  <option value="lanthanide">Lantanide</option>
                  <option value="actinide">Actinide</option>
                </select>
                <span class="input-icon"><i class="fas fa-tags"></i></span>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isLoading" class="submit-button">
                {{ editingElementId ? "Cập Nhật" : "Thêm Mới" }}
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

        <!-- Danh sách nguyên tố -->
        <div class="table-container">
          <button @click="showAddForm" class="add-button" :disabled="isLoading">
            Thêm Nguyên Tố Mới
          </button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ký Hiệu</th>
                <th>Tên (EN)</th>
                <th>Số Nguyên Tử</th>
                <th>Khối Lượng</th>
                <th>Nhóm</th>
                <th>Chu Kỳ</th>
                <th>Danh Mục</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in filteredElements" :key="element.element_id">
                <td>{{ element.element_id }}</td>
                <td>{{ element.symbol }}</td>
                <td>{{ element.name_en }}</td>
                <td>{{ element.atomic_number }}</td>
                <td>{{ element.atomic_mass }}</td>
                <td>{{ element.group_number || "-" }}</td>
                <td>{{ element.period_number || "-" }}</td>
                <td>{{ element.category || "-" }}</td>
                <td>
                  <button
                    @click="editElement(element)"
                    :disabled="isLoading"
                    class="edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteElement(element.element_id)"
                    :disabled="isLoading"
                    class="delete-button"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              <tr
                v-if="!filteredElements.length && !errorMessage && !isLoading"
              >
                <td colspan="9" class="no-data">Không có dữ liệu nguyên tố</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useElementsAdmin } from "../composables/useElementsAdmin";
import AppAdminNavbar from "../components/AdminNavbar.vue";

export default {
  name: "ElementAdmin",
  components: {
    AppAdminNavbar,
  },
  setup() {
    const {
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
    } = useElementsAdmin();

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

.element-admin-content {
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
  max-width: 1000px; /* Tăng từ 800px để bảng rộng hơn */
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

.element-form {
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
  padding: 6px 10px; /* Giảm kích thước nút */
  border: none;
  border-radius: 8px; /* Tăng độ bo góc */
  font-size: 14px; /* Giảm font-size cho nút nhỏ hơn */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 13%;
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
  padding: 14px; /* Tăng padding để bảng rộng rãi hơn */
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem; /* Tăng font-size cho dễ đọc */
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

  .element-admin-content {
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
    padding: 10px; /* Giảm padding cho màn hình nhỏ */
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
    padding: 8px; /* Giảm thêm padding cho màn hình rất nhỏ */
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
    padding: 5px 8px; /* Nút nhỏ hơn nữa cho màn hình nhỏ */
    font-size: 13px;
  }
}
</style>

<template>
  <div class="experiments-page">
    <NavbarUser />

    <!-- Floating Chemical Formulas -->
    <div class="chemical-formulas">
      <span class="formula" v-for="n in 10" :key="n">{{
        getRandomFormula()
      }}</span>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1 class="main-title">
          <i class="fas fa-flask"></i>
          Thí Nghiệm Hóa Học Thú Vị
        </h1>
        <p class="subtitle">
          Khám phá hóa học qua các thí nghiệm đơn giản tại nhà!
        </p>
      </div>
    </div>

    <!-- Experiments Section -->
    <div class="experiments-section">
      <h2 class="section-title">
        <span class="tooltip-wrapper">
          Danh Sách Thí Nghiệm
          <span class="tooltip-text"
            >Thử ngay các thí nghiệm an toàn và vui nhộn</span
          >
        </span>
      </h2>
      <div class="experiments-grid">
        <div
          v-for="(experiment, index) in experiments"
          :key="index"
          class="experiment-card"
        >
          <div class="experiment-header">
            <i :class="experiment.icon"></i>
            <h3 class="experiment-title">
              <span class="tooltip-wrapper">
                {{ experiment.title }}
                <span class="tooltip-text">{{ experiment.title }}</span>
              </span>
            </h3>
          </div>
          <p class="experiment-description">{{ experiment.description }}</p>
          <div class="experiment-details">
            <div class="detail-item">
              <span class="detail-label"
                ><i class="fas fa-vial"></i> Nguyên liệu:</span
              >
              <span class="detail-content">{{ experiment.materials }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"
                ><i class="fas fa-list-ol"></i> Hướng dẫn:</span
              >
              <span class="detail-content">{{ experiment.instructions }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Section -->
    <div class="video-section">
      <h2 class="section-title">
        <span class="tooltip-wrapper">
          Video Thí Nghiệm
          <span class="tooltip-text"
            >Xem thí nghiệm Kem Đánh Răng Voi ấn tượng</span
          >
        </span>
      </h2>
      <div class="video-card">
        <div class="video-header">
          <i class="fas fa-video"></i>
          <h3 class="video-title">
            <span class="tooltip-wrapper">
              Kem Đánh Răng Voi
              <span class="tooltip-text">Elephant Toothpaste Experiment</span>
            </span>
          </h3>
        </div>
        <p class="video-description">
          Xem thí nghiệm tạo bọt khổng lồ với phản ứng hóa học thú vị từ
          NileRed.
        </p>
        <div class="video-wrapper">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/ezsur0L0L1c"
            title="Elephant Toothpaste Experiment"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarUser from "@/components/NavbarUser.vue";
import { ref } from "vue";

export default {
  name: "AppExperiments",
  components: {
    NavbarUser,
  },
  setup() {
    const experiments = ref([
      {
        title: "Bong Bóng CO₂",
        description:
          "Tạo bọt khí carbon dioxide bằng phản ứng giữa baking soda và giấm.",
        materials: "Baking soda, giấm, chai nhựa, bóng bay.",
        instructions:
          "Cho 2 muỗng baking soda vào chai, thêm 100ml giấm. Gắn bóng bay vào miệng chai và quan sát bóng phồng lên.",
        icon: "fas fa-wind",
      },
      {
        title: "Núi Lửa Phun Trào",
        description:
          "Mô phỏng núi lửa phun trào với phản ứng hóa học đơn giản.",
        materials: "Baking soda, giấm, màu thực phẩm, khay, cát hoặc đất sét.",
        instructions:
          "Tạo mô hình núi lửa từ cát/đất sét. Cho baking soda vào miệng núi lửa, thêm giấm và màu thực phẩm. Xem phun trào!",
        icon: "fas fa-volcano",
      },
      {
        title: "Mực Tàng Hình",
        description: "Viết thông điệp bí mật chỉ hiện ra khi đun nóng.",
        materials: "Nước cốt chanh, tăm bông, giấy trắng, đèn hoặc bếp.",
        instructions:
          "Dùng tăm bông nhúng nước cốt chanh viết lên giấy. Đun nóng giấy bằng đèn/bếp để hiện chữ.",
        icon: "fas fa-pen",
      },
      {
        title: "Đèn Lava Tự Chế",
        description: "Tạo đèn lava mini với dầu, nước và sủi bọt.",
        materials:
          "Nước, dầu ăn, màu thực phẩm, viên sủi bọt, chai nhựa trong.",
        instructions:
          "Đổ 2/3 chai nước, thêm dầu ăn, vài giọt màu thực phẩm. Thả viên sủi bọt và quan sát bong bóng chuyển động.",
        icon: "fas fa-lightbulb",
      },
    ]);

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
      ];
      return formulas[Math.floor(Math.random() * formulas.length)];
    };

    return {
      experiments,
      getRandomFormula,
    };
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

.experiments-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2a2a72 0%, #4c2889 100%);
  padding: 30px;
  margin: 0;
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow-x: hidden;
  margin-left: -1%;
}

/* Chemical Formulas */
.chemical-formulas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.formula {
  position: absolute;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  animation: float 8s linear infinite;
}

.formula:nth-child(1) {
  left: 10%;
  animation-duration: 10s;
  animation-delay: 0s;
}
.formula:nth-child(2) {
  left: 20%;
  animation-duration: 12s;
  animation-delay: 1s;
}
.formula:nth-child(3) {
  left: 30%;
  animation-duration: 9s;
  animation-delay: 2s;
}
.formula:nth-child(4) {
  left: 40%;
  animation-duration: 11s;
  animation-delay: 3s;
}
.formula:nth-child(5) {
  left: 50%;
  animation-duration: 10s;
  animation-delay: 4s;
}
.formula:nth-child(6) {
  left: 60%;
  animation-duration: 13s;
  animation-delay: 5s;
}
.formula:nth-child(7) {
  left: 70%;
  animation-duration: 8s;
  animation-delay: 6s;
}
.formula:nth-child(8) {
  left: 80%;
  animation-duration: 11s;
  animation-delay: 7s;
}
.formula:nth-child(9) {
  left: 90%;
  animation-duration: 9s;
  animation-delay: 8s;
}
.formula:nth-child(10) {
  left: 95%;
  animation-duration: 12s;
  animation-delay: 9s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Header */
.header {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30%;
  padding: 50px 30px;
  margin-bottom: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.header:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.header:hover:before {
  left: 100%;
}

.header-content {
  text-align: center;
}

.main-title {
  font-size: 3.5rem;
  color: #e5e7eb;
  margin-bottom: 15px;
  font-weight: 800;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 15px;
}

.main-title i {
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

/* Experiments Section */
.experiments-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  color: #e5e7eb;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.experiment-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95),
    rgba(240, 240, 240, 0.9)
  );
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.experiment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.experiment-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.experiment-header i {
  font-size: 2rem;
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
}

.experiment-title {
  font-size: 1.6rem;
  color: #1e1b4b;
  font-weight: 700;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.experiment-description {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 15px;
}

.experiment-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.9rem;
  color: #32a375;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.detail-label i {
  color: #6b21a8;
}

.detail-content {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
}

/* Video Section */
.video-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.video-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95),
    rgba(240, 240, 240, 0.9)
  );
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.video-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.video-header i {
  font-size: 2rem;
  color: #6b21a8;
  text-shadow: 0 0 5px rgba(107, 33, 168, 0.3);
}

.video-title {
  font-size: 1.8rem;
  color: #1e1b4b;
  font-weight: 700;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.video-description {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 20px;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Tooltip */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 217, 61, 0.9),
    rgba(255, 170, 0, 0.9)
  );
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 217, 61, 0.5);
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(255, 217, 61, 0.9) transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

/* Responsive */
@media (max-width: 768px) {
  .experiments-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .video-wrapper {
    padding-bottom: 56.25%;
  }

  .tooltip-text {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .experiments-page {
    padding: 20px;
  }

  .header {
    padding: 30px;
  }

  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .experiment-title {
    font-size: 1.4rem;
  }

  .video-title {
    font-size: 1.6rem;
  }

  .video-wrapper {
    padding-bottom: 75%; /* Adjust for smaller screens */
  }

  .formula {
    font-size: 0.9rem;
  }

  .tooltip-text {
    max-width: 200px;
    white-space: normal;
    text-align: left;
  }
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>

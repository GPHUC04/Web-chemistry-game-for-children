<template>
  <div>
    <div class="app min-h-screen flex flex-col">
      <NavbarUser />

      <main
        class="flex-1 flex items-center justify-center relative overflow-hidden"
      >
        <div class="floating-elements">
          <div class="element co2">CO₂</div>
          <div class="element h2o">H₂O</div>
          <div class="element nacl">NaCl</div>
          <div class="element o2">O₂</div>
          <div class="element c6h12o6">C₆H₁₂O₆</div>
          <div class="element nh3">NH₃</div>
          <div class="element ch4">CH₄</div>
          <div class="element cao">CaO</div>
          <div class="element h2so4">H₂SO₄</div>
          <div class="element c6h807">C₆H₈O₇</div>
          <div class="element n2">N₂</div>
          <div class="element c43h66n12012s2">C₄₃H₆₆N₁₂O₁₂S₂</div>
        </div>

        <!-- Central Atom Animation -->
        <div class="atom-container">
          <div class="atom-nucleus">
            <div class="nucleus-core"></div>
            <div class="proton"></div>
            <div class="neutron"></div>
          </div>
          <div class="electron-orbit orbit-1">
            <div class="electron e1"></div>
          </div>
          <div class="electron-orbit orbit-2">
            <div class="electron e2"></div>
            <div class="electron e3"></div>
          </div>
          <div class="electron-orbit orbit-3">
            <div class="electron e4"></div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content-container">
          <div class="main-title">
            <h1 class="chemistry-title">Thế giới hóa học</h1>
            <h1 class="learning-title">Học mà chơi</h1>
            <h1 class="game-title">Chơi mà học</h1>
          </div>

          <div class="description">
            <p>
              Khám phá thế giới hóa học thông qua các trò chơi tương tác thú vị.
            </p>
            <p>
              Học hỏi các phản ứng hóa học, công thức phân tử và khám phá các
              quy luật.
            </p>
          </div>
        </div>

        <!-- Background Particles -->
        <div class="particles">
          <div class="particle p1"></div>
          <div class="particle p2"></div>
          <div class="particle p3"></div>
          <div class="particle p4"></div>
          <div class="particle p5"></div>
          <div class="particle p6"></div>
          <div class="particle p7"></div>
          <div class="particle p8"></div>
        </div>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { useHomePage } from "../composables/useHomePage";
import NavbarUser from "../components/NavbarUser.vue";
import AppFooter from "../components/Footer.vue";

export default {
  name: "HomePage",
  components: {
    NavbarUser,
    AppFooter,
  },
  setup() {
    const {
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
    } = useHomePage();

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
  },
};
</script>

<style scoped>
.app {
  background: linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7);
  position: relative;
  min-height: 100vh;
  margin-left: -1%;
  margin-right: -1%;
}
:host,
:root {
  --fa-font-solid: normal 900 1em / 1 "Font Awesome 6 Free";
  margin-left: -1%;
}
main {
  display: flex;
  position: relative;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* Content Container */
.content-container {
  text-align: left;
  z-index: 10;
  position: relative;
  max-width: 800px;
  margin-left: 4rem;
  margin-top: 4rem;
}

.main-title {
  margin-bottom: 2rem;
}

.chemistry-title {
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding-bottom: 10px;
}

.learning-title,
.game-title {
  font-size: 5rem;
  font-weight: 700;
  color: #fbbf24;
  margin: 0;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding-bottom: 10px;
}

.description {
  color: white;
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.description p {
  margin: 0.2rem 0;
}

/* Floating Chemistry Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.element {
  position: absolute;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
  animation: float-around 20s infinite linear;
}

.co2 {
  top: 10%;
  right: 15%;
  animation-delay: 0s;
  font-size: 2rem;
}

.h2o {
  top: 25%;
  right: 5%;
  animation-delay: -3s;
  background: rgba(59, 130, 246, 0.2);
  font-size: 2rem;
}

.nacl {
  bottom: -20%;
  right: 10%;
  animation-delay: -10s;
  font-size: 2rem;
}

.o2 {
  top: 10%;
  left: 10%;
  animation-delay: -9s;
  background: rgba(34, 197, 94, 0.2);
  font-size: 2rem;
}

.c6h12o6 {
  bottom: -5%;
  left: 10%;
  animation-delay: -12s;
  font-size: 2rem;
}

.nh3 {
  top: 40%;
  left: 5%;
  animation-delay: -15s;
  font-size: 2rem;
}

.ch4 {
  bottom: -30%;
  left: 30%;
  animation-delay: -18s;
  font-size: 2rem;
}

.cao {
  top: 60%;
  right: 10%;
  animation-delay: -2s;
  font-size: 2rem;
}

.h2so4 {
  top: 20%;
  right: 50%;
  animation-delay: -10s;
  font-size: 2rem;
}

.c6h807 {
  top: 60%;
  right: 50%;
  animation-delay: -10s;
  font-size: 2rem;
}

.n2 {
  top: 30%;
  right: 35%;
  animation-delay: 0s;
  font-size: 2rem;
}

.c43h66n12012s2 {
  bottom: -15%;
  left: 55%;
  animation-delay: -15s;
  font-size: 2rem;
}

/* Central Atom Animation */
.atom-container {
  position: absolute;
  right: 25%;
  bottom: 30%;
  transform: scale(3.5);
  z-index: 2;
}

.atom-nucleus {
  width: 60px;
  height: 60px;
  position: relative;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  animation: nucleus-glow 2s infinite alternate;
}

.nucleus-core {
  width: 40px;
  height: 40px;
  background: #f59e0b;
  border-radius: 50%;
  position: absolute;
}

.proton,
.neutron {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
}

.proton {
  background: #ef4444;
  top: 15px;
  left: 20px;
}

.neutron {
  background: #6b7280;
  bottom: 15px;
  right: 20px;
}

.electron-orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

.orbit-1 {
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  animation: orbit-rotate 4s infinite linear;
}

.orbit-2 {
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  animation: orbit-rotate 6s infinite linear reverse;
}

.orbit-3 {
  width: 180px;
  height: 180px;
  margin: -90px 0 0 -90px;
  animation: orbit-rotate 8s infinite linear;
}

.electron {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
}

.e1 {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.e2 {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.e3 {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.e4 {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

/* Background Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: particle-float 15s infinite linear;
}

.p1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}
.p2 {
  top: 20%;
  left: 80%;
  animation-delay: -2s;
}
.p3 {
  top: 50%;
  left: 10%;
  animation-delay: -4s;
}
.p4 {
  top: 70%;
  left: 60%;
  animation-delay: -6s;
}
.p5 {
  top: 30%;
  left: 40%;
  animation-delay: -8s;
}
.p6 {
  top: 80%;
  left: 30%;
  animation-delay: -10s;
}
.p7 {
  top: 60%;
  left: 70%;
  animation-delay: -12s;
}
.p8 {
  top: 40%;
  left: 90%;
  animation-delay: -14s;
}

/* Animations */
@keyframes float-around {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -20px) rotate(90deg);
  }
  50% {
    transform: translate(-10px, -30px) rotate(180deg);
  }
  75% {
    transform: translate(-30px, 10px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes nucleus-glow {
  0% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  }
  100% {
    box-shadow: 0 0 40px rgba(251, 191, 36, 0.9),
      0 0 60px rgba(251, 191, 36, 0.4);
  }
}

@keyframes orbit-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0px) translateX(0px) opacity(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px) opacity(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .chemistry-title,
  .learning-title,
  .game-title {
    font-size: 2.5rem;
  }

  .content-container {
    margin-left: 1rem;
  }

  .atom-container {
    right: 5%;
    transform: scale(0.8);
  }

  .element {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

.app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/day-hoa-hoc-1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
</style>

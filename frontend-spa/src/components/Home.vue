<template>
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title" data-aos="fade-up">
              KHÁM PHÁ THẾ GIỚI HÓA HỌC
            </h1>
            <h2 class="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
              Bắt đầu Khám phá<br>
              Tất cả về <span class="highlight">Hóa học</span>
            </h2>
            <p class="hero-description" data-aos="fade-up" data-aos-delay="400">
              Bắt đầu khám phá trong thế giới hóa học. Điều hướng và khám phá tất cả 
              những điều kỳ diệu của các nguyên tố và phản ứng hóa học.
            </p>
            <button class="cta-button" data-aos="fade-up" data-aos-delay="600">
              Bắt đầu
            </button>
          </div>
          
          <div class="hero-visual" data-aos="fade-left" data-aos-delay="800">
            <!-- Molecule Animation -->
            <div class="molecule-container">
              <div class="molecule big-molecule">
                <div class="atom atom-center"></div>
                <div class="atom atom-orbit-1"></div>
                <div class="atom atom-orbit-2"></div>
                <div class="atom atom-orbit-3"></div>
                <div class="bond bond-1"></div>
                <div class="bond bond-2"></div>
                <div class="bond bond-3"></div>
              </div>
              
              <!-- Flask with bubbles -->
              <div class="flask">
                <div class="flask-body"></div>
                <div class="flask-neck"></div>
                <div class="liquid"></div>
                <div class="bubble bubble-1"></div>
                <div class="bubble bubble-2"></div>
                <div class="bubble bubble-3"></div>
              </div>
              
              <!-- Floating atoms -->
              <div class="floating-atom atom-1"></div>
              <div class="floating-atom atom-2"></div>
              <div class="floating-atom atom-3"></div>
              <div class="floating-atom atom-4"></div>
              
              <!-- Periodic table elements -->
              <div class="element element-1">H</div>
              <div class="element element-2">O</div>
              <div class="element element-3">C</div>
              <div class="element element-4">N</div>
            </div>
            
            <!-- Decorative clouds -->
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
          </div>
        </div>
        
        <!-- Footer badge -->
        <div class="footer-badge">
          <span>HÓA HỌC VUI</span>
        </div>
      </section>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  name: 'AppHome',
  mounted() {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true
    });
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #a31b41 100%);
  position: relative;
  overflow: hidden;
  margin-left: -1%;
  margin-right: -1%;
}


.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  margin: 0 auto;
  align-items: center;
}

.hero-text {
  color: white;
  z-index: 2;
}

.hero-title {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.hero-subtitle {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #fbbf24;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-button {
  background: linear-gradient(45deg, #ec4899, #f59e0b);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.hero-visual {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.molecule-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Molecule Animation */
.molecule {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  animation: rotate 20s linear infinite;
}

.atom {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #60a5fa, #3b82f6);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.6);
}

.atom-center {
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #f59e0b, #d97706);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.8);
}

.atom-orbit-1 {
  width: 20px;
  height: 20px;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbit1 8s linear infinite;
}

.atom-orbit-2 {
  width: 15px;
  height: 15px;
  top: 50%;
  right: 20%;
  transform: translate(50%, -50%);
  animation: orbit2 12s linear infinite;
}

.atom-orbit-3 {
  width: 18px;
  height: 18px;
  bottom: 20%;
  left: 30%;
  transform: translate(-50%, 50%);
  animation: orbit3 10s linear infinite;
}

.bond {
  position: absolute;
  background: linear-gradient(45deg, #8b5cf6, #a78bfa);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.bond-1 {
  width: 60px;
  height: 3px;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.bond-2 {
  width: 50px;
  height: 3px;
  top: 50%;
  right: 35%;
  transform: translate(50%, -50%) rotate(-30deg);
}

.bond-3 {
  width: 55px;
  height: 3px;
  bottom: 35%;
  left: 40%;
  transform: translate(-50%, 50%) rotate(60deg);
}

/* Flask Animation */
.flask {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 60px;
  height: 80px;
  animation: float 4s ease-in-out infinite;
}

.flask-body {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0 0 50% 50%;
  position: absolute;
  bottom: 0;
}

.flask-neck {
  width: 15px;
  height: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom: none;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.liquid {
  width: 46px;
  height: 30px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 0 0 46px 46px;
  position: absolute;
  bottom: 2px;
  left: 2px;
  animation: bubble-reaction 3s ease-in-out infinite;
}

.bubble {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 50%;
  animation: bubble-rise 2s ease-in-out infinite;
}

.bubble-1 {
  width: 6px;
  height: 6px;
  bottom: 20px;
  left: 15px;
  animation-delay: 0s;
}

.bubble-2 {
  width: 4px;
  height: 4px;
  bottom: 25px;
  left: 25px;
  animation-delay: 0.7s;
}

.bubble-3 {
  width: 5px;
  height: 5px;
  bottom: 15px;
  left: 35px;
  animation-delay: 1.4s;
}

/* Floating Atoms */
.floating-atom {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: radial-gradient(circle, #f472b6, #ec4899);
  box-shadow: 0 0 15px rgba(244, 114, 182, 0.6);
  animation: float-atom 6s ease-in-out infinite;
}

.atom-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.atom-2 {
  top: 70%;
  right: 20%;
  animation-delay: 1.5s;
}

.atom-3 {
  bottom: 30%;
  left: 10%;
  animation-delay: 3s;
}

.atom-4 {
  top: 30%;
  right: 5%;
  animation-delay: 4.5s;
}

/* Periodic Elements */
.element {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  animation: element-glow 3s ease-in-out infinite;
}

.element-1 {
  top: 15%;
  left: 5%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 5%;
  animation-delay: 0.8s;
}

.element-3 {
  bottom: 20%;
  right: 25%;
  animation-delay: 1.6s;
}

.element-4 {
  top: 40%;
  left: 5%;
  animation-delay: 2.4s;
}

/* Decorative Clouds */
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  opacity: 0.6;
  animation: cloud-float 15s ease-in-out infinite;
}

.cloud-1 {
  width: 100px;
  height: 50px;
  top: 20%;
  right: 30%;
  animation-delay: 0s;
}

.cloud-2 {
  width: 80px;
  height: 40px;
  bottom: 30%;
  left: 15%;
  animation-delay: 5s;
}

.cloud-3 {
  width: 60px;
  height: 30px;
  top: 70%;
  right: 10%;
  animation-delay: 10s;
}

/* Footer Badge */
.footer-badge {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  z-index: 10;
}

/* Animations */
@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes orbit1 {
  0% { transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg); }
}

@keyframes orbit2 {
  0% { transform: translate(50%, -50%) rotate(0deg) translateX(70px) rotate(0deg); }
  100% { transform: translate(50%, -50%) rotate(-360deg) translateX(70px) rotate(360deg); }
}

@keyframes orbit3 {
  0% { transform: translate(-50%, 50%) rotate(0deg) translateX(90px) rotate(0deg); }
  100% { transform: translate(-50%, 50%) rotate(360deg) translateX(90px) rotate(-360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes bubble-reaction {
  0%, 100% { height: 30px; }
  50% { height: 35px; }
}

@keyframes bubble-rise {
  0% { transform: translateY(0px); opacity: 1; }
  100% { transform: translateY(-30px); opacity: 0; }
}

@keyframes float-atom {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(120deg); }
  66% { transform: translateY(-5px) rotate(240deg); }
}

@keyframes element-glow {
  0%, 100% { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 6px 25px rgba(99, 102, 241, 0.6); }
}

@keyframes cloud-float {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(10px) translateY(-5px); }
  50% { transform: translateX(-5px) translateY(-10px); }
  75% { transform: translateX(-10px) translateY(-5px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
  }
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    width: 100%;
  }
  
  .hero-subtitle {
    font-size: 2.5rem;
  }
  
  .hero-visual {
    height: 300px;
  }
  
  .molecule {
    width: 150px;
    height: 150px;
  }
  
  .flask {
    width: 40px;
    height: 60px;
  }
  
  .floating-atom {
    width: 20px;
    height: 20px;
  }
  
  .element {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1rem;
  }
  .hero-content {
    width: 100%;
  }
}
</style>
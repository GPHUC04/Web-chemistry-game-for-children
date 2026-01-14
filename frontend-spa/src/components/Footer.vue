<template>
  <footer class="footer">
    <!-- Floating Chemical Formulas -->
    <div class="chemical-formulas"></div>

    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">Contact Us</h3>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span>Call +01 1234567890</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>demo@gmail.com</span>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Feane</h3>
        <div class="feature-text">
          Necessary, making this the first true generator on the Internet. It
          uses a dictionary of over 200 Latin words, combined with
        </div>
        <div class="social-links">
          <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-link"><i class="fab fa-pinterest"></i></a>
        </div>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Opening Hours</h3>
        <div class="hours-info">
          <div class="hours-item day">Everyday</div>
          <div class="hours-item">10.00 Am - 10.00 Pm</div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 All Rights Reserved By Free Html Templates</p>
      <p>&copy; Distributed By ThemeWagon</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

.footer {
  background: linear-gradient(135deg, #2a2a72, #4c2889);
  color: #e5e7eb;
  padding: 60px 30px 40px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Chemical Formulas */
.chemical-formulas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.formula {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
  animation: float 5s linear infinite;
}

.formula:nth-child(1) {
  left: 5%;
  animation-duration: 6s;
  animation-delay: 0s;
}
.formula:nth-child(2) {
  left: 15%;
  animation-duration: 5.5s;
  animation-delay: 0.5s;
}
.formula:nth-child(3) {
  left: 25%;
  animation-duration: 6.5s;
  animation-delay: 1s;
}
.formula:nth-child(4) {
  left: 35%;
  animation-duration: 5s;
  animation-delay: 1.5s;
}
.formula:nth-child(5) {
  left: 45%;
  animation-duration: 6s;
  animation-delay: 2s;
}
.formula:nth-child(6) {
  left: 55%;
  animation-duration: 5.5s;
  animation-delay: 2.5s;
}
.formula:nth-child(7) {
  left: 65%;
  animation-duration: 6.5s;
  animation-delay: 3s;
}
.formula:nth-child(8) {
  left: 75%;
  animation-duration: 5s;
  animation-delay: 3.5s;
}

@keyframes float {
  0% {
    transform: translateY(100%) translateX(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
    transform: translateY(80%) translateX(10px) rotate(90deg);
  }
  80% {
    opacity: 0.7;
    transform: translateY(20%) translateX(-10px) rotate(270deg);
  }
  100% {
    transform: translateY(-100%) translateX(0) rotate(360deg);
    opacity: 0;
  }
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.footer-section {
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

.footer-section:nth-child(2) {
  animation-delay: 0.2s;
}

.footer-section:nth-child(3) {
  animation-delay: 0.4s;
}

.footer-title {
  font-size: 2.2rem;
  font-weight: 300;
  font-style: italic;
  margin-bottom: 30px;
  color: #4b6cb7;
  text-shadow: 0 0 5px rgba(75, 108, 183, 0.3);
  position: relative;
  display: inline-block;
}

.footer-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3498db, transparent);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.3s ease;
}

.contact-item:hover {
  color: #3498db;
  transform: translateX(5px);
}

.contact-item i {
  font-size: 1.3rem;
  width: 20px;
  text-align: center;
}

.feature-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  max-width: 400px;
  margin: 0 auto 30px;
}

.hours-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.hours-item {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
}

.hours-item.day {
  color: #3498db;
  font-weight: 600;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-link {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: floatSocial 3s ease-in-out infinite;
}

.social-link:nth-child(2) {
  animation-delay: 0.5s;
}
.social-link:nth-child(3) {
  animation-delay: 1s;
}
.social-link:nth-child(4) {
  animation-delay: 1.5s;
}
.social-link:nth-child(5) {
  animation-delay: 2s;
}

.social-link:hover {
  background: #6b21a8;
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 10px 25px rgba(107, 33, 168, 0.4);
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

.footer-bottom p {
  margin-bottom: 10px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSocial {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-title {
    font-size: 1.8rem;
  }

  .social-links {
    gap: 15px;
  }

  .social-link {
    width: 45px;
    height: 45px;
  }

  .formula {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 40px 20px 20px;
  }

  .footer-title {
    font-size: 1.6rem;
  }

  .contact-item,
  .feature-text,
  .hours-item {
    font-size: 1rem;
  }

  .social-link {
    font-size: 1.1rem;
  }

  .formula {
    font-size: 1rem;
  }
}

.footer {
  position: relative;
  z-index: 2;
  margin-left: -1%;
  margin-right: -1%;
  margin-bottom: -1%;
}
</style>

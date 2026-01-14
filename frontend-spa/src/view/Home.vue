<template>
  <div>
    <div class="app min-h-screen flex flex-col">
      <Navbar />
      <main class="flex-grow">
        <Home />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Navbar from "../components/Navbar.vue";
import Home from "../components/Home.vue";
import Footer from "../components/Footer.vue";
import AOS from "aos";
import "aos/dist/aos.css";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Home,
    Footer,
  },
  mounted() {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  },
});
</script>

<style scoped>
.app {
  background: linear-gradient(
    135deg,
    #1e3a8a,
    #4c1d95
  ); /* Đồng bộ gradient với navbar và footer */
}
</style>

import { ref, computed } from "vue";
import axios from "axios";

export function useGames() {
  const games = ref([]);
  const loading = ref(false);
  const errorMessage = ref("");

  const activeGamesCount = computed(
    () => games.value.filter((g) => g.is_active).length
  );

  const loadGames = async () => {
    loading.value = true;
    errorMessage.value = "";
    try {
      const apiUrl =
        process.env.API_URL || "https://ct313hm01-project-gphuc04.onrender.com";
      const res = await axios.get(`${apiUrl}/games`);
      games.value = res.data.result || [];
    } catch (err) {
      errorMessage.value =
        err.response?.data?.message || "Không thể tải danh sách trò chơi.";
    } finally {
      loading.value = false;
    }
  };

  return {
    games,
    loading,
    errorMessage,
    activeGamesCount,
    loadGames,
  };
}

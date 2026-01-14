<template>
  <div v-if="currentGame">
    <h1>{{ currentGame.name_vi }}</h1>
    <p>{{ currentGame.description_vi }}</p>
    <p>
      <strong>Thời gian giới hạn:</strong> {{ currentGame.time_limit }} giây
    </p>
    <p><strong>Điểm tối đa:</strong> {{ currentGame.max_score }}</p>

    <!-- Tùy vào game_code, bạn có thể thêm logic tương ứng ở đây -->
    <div v-if="currentGame.game_code === 'master_chef'">
      <p>Hiển thị giao diện cho "Đầu Bếp Hóa Học"</p>
    </div>
  </div>
</template>

<script>
import { useGames } from "@/composables/useGames";
import NavbarUser from "@/components/NavbarUser.vue";

export default {
  name: "AppGames",
  components: { NavbarUser },
  setup() {
    const { games, loading, errorMessage, activeGamesCount, refetch } =
      useGames();
    return { games, loading, errorMessage, activeGamesCount, refetch };
  },
};
</script>

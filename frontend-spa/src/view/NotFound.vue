<!-- view/NotFound.vue -->
<template>
  <div class="not-found">
    <h1>404 - Không tìm thấy trang</h1>
    <p>
      Trang bạn tìm kiếm không tồn tại.
      <router-link to="/">Quay về trang chủ</router-link>
    </p>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
  color: #333;
}
</style>

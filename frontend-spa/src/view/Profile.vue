<template>
<NavbarUser />
  <div class="profile-view">
    <ProfileUser />
  </div>
</template>

<script>
import ProfileUser from '@/components/ProfileUser.vue'
import NavbarUser from '@/components/NavbarUser.vue'

export default {
  name: 'ProfileView',
  components: {
    ProfileUser,
    NavbarUser
  },
  
  mounted() {
    // Set page title
    document.title = 'Hồ sơ - MoleMind'
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Xem hồ sơ người dùng, thống kê học tập và thành tích trên MoleMind')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Xem hồ sơ người dùng, thống kê học tập và thành tích trên MoleMind'
      document.head.appendChild(meta)
    }
  },

  beforeUnmount() {
    // Reset page title when leaving
    document.title = 'MoleMind'
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #7c3aed 75%, #a855f7 100%);
  position: relative;
  overflow-x: hidden;
  margin-left: -1%;
  margin-right: -1%;
  margin-bottom: -1%;
}

.profile-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.profile-view > * {
  position: relative;
  z-index: 1;
}

/* Additional global styles for the profile view */
@media (max-width: 768px) {
  .profile-view {
    padding: 0;
  }
}
</style>
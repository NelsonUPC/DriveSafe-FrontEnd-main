<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import CarSearchTenant from "@/DriveSafe/pages/car-search-tenant.vue";
import ManteinanceTenant from "@/DriveSafe/pages/manteinance-tenant.vue";
import Login from "@/DriveSafe/pages/login.vue";
export default {
  name:"App",
  components: {
    CarSearchTenant,
    ManteinanceTenant,
    Login
  },
};
</script>

<style scoped>

</style>

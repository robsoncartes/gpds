<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import router from "./router";

export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    sair() {
      router.push("/login");
    }
  },

  mounted() {
    console.log(this.$firebase);
  }
};
</script>

<style src="./assets/sass/style.scss" lang="scss">
</style>

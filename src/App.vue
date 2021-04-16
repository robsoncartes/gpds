<template>
  <div id="app">
    <base-spinner/>
    <router-view/>
  </div>
</template>

<script>
import router from "./router";
import BaseSpinner from "./components/BaseSpinner";

export default {
  data() {
    return {};
  },
  components: {
    BaseSpinner
  },
  methods: {},

  mounted() {
    this.$firebase.auth().onAuthStateChanged(user => {
      window.uid = user ? user.uid : null;
      router.push(window.uid ? "/" : "/login");

      setTimeout(() => {
        this.$root.$emit("Spinner::hide");
      }, 1000);
    });
  }
};
</script>

<style src="./assets/sass/style.scss" lang="scss">
</style>

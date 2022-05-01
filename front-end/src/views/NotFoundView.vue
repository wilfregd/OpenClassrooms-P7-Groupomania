<template>
  <h1>404 Page Not Found</h1>
  <button @click.prevent="onReturn">Retour à l'accueil</button>
</template>

<script>
export default {
  methods: {
    onReturn() {
      this.$router.push("/");
    },
  },
};
</script>

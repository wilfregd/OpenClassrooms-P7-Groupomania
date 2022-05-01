<template>
  <nav class="navbar" v-if="!$route.meta.hideDefaultTemplate && user" v-cloak>
    <router-link to="/">
      <img
        class="navbar__logo"
        alt="Logo Groupomania"
        src="./assets/logo/icon.svg"
      />
    </router-link>
    <div class="navbar__userInfo">
      <div class="navbar__userInfo__name">
        <router-link :to="{ name: 'user', params: { id: `${user.id}` } }">
          <img
            class="userpic"
            v-if="user.profilePic"
            v-bind:src="`${user.profilePic}`"
            alt="Photo de profil utilisateur"
          />
        </router-link>
      </div>
      <h3>{{ user.prenom }}</h3>
      <div class="navbar__userInfo__icons">
        <router-link to="/settings">
          <button>
            <i class="fa-solid fa-gear fa-lg"></i>
          </button>
        </router-link>
        <button @click.prevent="onLogout">
          <i class="fa-solid fa-arrow-right-from-bracket fa-lg"></i>
        </button>
      </div>
    </div>
  </nav>
  <div class="site-wrapper">
    <router-view v-if="user" @update-user="onUpdateUser" v-bind:user="user" />
    <!--<footerMain v-if="!$route.meta.hideDefaultTemplate" />-->
  </div>
</template>

<script>
//import footerMain from "@/layout/footerMain.vue";
import axios from "axios";
import config from "./axios-config";

export default {
  data() {
    return {
      user: {},
      userSearchText: "",
    };
  },
  components: {
    //footerMain,
  },
  beforeRouteEnter() {},
  beforeCreate() {
    if (
      document.cookie.indexOf("userToken") == -1 &&
      this.$route.name != "auth"
    ) {
      this.$router.push("/auth");
    } else {
      axios
        .get("http://localhost:8000/api/auth/isloggedin", config)
        .then((response) => {
          if (response.data.message == 0) {
            //Redirection si l'utilisateur n'est pas connecté
            this.$router.push("/auth");
          } else {
            //Connecté, on obtiens l'utilisateur actuel
            this.user = response.data;
          }
        })
        .catch(() => {
          this.$router.push("/auth");
        });
    }
  },
  methods: {
    onUpdateUser(data) {
      this.user = data;
    },
    onLogout() {
      axios
        .get("http://localhost:8000/api/auth/logout", config)
        .then((response) => {
          if (response) {
            this.$router.push("/auth");
          }
        });
    },
  },
};
</script>

<style>
@import "./assets/styles/style.css";
</style>
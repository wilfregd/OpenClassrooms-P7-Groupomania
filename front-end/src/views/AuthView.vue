<template>
  <div id="container" v-cloak>
    <div class="main-content">
      <img
        src="../assets/logo/icon-left-font-monochrome-black.svg"
        alt="Logo Groupomania"
      />

      <div id="form-container">
        <!-- FORM BUTTONS -->
        <div id="form-buttons">
          <button
            class="form_button"
            @click="onClickLoginTab"
            v-bind:class="{ 'form_button--active': display == 0 }"
          >
            Connection
          </button>
          <button
            class="form_button"
            @click="onClickSignupTab"
            v-bind:class="{ 'form_button--active': display == 1 }"
          >
            Inscription
          </button>
        </div>

        <!-- LOGIN -->
        <form v-if="display == 0" class="auth-form">
          <h3 class="auth-form__title">Connection</h3>
          <input
            class="auth-form__input"
            type="email"
            placeholder="email"
            v-model="lEmail"
          />
          <input
            class="auth-form__input"
            type="password"
            placeholder="mot de passe"
            v-model="lPassword"
          />
          <button @click.prevent="onClickLogin" class="auth-form__submit">
            Se connecter
          </button>
        </form>

        <!-- SIGNUP -->
        <form v-if="display == 1" class="auth-form">
          <h3 class="auth-form__title">Inscription</h3>
          <input
            class="auth-form__input"
            type="text"
            placeholder="nom"
            v-model="sNom"
          />
          <input
            class="auth-form__input"
            type="text"
            placeholder="prénom"
            v-model="sPrenom"
          />
          <input
            class="auth-form__input"
            type="email"
            placeholder="email"
            v-model="sEmail"
          />
          <input
            class="auth-form__input"
            type="password"
            placeholder="mot de passe"
            v-model="sPassword"
          />
          <input
            class="auth-form__input"
            type="password"
            placeholder="confirmation mot de passe"
            v-model="sConfPassword"
          />
          <button @click.prevent="onClickSignup" class="auth-form__submit">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
import config from "../axios-config";

export default {
  name: "AuthView",
  components: {},
  data() {
    return {
      display: 0,

      //Login form
      lEmail: "",
      lPassword: "",

      //Signup form
      sNom: "",
      sPrenom: "",
      sEmail: "",
      sPassword: "",
      sConfPassword: "", //TODO manage password confirm
    };
  },
  created() {
    //Vérification d'une connection existante avec le serveur
    axios
      .get("http://localhost:8000/api/auth/isloggedin", config)
      .then((response) => {
        if (response.data.user) {
          //Connecté, redirection
          this.$router.push("/");
        }
      });
  },
  methods: {
    //Tabs
    onClickLoginTab() {
      this.display = 0;
    },

    onClickSignupTab() {
      this.display = 1;
    },

    //Actions
    onClickLogin() {
      //Logging In
      axios
        .post(
          "http://localhost:8000/api/auth/login",
          {
            email: this.lEmail,
            password: this.lPassword,
          },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            //Connecté, redirection
            this.$emit("update-user", response.data);
            this.$router.push("/");
          }
        });
    },
    onClickSignup() {
      //Signing Up
      axios
        .post(
          "http://localhost:8000/api/auth/signup",
          {
            nom: this.sNom,
            prenom: this.sPrenom,
            email: this.sEmail,
            password: this.sPassword,
          },
          config
        )
        .then((response) => {
          if (response.status == 201) {
            //Inscrit et connecté, redirection
            this.$emit("update-user", response.data);
            this.$router.push("/");
          }
        });
    },
  },
};
</script>
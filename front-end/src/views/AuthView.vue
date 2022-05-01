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
          <h5 class="error" v-if="lErrors.email">{{ lErrors.email }}</h5>
          <input
            class="auth-form__input"
            type="email"
            placeholder="email"
            v-model="lFormValues.email"
          />
          <h5 class="error" v-if="lErrors.password">{{ lErrors.password }}</h5>
          <input
            class="auth-form__input"
            type="password"
            placeholder="mot de passe"
            v-model="lFormValues.password"
          />
          <button @click.prevent="onClickLogin" class="auth-form__submit">
            Se connecter
          </button>
        </form>

        <!-- SIGNUP -->
        <form v-if="display == 1" class="auth-form">
          <h3 class="auth-form__title">Inscription</h3>
          <h5 class="error" v-if="sErrors.nom">{{ sErrors.nom }}</h5>
          <input
            class="auth-form__input"
            type="text"
            placeholder="nom"
            v-model="sFormValues.nom"
          />
          <h5 class="error" v-if="sErrors.prenom">{{ sErrors.prenom }}</h5>
          <input
            class="auth-form__input"
            type="text"
            placeholder="prénom"
            v-model="sFormValues.prenom"
          />
          <h5 class="error" v-if="sErrors.email">{{ sErrors.email }}</h5>
          <input
            class="auth-form__input"
            type="email"
            placeholder="email"
            v-model="sFormValues.email"
          />
          <h5 class="error" v-if="sErrors.password">{{ sErrors.password }}</h5>
          <input
            class="auth-form__input"
            type="password"
            placeholder="mot de passe"
            v-model="sFormValues.password"
          />
          <h5 class="error" v-if="sErrors.confPassword">
            {{ sErrors.confPassword }}
          </h5>
          <input
            class="auth-form__input"
            type="password"
            placeholder="confirmation mot de passe"
            v-model="sFormValues.confPassword"
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
      lFormValues: {
        email: "",
        password: "",
      },

      //Signup form
      sFormValues: {
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confPassword: "",
      },

      lErrors: {},
      sErrors: {},
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
            email: this.lFormValues.email,
            password: this.lFormValues.password,
          },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            //Connecté, redirection
            this.$emit("update-user", response.data);
            this.$router.push("/");
          }
        })
        .catch((err) => {
          //Affichage des erreurs obtenues
          const errObj = JSON.parse(JSON.stringify(err.response));
          this.lErrors = errObj.data;
        });
    },
    onClickSignup() {
      //Signing Up
      this.sErrors = {};

      axios
        .post(
          "http://localhost:8000/api/auth/signup",
          {
            nom: this.sFormValues.nom,
            prenom: this.sFormValues.prenom,
            email: this.sFormValues.email,
            password: this.sFormValues.password,
            confPassword: this.sFormValues.confPassword,
          },
          config
        )
        .then((response) => {
          if (response && response.status == 201) {
            //Inscrit et connecté, redirection
            this.$emit("update-user", response.data);
            this.$router.push("/");
          }
        })
        .catch((err) => {
          //Affichage des erreurs obtenues
          const errObj = JSON.parse(JSON.stringify(err.response));
          this.sErrors = errObj.data;
        });
    },
  },
};
</script>
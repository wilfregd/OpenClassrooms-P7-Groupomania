<template>
  <div class="page-content">
    <form v-if="user" class="settings-form">
      <h3>Paramètres de {{ user.prenom }}</h3>
      <h5>Nom</h5>
      <input
        class="settings-input"
        v-model="userNom"
        type="text"
        placeholder="nom"
      />
      <h5>Prénom</h5>
      <input
        class="settings-input"
        v-model="userPrenom"
        type="text"
        placeholder="prenom"
      />
      <h5>Description</h5>
      <textarea
        class="settings-input"
        v-model="userDescription"
        placeholder="description"
      />
      <div class="settings-picture">
        <h5>Image de profil</h5>
        <input @change="onUploadImage" type="file" accept=".jpg,.jpeg,.png" />
        <img
          v-if="user.profilePic"
          v-bind:src="`${user.profilePic}`"
          alt="Utilisateur {{user.prenom}} {{user.nom}}"
        />
      </div>
      <button class="btn" @click.prevent="onUpdateUserInfo">
        Modifier les informations
      </button>
      <button class="btn btn--red btn--right" @click.prevent="onDeleteUser">
        Supprimer le compte
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../axios-config";

export default {
  name: "SettingsView",
  props: ["user"],
  emits: ["update-user"],
  data() {
    return {
      userNom: "",
      userPrenom: "",
      userDescription: "",
      formFile: null,
    };
  },
  methods: {
    onUploadImage(e) {
      this.formFile = e.target.files[0];
    },
    onDeleteUser() {
      axios
        .post(
          "http://localhost:8000/api/user/deleteaccount",
          { id: this.user.id },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            this.$router.push("/auth");
          }
        })
        .catch((err) => console.log(err));
    },
    onUpdateUserInfo() {
      const formData = new FormData();
      formData.append("id", this.user.id);
      formData.append("nom", this.userNom);
      formData.append("prenom", this.userPrenom);
      formData.append("description", this.userDescription);

      if (this.formFile != null) {
        formData.append("image", this.formFile, this.formFile.name);
      }

      axios
        .put("http://localhost:8000/api/user/updateuser", formData, config)
        .then((response) => {
          if (response.status == 200) {
            const userData = {
              id: response.data.id,
              nom: response.data.nom,
              prenom: response.data.prenom,
              description: response.data.description,
              profilePic: response.data.profilePic,
            };

            this.$emit("update-user", userData);
          }
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.userNom = this.user.nom;
    this.userPrenom = this.user.prenom;
    this.userDescription = this.user.description;
  },
};
</script>
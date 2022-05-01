<template>
  <div v-if="comment" class="comment">
    <div class="comment__user">
      <router-link :to="{ name: 'user', params: { id: `${comment.userId}` } }">
        <img
          class="userpic comment__image"
          v-bind:src="`${comment.user.profilePic}`"
          :alt="`Utilisateur ${comment.user.prenom} ${comment.user.nom}`"
        />
      </router-link>
      <div class="comment__userinfo">
        <h4>{{ comment.user.prenom }} {{ comment.user.nom }}</h4>
        <h6>{{ formattedTimestamp }}</h6>
      </div>
      <div v-if="isUserComment" class="comment__buttons">
        <button class="post__buttons__btn" @click="onEditMode">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="post__buttons__btn" @click="onDeleteComment">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <div class="comment__content">
      <p v-if="!isEditMode">{{ comment.text }}</p>
      <form v-else>
        <h5 class="error" v-if="cEditError">{{ cEditError }}</h5>
        <div class="comment__edit-form">
          <input
            type="text"
            placeholder="Modifier le commentaire..."
            v-model="commentText"
          />
          <button class="btn" @click.prevent="onUpdateComment">Modifier</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "postComment",
  props: ["comment", "user"],
  data() {
    return {
      formattedTimestamp: "00/00/00 à 00:00",
      isUserComment: false,
      isEditMode: false,
      cEditError: "",
      commentText: "",
    };
  },
  methods: {
    onEditMode() {
      this.commentText = this.comment.text;
      this.isEditMode = !this.isEditMode;

      if (this.isEditMode) {
        this.cEditError = "";
      }
    },
    onDeleteComment() {
      this.$emit("delete-comment", this.comment.id);
    },
    onUpdateComment() {
      this.cEditError = "";

      //Vérifier les inputs
      if (this.commentText == "") {
        this.cEditError = "Le commentaire ne peut pas être vide.";
      } else {
        const data = {
          id: this.comment.id,
          text: this.commentText,
        };
        this.isEditMode = false;
        this.commentText = "";
        this.$emit("update-comment", data);
      }
    },
  },
  created() {
    this.isUserComment =
      this.user.id == this.comment.userId || this.user.isAdmin;
    this.commentText = this.comment.text;

    if (this.comment.timestamp != null && this.comment.timestamp != "") {
      const values = this.comment.timestamp.split("T");
      const date = values[0].split("-");
      const time = values[1].split(":");
      this.formattedTimestamp = `${date[2]}/${date[1]}/${date[0]} à ${time[0]}h${time[1]}`;
    }
  },
};
</script>
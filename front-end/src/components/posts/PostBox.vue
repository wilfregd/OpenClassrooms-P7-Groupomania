<template>
  <div class="post">
    <div class="post__userInfo">
      <router-link :to="{ name: 'user', params: { id: `${post.userId}` } }">
        <img
          class="userpic post__userPic"
          v-bind:src="`${post.user.profilePic}`"
          :alt="`Utilisateur ${post.user.prenom} ${post.user.nom}`"
        />
      </router-link>
      <div class="post__usertext">
        <h3>{{ post.user.prenom }} {{ post.user.nom }}</h3>
        <h5 class="post__usertext__time">{{ formattedTimestamp }}</h5>
      </div>
      <div v-if="isUserPost" class="post__buttons">
        <button class="post__buttons__btn" @click="onEditMode">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="post__buttons__btn" @click="onDeletePost">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <div class="post__content">
      <!-- EDIT MODE -->
      <div class="post-editbox" v-if="isEditMode">
        <h4>Modifier le post:</h4>
        <form v-on:submit.prevent="onEditPost" enctype="multipart/form-data">
          <h5 class="error" v-if="pEditError">{{ pEditError }}</h5>
          <textarea v-model="postTextEdit" placeholder="Modifier le texte..." />
          <input @change="onUploadImage" type="file" accept=".jpg,.jpeg,.png" />
          <button class="btn">Modifier</button>
        </form>
      </div>

      <!-- CONTENU -->
      <div>
        <p>{{ post.text }}</p>
        <div v-if="post.image !== ''" class="post__imageContainer">
          <img
            class="post__image"
            v-bind:src="`http://localhost:8000/${post.image}`"
            alt="Image du post"
          />
          <button
            @click="onDeletePostImage"
            v-if="isUserPost && post.text != ''"
          >
            <span style="font-size: 2.1em; color: white">
              <i class="fa-regular fa-circle-xmark"></i>
            </span>
          </button>
        </div>
        <div class="comments_box">
          <h5>Commentaires:</h5>
          <div class="comments__container">
            <postComment
              v-for="(comment, i) in post.comments"
              :key="i"
              v-bind:comment="post.comments[i]"
              v-bind:user="this.user"
              v-on:delete-comment="onDeleteComment"
              v-on:update-comment="onUpdateComment"
            />
          </div>
          <div class="comment_form">
            <img
              class="userpic comment_form__userPic"
              v-bind:src="`${user.profilePic}`"
              alt="Utilisateur {{post.user.prenom}} {{post.user.nom}}"
            />
            <form>
              <input
                v-model="commentText"
                type="text"
                placeholder="Commenter la publication"
              />
              <button @click.prevent="onAddComment" class="btn">
                Commenter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../axios-config";
import postComment from "@/components/posts/PostComment.vue";

export default {
  name: "postBox",
  props: ["post", "user"],
  components: {
    postComment,
  },
  data() {
    return {
      formattedTimestamp: "00/00/00 00:00",
      commentText: "", //TODO make sure it's not empty
      isUserPost: false,
      isEditMode: false,
      pEditError: "",
      comments: [],

      //Post edit
      postTextEdit: "",
      postFileEdit: null,
    };
  },
  methods: {
    onUpdateComment(data) {
      const commentData = {
        id: data.id,
        text: data.text,
      };
      axios
        .put(
          "http://localhost:8000/api/post/updatecomment/",
          commentData,
          config
        )
        .then((response) => {
          if (response.status == 200) {
            const selComment = this.comments.find(
              (comment) => comment.id == data.id
            );
            selComment.text = data.text;
          }
        })
        .catch((err) => console.log(err));
    },
    onDeleteComment(commentId) {
      axios
        .delete(
          "http://localhost:8000/api/post/deletecomment/" + commentId,
          config
        )
        .then((response) => {
          if (response.status == 200) {
            console.log("Deleted comment");
            const selComment = this.comments.find(
              (comment) => comment.id == commentId
            );
            this.comments.splice(this.comments.indexOf(selComment), 1);
          }
        })
        .catch((err) => console.log(err));
    },
    onUploadImage(e) {
      this.postFileEdit = e.target.files[0];
    },
    onDeletePost() {
      this.$emit("delete-post", this.post.id);
    },
    onDeletePostImage() {
      axios
        .post(
          "http://localhost:8000/api/post/removepostimage",
          { id: this.post.id },
          config
        )
        .then((response) => {
          if (response.status == 200) {
            this.$emit("edit-post-values", response.data);
          }
        })
        .catch((err) => console.log(err));
    },
    onEditPost() {
      this.pEditError = "";

      //Vérifier les inputs
      if (this.postTextEdit == "" && this.postFileEdit == null) {
        this.pEditError = "Le post ne peut pas être vide.";
      } else {
        const formData = new FormData();
        formData.append("id", this.post.id);
        formData.append("text", this.postTextEdit);

        if (this.postFileEdit != null) {
          formData.append("image", this.postFileEdit, this.postFileEdit.name);
        }

        axios
          .put("http://localhost:8000/api/post/updatepost", formData, config)
          .then((response) => {
            if (response.status == 200) {
              this.postTextEdit = "";
              this.postFileEdit = null;
              this.isEditMode = false;
              this.$emit("edit-post-values", response.data);
            }
          })
          .catch((err) => console.log(err));
      }
    },
    onEditMode() {
      this.postTextEdit = this.post.text;
      this.isEditMode = !this.isEditMode;

      if (this.isEditMode) {
        this.pEditError = "";
      }
    },
    onAddComment() {
      const commentObj = {
        id: this.post.id,
        text: this.commentText,
      };

      axios
        .post(
          "http://localhost:8000/api/post/createcomment",
          commentObj,
          config
        )
        .then((response) => {
          if (response.status == 201) {
            const commentInfo = {
              postId: this.post.id,
              comment: response.data,
            };

            this.commentText = "";
            this.$emit("added-comment", commentInfo);
          }
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.comments = this.post.comments;
    this.isUserPost = this.post.userId == this.user.id || this.user.isAdmin;

    if (this.post.timestamp != null && this.post.timestamp != "") {
      const values = this.post.timestamp.split("T");
      const date = values[0].split("-");
      const time = values[1].split(":");
      this.formattedTimestamp = `${date[2]}/${date[1]}/${date[0]} à ${time[0]}h${time[1]}`;
    }
  },
};
</script>
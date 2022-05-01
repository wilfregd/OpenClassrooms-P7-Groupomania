<template>
  <div class="page-content">
    <div class="post_container">
      <h2>Publications des autres membres</h2>
      <div class="newpost">
        <img
          v-if="this.user.profilePic"
          class="userpic newpost__userPic"
          v-bind:src="`${this.user.profilePic}`"
          :alt="`Utilisateur ${this.user.prenom} ${this.user.nom}`"
        />
        <form v-on:submit.prevent="onPublishPost" enctype="multipart/form-data">
          <h5 class="error" v-if="nPostError">{{ nPostError }}</h5>
          <textarea v-model="postText" placeholder="Nouvelle publication" />
          <input @change="onUploadImage" type="file" accept=".jpg,.jpeg,.png" />
          <button class="btn">Publier</button>
        </form>
      </div>
      <postBox
        v-on:added-comment="onAddedComment"
        v-on:edit-post-values="onUpdatePost"
        v-on:delete-post="onDeletePost"
        v-for="(post, i) in posts"
        :key="i"
        v-bind:post="posts[i]"
        v-bind:user="user"
      />
    </div>
    <div v-if="noPost">
      <h1>No post</h1>
    </div>
  </div>
</template>

<script>
import postBox from "@/components/posts/PostBox.vue";
import axios from "axios";
import config from "../axios-config";

export default {
  name: "HomeView",
  props: ["user"],
  components: {
    postBox,
  },
  data() {
    return {
      noPost: false,
      posts: [],
      nPostError: "",
      postText: "",
      postFile: null,
    };
  },
  methods: {
    onUpdatePost(data) {
      const selPost = this.posts.find((post) => post.id == data.id);
      selPost.text = data.text;

      if (data.isImageEdited) {
        selPost.image = data.image;
      }

      selPost.timestamp = data.timestamp;
    },
    onDeletePost(postId) {
      //Delete from DB
      axios
        .delete("http://localhost:8000/api/post/deletepost/" + postId, config)
        .then((response) => {
          if (response.status == 200) {
            const selPost = this.posts.find((post) => post.id == postId);
            this.posts.splice(this.posts.indexOf(selPost), 1);
          }
        })
        .catch((err) => console.log(err));
    },
    onAddedComment(info) {
      //Get new comment
      info.comment.user = this.user;

      //Format new timestamp
      const date = new Date(Date.now());
      const formattedTimeStamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}:${date.getMinutes()}`;
      info.comment.timestamp = formattedTimeStamp;

      const commentPost = this.posts.find((post) => post.id == info.postId);
      commentPost.comments.push(info.comment);
    },
    onUploadImage(e) {
      this.postFile = e.target.files[0];
    },
    onPublishPost() {
      this.nPostError = "";

      //Vérifier les inputs
      if (this.postText == "" && this.postFile == null) {
        this.nPostError = "Le post ne peut pas être vide.";
      } else {
        const formData = new FormData();
        formData.append("text", this.postText);

        if (this.postFile != null) {
          formData.append("image", this.postFile, this.postFile.name);
        }

        axios
          .post("http://localhost:8000/api/post/createpost", formData, config)
          .then((response) => {
            if (response.status == 201) {
              this.$router.go();
            }
          })
          .catch((err) => console.log(err));
      }
    },
  },
  created() {
    //Vérification d'une connection existante avec le serveur
    axios
      .get("http://localhost:8000/api/auth/isloggedin", config)
      .then((response) => {
        if (response.data.message == 0) {
          //Déconnecté, redirection
          this.$router.push("auth");
        }
      });

    //Obtention des posts
    axios
      .get("http://localhost:8000/api/post/getallposts", config)
      .then((response) => {
        const posts = response.data;

        if (posts) {
          this.posts = posts.reverse();
        } else {
          this.noPost = true;
        }
      });
  },
};
</script>
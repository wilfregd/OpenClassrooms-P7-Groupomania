<template>
  <div class="page-content">
    <div v-if="pageUser && !isNotFound" class="user-infobox">
      <!--IMAGE-->
      <img
        v-bind:src="`${pageUser.profilePic}`"
        :alt="`Utilisateur ${pageUser.prenom} ${pageUser.nom}`"
      />
      <div class="user-infobox__infos">
        <h3>{{ pageUser.prenom }} {{ pageUser.nom }}</h3>
        <h4>A propos de {{ pageUser.prenom }}:</h4>
        <p>{{ pageUser.description }}</p>
      </div>
      <!--INFO COLUMN-->
    </div>
    <div v-if="pageUser && !isNotFound" class="post_container" v-cloak>
      <h3>Publications de {{ pageUser.prenom }} {{ pageUser.nom }}</h3>
      <postBox
        v-for="(post, i) in posts"
        :key="i"
        v-bind:post="posts[i]"
        v-bind:user="pageUser"
        v-on:edit-post-values="onUpdatePost"
      />
    </div>
    <div v-if="isNotFound" class="post_container">
      <h1>This user does not exist</h1>
    </div>
  </div>
</template>

<script>
import postBox from "@/components/posts/PostBox.vue";
import axios from "axios";
import config from "../axios-config";

export default {
  name: "UserView",
  props: ["user"],
  emits: ["update-user"],
  components: {
    postBox,
  },
  data() {
    return {
      pageUser: null,
      posts: [],
      isNotFound: false,
      userId: -1,
    };
  },
  watch: {
    "$route.params.id": function () {
      this.loadData();
    },
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
    loadData() {
      if (this.$route.name == "user") {
        //Mise à jour de l'utilisateur demandé
        this.userId = this.$route.params.id;

        //Obtention de l'utilisateur demandé
        axios
          .get("http://localhost:8000/api/user/" + this.userId, config)
          .then((response) => {
            if (response.status == 200) {
              this.pageUser = JSON.parse(response.data);

              //Obtention des posts
              axios
                .get(
                  "http://localhost:8000/api/post/getallposts/" + this.userId,
                  config
                )
                .then((response) => {
                  this.isNotFound = false;
                  const posts = response.data;

                  if (posts) {
                    this.posts = posts.reverse();
                  } else {
                    this.noPost = true;
                  }
                });
            } else {
              this.isNotFound = true;
            }
          })
          .catch(() => {
            this.isNotFound = true;
          });
      }
    },
  },
  beforeMount() {
    this.loadData();
  },
};
</script>
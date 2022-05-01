import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import axios from "axios";

/*
axios.interceptors.response.use(
  (response) => response,
  (error) => {
      switch(error.response.status){
          case 401:
            router.push('/auth');
          break;
      }
  }
);
*/

createApp(App).use(router).mount('#app');

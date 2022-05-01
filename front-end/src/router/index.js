import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import SettingsView from '../views/SettingsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      hideDefaultTemplate: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: NotFoundView,
    meta: {
      hideDefaultTemplate: true
    }
  }


  /*
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" '../views/AboutView.vue')
    
  }
  */

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

  //Requiert l'authentification
  if(to.matched.some(record => record.meta.requiresAuth)){
    //TODO Check for auth cookie token
    const A = 1;
    const B = 1;
    if(A + B == 2){ //TEMP
      next();
    }
    else{
      next({name: 'auth'});
    }
  }

  //Ne requiert pas d'authentification
  else{
    next();
  }
});

export default router

import Vue from 'vue';
import Router from 'vue-router';
import MainDisplay from '@/components/MainDisplay';
import LoginScreen from '@/components/LoginScreen';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/main',
      name: 'MainDisplay',
      component: MainDisplay
    },
    {
      path: '/login',
      name: 'LoginScreen',
      component: LoginScreen
    }
  ]
})


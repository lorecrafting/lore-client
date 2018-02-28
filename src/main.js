// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import App from "./App";
import router from "./router"
import Evennia from "./utils/evennia";

// Activate sentry.io error tracking
// TODO: Refactor sentry access ID to env variable when opening repo to public
Raven
    .config('https://fa7767deeb7049ec95c890522cdafaeb@sentry.io/296217')
    .addPlugin(RavenVue, Vue)
    .install();


// Evennia.js needs these two global variables to initialize
window.wsurl = process.env.WSURL
window.wsactive = true;
// window.wsurl = "wss://lorecraft.io/ws"

// Initialize Evennia connect library
Evennia.init()

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router"
import Evennia from "./utils/evennia";


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

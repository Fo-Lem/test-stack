import { createApp } from "vue";
import App from "./App.vue";
import VueCookies from "vue-cookies";


import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";
import "./assets/index.scss"
import 'primeicons/primeicons.css'

createApp(App)
.use(PrimeVue)
.use(VueCookies,
   { expires: '7d'})
.mount("#app");

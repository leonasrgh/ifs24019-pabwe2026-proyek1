import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router.js";
import { setUnauthorizedHandler } from "./helpers/apiHelper.js";
import { useAuthStore } from "./features/auth/states/authStore.js";
import "./index.css";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Token kedaluwarsa/tidak valid -> keluar otomatis.
setUnauthorizedHandler(() => {
  useAuthStore(pinia).logout();
  router.push("/auth/login");
});

app.mount("#app");

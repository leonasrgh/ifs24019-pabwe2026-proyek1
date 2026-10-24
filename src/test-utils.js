import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

export { flushPromises };

const Stub = { template: "<div />" };

export async function mountPage(component, { route = "/", path = "/", props = {}, routes = [] } = {}) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path, component },
      { path: "/:pathMatch(.*)*", component: Stub },
      ...routes,
    ],
  });
  router.push(route);
  await router.isReady();
  const wrapper = mount(component, { props, global: { plugins: [pinia, router] } });
  await flushPromises();
  return { wrapper, router, pinia };
}

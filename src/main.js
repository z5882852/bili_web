import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import axios from 'axios';

const app = createApp(App)
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title == undefined ? 'BLOSS' : to.meta.title
    next();
})
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.mount('#app')


// window.$baseURL = 'http://localhost:8089'
window.$baseURL = 'http://114.132.72.61:1022'
window.$axios = axios.create({
    //设置超时时间
    timeout: 8000,
    baseURL: window.$baseURL,
});


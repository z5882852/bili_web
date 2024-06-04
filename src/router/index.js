import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home.vue";
import intro from "@/views/Intro.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: {
                title: 'BLOSS | 首页'
            }
        },
        {
            path: '/intro',
            name: "intro",
            component: intro,
            meta: {
                title: 'BLOSS | 介绍'
            }
        }
    ]
})

export default router

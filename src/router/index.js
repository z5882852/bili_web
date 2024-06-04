import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home.vue";
import intro from "@/views/Intro.vue";
import login from "@/views/Login.vue";
import register from "@/views/Register.vue";

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
            path: "/home",
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
        },
        {
            path: '/login',
            name: "login",
            component: login,
            meta: {
                title: 'BLOSS | 登录'
            }
        },
        {
            path: '/register',
            name: "register",
            component: register,
            meta: {
                title: 'BLOSS | 注册'
            }
        }
    ]
})

export default router

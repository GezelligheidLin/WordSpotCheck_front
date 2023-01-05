// @ts-ignore
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
const history = createWebHistory()
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/showWord",
    },
    {
        path: "/showWord",
        name: "showWord",
        component: () => import("../pages/showWord.vue"),
        children : [
            {
                path:"",
                redirect:"/showWord/word"
            },
            {
                path:"word",
                name:"word",
                component: () => import("../pages/layout/word.vue")
            }
        ]
    },
];
const router = createRouter({
    history,
    routes
})
export default router

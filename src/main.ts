import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import axios from "axios";
import Store, {key} from "./store/index"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$http = axios
app.use(ElementPlus).use(Store,key).use(router).mount('#app')

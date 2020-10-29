import Vue from 'vue'
import App from './App'
// 引入vuex
import store from 'store/index.js'
Vue.config.productionTip = false
// 将vuex定义为全局组件
Vue.prototype.$store = store
App.mpType = 'app'
// 引入loading组件 全局挂载
import vLoad from 'element/loading.vue'
Vue.component("v-load",vLoad)
const app = new Vue({
    ...App,
	// 挂载
	store
})
app.$mount()

// 引入vue
import Vue from 'vue'
// 引入vuex
import Vuex from 'vuex'
// 引入同步存储
Vue.use(Vuex)
// 存储筛选的数据
const screen = {
	data:[]
}
// 仓库存储
const state={
	screen
}
 /* 同步存储 */
const mutations = {
	// 存储筛选数据
	screenMutations(state,data){
		console.log(234343,data,state)
		state.screen={
			data
		}
	}
}
// 定义公共的数据和函数并且导出
const store = new Vuex.Store({
	state,
	// 同步存储
	mutations
	// 异步操作
	// actions
})
export default store 
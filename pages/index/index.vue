<template>
	<view class="contenting">
		<Search></Search>
		<Preference :preferdata="preferdata"></Preference>
		<Title></Title>
		<view @click="Topping" :catchtouchmove="true">
			<Delicacy  class="delicacy" :class="{'is_fixed':calculation}" @poststartingurl="poststartingurl" @postmultipleurl="postmultipleurl"></Delicacy>
		</view>
		<view class="takeout">
			<Takeout :takeshop="takeshop"></Takeout>
		</view>
		<v-load v-if="isLoad"></v-load>
	</view>
</template>

<script>
	import Search from './components/search.vue'
	import Title from './components/title.vue'
	import Delicacy from './components/delicacy.vue'
	import Takeout from './components/takeout.vue'
	import Preference from './components/preference.vue'
	import {API} from '../../api/request.js'
	// 引入vuex
	import {mapState,mapMutations} from 'vuex'
	let dcTop =0
	const api = new API();
	export default {
		// 注册组件
		components:{
			Search,
			Title,
			Delicacy,
			Takeout,
			Preference
		},
		data() {
			return {
				preferdata:[],
				takeshop:[],
				sTop:0,
				isLoad:true
			}
		},
		onLoad() {
			console.dir(uni,"看看")
          this.onInit()
		},
		methods: {
			// 初始化
			onInit(){
				this.onAPI()
			},
			onAPI(){
				const params = [api.getprefer(),api.getwxshopurl()]
				Promise.all(params).then(res=>{
					console.dir(res,"并发接口")
					 this.preferdata=res[0].data
					 this.takeshop=res[1].data
					 this.isLoad=false
				}).catch(err=>{
					 console.log(err,"获取数据失败")
				})
			},
			// 选择综合排序 获取商家列表
			poststartingurl(param){
				this.isLoad=true
				console.log(param,'请求参数')
				api.poststartingurl(param).then(res=>{
					this.$store.commit('screenMutations',res.data)
					 this.takeshop=res.data
					 this.isLoad=false
				}).catch(err=>{
					 console.log(err,"获取数据失败")
				})
			},
			// 筛选
			postmultipleurl(param){
				this.isLoad=true
				api.postmultipleurl(param).then(res=>{
					 this.takeshop=res.data
					 this.isLoad=false
				}).catch(err=>{
					 console.log(err,"获取数据失败")
				})
			},
		  // 请求商家列表
		  takeout(){
			  this.isLoad=true
			  api.getprefer().then(res=>{
			  				  this.preferdata=res.data
							  this.isLoad=false
			  }).catch(error=>{
			  				  console.log(error,"获取数据失败")
			  })
		  },
		  getElement(){
		  	let query=uni.createSelectorQuery()
		  		query.select('.delicacy').boundingClientRect(res=>{
		  	       dcTop = res.top
				   console.log(res,"是是是",dcTop)
		  	}).exec(()=>{
		  	console.log("没有获取到")
		  	 })	
		  },
		  Topping(){
			  if(this.sTop>dcTop) return
			  wx.pageScrollTo({
				  scrollTop:dcTop+1,
				  duration:300
			  })
		  }
		},
		mounted() {
			// this.preference()
			this.getElement()
		},
		
		onPageScroll(e){
			this.sTop=e.scrollTop
		},
		computed:{
			...mapState(['screen']),
			calculation(){
				return this.sTop>dcTop
			},
			cont(){
				console.log(this.screen,"监听我看看")
			}
		}
		
	}
</script>

<style scoped>
	.contenting{margin: 0 15upx;}
	.is_fixed{position: fixed; left: 0; top: 0; right: 0;}
	.takeout {
		padding-top: 70upx;
	}
</style>

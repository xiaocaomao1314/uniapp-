<template>
	<view>
		<!-- uniapp生成小程序不能使用v-show = display:none -->
		<!-- 商家介绍 -->
		<Business :busidata="busidata"></Business>
		<!-- tab切换 -->
		<Tabs></Tabs>
		<view class="ordering-sceate">
			<!-- 商品下单 -->
	    <!-- 商品下单 -->
	    <Ordering :orderingdata="orderingdata" :class="[hideing === 0 ? 'actineclass' : 'errorclass']" :busidata="busidata"></Ordering>
	    <!-- 评价 -->
	    <Message :class="[hideing === 1 ? 'actineclass' : 'errorclass']" :messagedata="messagedata" :classmessage="classmessage"></Message>
	    <!-- 商家详情 -->
	    <Introduce 
	    :class="[hideing === 2 ? 'actineclass' : 'errorclass']" :busidata="busidata"></Introduce>
		</view>
		<!-- loading -->
		<!-- <home-load v-if="efinition"></home-load> -->
		<v-load v-if="isLoad"></v-load>
	</view>
</template>

<script>
	import Business from './components/business.vue'
	import Tabs from './components/tabs.vue'
	import Ordering from './components/ordering.vue'
	import Message from './components/message.vue'
	import Introduce from './components/introduce.vue'
	import { API } from '../../api/request.js';
	const api = new API();
	export default{
		components:{
			Business,
			Tabs,
			Message,
			Ordering,
			Introduce,
		},
		data() {
			return {
				busidata: {},
				messagedata:[],
				orderingdata:[],
				hideing:0,
				classmessage:[],
				id:'',
				isLoad:true
			}
		},
		onLoad(options){
			console.log(options,"参数聊天")
			this.id = options.id
			this.request(options.id)
		},
		methods:{
			// 被子组件tabs调用的方法
			fatherMethod(index){
				console.log(index,"看会计师")
				this.hideing = index
			},
			request(id){
				const param0 = {openid:id}
				const param1 = {merchantid:id}
				Promise.all([api.postshopurl(param0),api.postgetdishesurl(param0),api.postdiscussurl(param1)]).then(res=>{
					console.log(res)
					this.isLoad=false
					this.busidata=res[0].data[0]
					this.orderingdata=res[1].data
					console.log(this.orderingdata)
					this.messagedata = res[2].data
					const classmessage = Array.from(new Set(res[2].data.reduce((p,c)=>{
						if(c.classmessage!==''){
							p.push(c.classmessage)
						}
						return p
					},[]))) 
					if(classmessage.length>=1){
						this.classmessage = ['全部',...classmessage]
					}
				}).catch(err=>{
					console.log("请求数据错误")
				})
			},
			// 发送请求选择评论标签进行选择
			messageMethod(item){
				const param = {merchantid:this.id};
				if(item!=='全部'){
					param.classmessage=item
				}
				api.postdiscussurl(param).then(res=>{
					this.messagedata = res.data
				}).catch(err=>{
					console.log("请求数据错误",err)
				})
			}
			// 请求商品列表
			// postshopurl(){
			// 	api.postshopurl()
			// }
		}
		}
		
</script>

<style scoped>
	.actineclass{display: block; overflow-y: auto; height: 100%;}
	.errorclass{display: none;}
	.ordering-sceate{position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 230upx;}
</style>

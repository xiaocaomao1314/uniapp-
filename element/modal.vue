<template>
	<view>
		<view class="warp" v-if="modaishow">
			<view class="warp-view">
				<view class="warp-text">请登陆后再操作</view>
				<view class="warp-flex">
					<button  plain="true" @click="messcancel">取消</button>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
				</view>
			</view>
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		<!-- <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages> -->
	</view>
</template>

<script>
	// var {log} = console
	// import {publicing} from "@/api/api.js"
	// import {wxloginurl} from '@/api/request.js'
	// 引入提示组件
	// import HMmessages from "@/components/HM-messages/HM-messages.vue"
	//引入类
	// let logins = require('../login/login.js')
	  import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import { API } from '../api/request.js';
	const api = new API();
	export default{
		components: {HMmessages},
		// components: {HMmessages},
		data() {
			return {
				modaishow: false
			}
		},
		
		methods:{
		// 	// 显示
			init(){
				this.modaishow = true
			},
		// 	// 取消
			messcancel(){
				this.modaishow = false
			},
			// 点击登录获取头像和名字
			getUserInfo(event) {
				console.log(event, '获取信息');
				if(event.detail.errMsg==='getUserInfo:ok'){
					this.onLogin(event.detail.userInfo)
				}
				
			},
			onLogin({nickName,avatarUrl}){
				const that =this
				uni.login({
					provider: 'weixin',
					success: function (res) {
						if(res.errMsg==='login:ok'){
							const {code} = res
							that.postwxloginurl({avatarUrl,nickName,code,secret:'a5095b0b452feda8dbca72a55151559a',appid:'wxf9f2c8bf16d29e10'})
						}
					    
					  }
				})
			},
			postwxloginurl(param){
				api.postwxloginurl(param).then(res=>{
					console.log('请求接口回来的数据',res)
					if(res.errMsg==="request:ok"){
						const username = res.data.datas
						uni.setStorageSync('username',username)
						const tip = {title:'登录成功',icon:'success'}
						this.tips(tip)
						this.messcancel()
					}
				}).catch(err=>{
					console.log("获取数据失败")
				})
			},
			// 登录提示
			tips({title,icon}){
			const info = {icon:icon,
			              fontColor:"#ffffff",
						  iconColor:"#ffffff",
						  background:"rgba(102,0,51,0.8)",
						  }
				this.HMmessages.show(title,info)
			}
		
		}
	}
</script>

<style scoped>
	/* 模态弹窗布局 */
	.warp{position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
	z-index: 9999;}
	.warp-view{width: 500upx;
			height: 200upx;
			background: #FFFFFF;
			margin: auto;
			position: absolute;
			-webkit-position:absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			border-radius: 8upx;
			overflow: hidden;
			}
	.warp-text{text-align: center;
			margin-top: 30upx;
			font-size: 34upx;
			color: #666666;}		
	.warp-flex{ display: flex;
		justify-content: space-around;
		border-top: 1upx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80upx;
		line-height: 80upx;
		}
	.warp-flex button{border: none;
	font-size: 30upx;}						
</style>

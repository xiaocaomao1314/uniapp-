<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
			<view class="wx-name" v-if="wxlogin">
				<view><image :src="usering.avatarUrl"></image></view>
				<view class="wx-text">
					<text>{{ usering.nickName }}</text>
				</view>
			</view>
			<!-- </block> -->
			<!-- 未登录 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="wx-button-view">登录美团外卖，开启吃货旅程</view>
				<view><button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">去登录</button></view>
			</view>
		</view>
		<v-load v-if="isLoad"></v-load>
	</view>
</template>

<script>
import { API } from '../../api/request.js';
const api = new API();
export default {
	data() {
		return {
			wxlogin: true, //避免出现未登录的界面
			usering: {},
			isLoad:false
		};
	},

	methods: {
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
			this.isLoad=true
			api.postwxloginurl(param).then(res=>{
				console.log('请求接口回来的数据',res)
				if(res.errMsg==="request:ok"){
					const username = res.data.datas
					uni.setStorageSync('username',username)
					this.usering=username
					this.wxlogin=true
					this.isLoad=false
				}
			}).catch(err=>{
				console.log("获取数据失败")
			})
		},
		isLogin(){
			const username = uni.getStorageSync('username')
			if(!username){
				this.wxlogin=false
			}else{
				this.usering=username
				this.wxlogin=true
			}
		}
	},
	onShow(){
		this.isLogin()
	}
};
</script>

<style scoped>
.myhome {
	background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
	height: 350upx;
	display: flex;
	align-items: center;
}
.wx-name image {
	width: 120upx !important;
	height: 120upx !important;
	border-radius: 50%;
	margin-right: 20upx;
	border: 10rpx solid #999999;
}
text {
	display: block;
	margin: 10upx 0;
	color: #999999;
}
.wx-name {
	display: flex;
	align-items: center;
	padding: 0 30upx;
	align-content: center;
	height: 200upx;
}
.wx-text text {
	font-size: 35upx;
}
/* 登录 */
.wx-button button {
	border: none;
	font-size: 30upx;
	background: linear-gradient(to right, #28a6f1 10%, #0e8dd7 80%);
	border-radius: 50upx;
	color: #ffffff;
}
.wx-button-view {
	font-size: 35upx;
	color: #ffffff;
	margin-bottom: 25upx;
}
.wx-button {
	margin: 0 auto;
}
</style>

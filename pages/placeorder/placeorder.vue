<template>
	<view>
		<view class="place-view">
			<view class="place-addres" @click="onaddres" v-if="!address">+ 新增收货地址</view>
			<!-- 已选中收货地址 -->
			<view class="goods-address" v-else>
				<view class="goods-address-left"><image src="/static/coen/address.png" mode="widthFix"></image></view>
				<view class="goods-address-in">
					<view>{{ address.provinceName + address.cityName + address.countyName + address.detailInfo }}</view>
					<view class="goods-address-name">
						<text>{{ address.userName }}</text>
						<text>{{ address.telNumber }}</text>
					</view>
				</view>
				<view class="goods-address-right"><image @click="onaddres" src="/static/coen/jiantou.png" mode="widthFix"></image></view>
			</view>
			<view class="place-time">
				<image src="/static/coen/times.png" mode="widthFix"></image>
				<text>立即送出</text>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="place-view">
			<view>
				<block v-for="(item, index) in Takeleng" :key="index">
					<view class="order-view">
						<view class="order-img"><image :src="item.image" mode="aspectFill"></image></view>
						<view class="order-title">
							<text>{{ item.input }}</text>
							<text>x{{ item.amount }}</text>
						</view>
						<view class="order-price">单价:¥{{ item.price }}</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 配送费 -->
		<view class="place-view">
			<view class="Delivery">配送费：¥{{ busidata.physical }}</view>
		</view>
		<!-- 高度 -->
		<view style="height: 140upx;"></view>
		<!-- 支付 -->
		<view class="payment">
			<view class="payment-left">
				<text>合计</text>
				<text>¥{{ Takeawayprice }}</text>
			</view>
			<view class="payment-right" @click="toPay">去支付</view>
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
// 引入提示组件
import HMmessages from '@/components/HM-messages/HM-messages.vue';
// post
import { API } from '../../api/request.js';
const api = new API();
export default {
	components: { HMmessages },
	data() {
		return {
			allorder: [],
			busidata: {},
			// 总价
			Takeawayprice: '',
			// 选择的商品
			Takeleng: [],
			// 地址
			address: undefined
		};
	},
	methods: {
		onInit() {
			var pages = getCurrentPages(); //当前页面栈
			const curpage = pages[pages.length - 2];
			const info = curpage.$vm;
			console.log(info, info.$children);
			this.busidata = info.busidata;
			const f1 = info.$children.find(v => v.identification && v.identification === 1);
			console.log(f1);
			const num = f1.Takeawayprice + info.busidata.physical;
			this.Takeawayprice = parseFloat(num.toFixed(10));
			this.Takeleng = f1.Takeleng.map((v, indexs) => {
				const {
					amount,
					_id,
					objdis: { input, image, Discount }
				} = v;
				const np = amount * Discount;
				const Totalprice = parseFloat(np.toFixed(10));
				return {
					input,
					amount,
					image,
					price: Discount,
					Totalprice,
					indexs:v.openid
				};
			});
		},
		// 去支付
		toPay() {
			// 支付之前判断客户是否选择了收货地址
			if (!this.address) {
				const tip = { title: '请填写收货地址', icon: 'error' };
				return this.tips(tip);
			}
			this.wxPay();
		},
		// 微信支付
		wxPay() {
			const { provinceName, cityName, countyName, detailInfo, userName, telNumber } = this.address;
			const { openid, logo, shop } = this.busidata;
			const peopleobj = {
				address: provinceName + cityName + countyName + detailInfo,
				name: userName,
				iphone: telNumber
			};
			const arrinfo = this.Takeleng;
			const useropenid = uni.getStorageSync('username').openid;
			const ide = openid.substring(0, 7);
			const param = {
				ide,
				peopleobj,
				arrinfo,
				logo,
				useropenid,
				type: 'placeOrder',
				merchantid: openid,
				commod: shop,
				payment: this.Takeawayprice
			};
			// 进行支付
			console.log(param);
			this.pwxpayingurl(param);
		},
		// 进行支付
		async pwxpayingurl(param) {
			const res1 = await this.wpay1(param);
			if (res1.errMsg != 'request:ok') return;
			const res2 = await this.wpay2(res1.data.datas);
			if(res2.errMsg!="request:ok") return
			const res3 = await this.wpay3(res1.data.datas, param);
			if (res3.errMsg != 'request:ok') return;
		},
		// 微信支付第一步
		// 请求获取支付信息
		wpay1(param) {
			uni.showToast({
				icon:'loading',
				mask:true,
				duration:900000,
				position:'center',
				title:'正在下单'
			})
			return new Promise((resolve, reject) => {
				api.postwxpayingurl(param)
					.then(res => {
						console.log('支付成功第一步', res);
						resolve(res);
						uni.hideToast();
					})
					.catch(err => {
						reject('获取失败');
						uni.hideToast();
					});
			});
		},
		// 微信支付第二步
		// 发起支付
		wpay2(info) {
			console.log(info, '看看');
			return new Promise((resolve, reject) => {
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: info.time_stamp,
					nonceStr: info.nonceStr,
					signType: 'MD5',
					paySign: info.payauto,
					package: `prepay_id=${info._id}`,
					success: res => {
						console.log('支付成功第二步', res);
						resolve(res);
					},
					fail: err => {
						const tip = { title: '取消支付', icon: 'success' };
						 this.tips(tip);
						reject('支付失败');
					}
				});
			});
		},
		wpay3(info, p) {
			const param = {
				type: 'paysucc',
				out_trade_no: info.out_trade_no,
				merchantid: p.merchantid,
				id: info._id
			};
			console.log(param,"看书")
			return new Promise((resolve, reject) => {
				api.postwxpayingurl(param)
					.then(res => {
						const tip = { title: '支付成功', icon: 'success' };
						 this.tips(tip);
						console.log('支付成功第三步', res);
						resolve(res);
					})
					.catch(err => {
						reject('支付失败，第三步');
					});
			});
		},

		// 跳转到收获地址
		onaddres() {
			const that = this;
			uni.chooseAddress({
				success(res) {
					that.address = res;
					uni.setStorageSync('address', res);
				}
			});
		},
		// 地址获取
		getaddres() {
			const address = uni.getStorageSync('address');

			if (address) {
				console.log(address, '获取地址看看');
				this.address = address;
			}
		},
		// 没填收获地址提示
		tips({ title, icon }) {
			const info = { icon: icon, fontColor: '#ffffff', iconColor: '#ffffff', background: 'rgba(102,0,51,0.8)' };
			this.HMmessages.show(title, info);
		}
	},

	// 接收下单页面的路径数据
	onLoad(e) {
		this.onInit();
		this.getaddres();
	}
};
</script>

<style>
page {
	background: #f4f4f4;
}
.place-view {
	background: #ffffff;
	margin: 20upx;
	border-radius: 9upx;
	padding: 35upx 15upx;
}
.place-addres {
	border: 1rpx solid #ffb000;
	width: 400upx;
	height: 80upx;
	line-height: 80upx;
	border-radius: 50upx;
	text-align: center;
	color: #ffb000;
	margin: 0 auto;
	font-size: 30upx;
}
.place-time image {
	width: 40upx;
	height: 40upx;
	padding-right: 20upx;
}
.place-time {
	display: flex;
	align-items: center;
	font-size: 30upx;
	border-top: 1rpx solid #f4f4f4;
	padding-top: 35upx;
	margin-top: 35upx;
}
/* 菜单 */
.order-view {
	display: flex;
	height: 150upx !important;
	overflow: hidden;
	margin-bottom: 15upx;
	font-size: 30upx;
}
.order-view text {
	display: block;
}
.order-img {
	width: 200upx !important;
	height: 150upx !important;
	padding-right: 15upx;
}
.order-img image {
	width: 100%;
	height: 100%;
}
.order-title {
	flex-grow: 1;
}
.order-title text:nth-child(2) {
	color: #999999;
	font-size: 25upx;
}
.Delivery {
	display: flex;
	justify-content: flex-end;
	font-size: 30upx;
}
/* 支付 */
.payment {
	background: #ffffff;
	height: 120upx;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30upx;
}
.payment-left {
	display: flex;
	align-items: center;
	font-size: 30upx;
}
.payment-left text:nth-child(2) {
	font-weight: bold;
	font-size: 32upx;
}
.payment-right {
	background: #07c160;
	color: #ffffff;
	padding: 20upx 60upx;
	font-size: 30upx;
	border-radius: 7upx;
}
/* 收货地址 */
.goods-address-left {
	width: 40upx;
	height: 40upx;
	padding-right: 20upx;
}
.goods-address-left image {
	width: 40upx;
	height: 40upx;
}
.goods-address-name {
	display: flex;
	align-items: center;
	font-size: 28upx;
	padding-top: 10upx;
}
.goods-address-right {
	width: 40upx;
	height: 40upx;
}
.goods-address-right image {
	width: 40upx;
	height: 40upx;
}
.goods-address {
	display: flex;
	align-items: center;
}
.goods-address-in {
	flex-grow: 1;
	font-size: 30upx;
}
.goods-address-name text:nth-child(1) {
	padding-right: 10upx;
}
</style>

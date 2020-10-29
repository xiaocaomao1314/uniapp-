<template>
	<view>
		<view class="ordering-fls">
			<!-- 商品分类左边 -->
			<view class="ordering-left">
				<block v-for="(item, index) in optidata" :key="index">
					<text :class="{ activeord: item == title }" @click="ontitle(item)">{{ item }}</text>
				</block>
			</view>
			<!-- 商品列表：右边 -->
			<view class="ordering-right">
				<text class="ordering-right-title">{{ title }}</text>
				<view>
					<block v-for="(item, index) in objdis" :key="index">
						<view class="content-view" v-if="item.optidata === title">
							<!-- 左边商品图片 -->
							<view class="content-img"><image :src="item.objdis.image" mode="aspectFill"></image></view>
							<!-- 右边商品 -->
							<view class="content-title">
								<text class="conteng-take">{{ item.objdis.input }}</text>
								<view class="conteng-monthly">
									<block v-for="(itemdata, index) in item.objdis.tags" :key="index">
										<text>{{ itemdata }}</text>
									</block>
								</view>
								<view class="conteng-starting"><text>月售10</text></view>
								<view class="conteng-price">
									<view class="conteng-shi">¥{{ item.objdis.Discount }}</view>
									<view class="conteng-hua">¥{{ item.objdis.Price }}</view>
									<view class="ordering-price">
										<image v-if="item.amount!==0" src="/static/coen/jianhao.png" mode="widthFix" @click="onreduce(item)"></image>
										<view class="ordering-price-pad" v-else ></view>
										<text class="amounting">{{ item.amount }}</text>
										<image src="/static/coen/jiahao.png" mode="widthFix" @click="onplus(item)"></image>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- 总价计算区域 -->
		<view class="Shopping">
			<!-- 骑手 -->
			<view class="qishou">
				<image v-if="!isActive" src="/static/coen/weigou.png" mode="widthFix"></image>
				<image v-else src="/static/coen/yigou.png" mode="widthFix"></image>
			</view>
			<!-- 多少量 -->
			<view class="Numbering" v-if="isActive">{{ Takeleng.length }}</view>
			<!-- 金额 -->
			<view class="Shopping-dis">
				<view class="Shopping-left">
					<view class="Cost-mony">
						<text class="Total-price">¥{{ Takeawayprice }}</text>
						<text class="Delivery">另需配送费{{ physical }}元</text>
					</view>
				</view>
				<view class="Shopping-right" :class="{ shoppactive: isActive }" @click="inFlag && settLement()">
					<text v-if="isActive">{{ difference }}</text>
					<text v-else>{{ delivering }}元起送</text>
				</view>
			</view>
		</view>
		<motal ref="modal"></motal>
	</view>
</template>
<script>
import motal from '../../../element/modal.vue';
export default {
	components: {
		motal
	},
	props: {
		orderingdata: Array,
		busidata: Object
	},
	data() {
		return {
			// 做一个标识下个页面好识别这个组件存在
			identification: 1,
			optidata: [],
			objdis: [],
			title: '',
			// 配送费
			physical: Number,
			// 起送费
			delivering: Number,
			// 存放得到总价的商品
			arrtotalPrice: [],
			// 所有商品累积的总价
			Takeawayprice: 0,
			// 选择了几份商品
			Takeleng: [],
			//还差多少满足起送金额
			difference: 0,
			// 激活
			isActive: false,
			// 商家标识
			MerchantId: '',
			// 商家名称
			nameshop: '',
			// 商家logo
			logo: '',
			// 禁止点击
			inFlag:false
		};
	},
	methods: {
		settLement() {
			// 结算
			console.log(this.difference, '看看');
			let username = uni.getStorageSync('username');
			if (!username) {
				console.log(this.$refs.modal, '看孙女士');
				this.$nextTick(() => {
					this.$refs.modal.init();
				});
			} else {
				uni.navigateTo({
					url: '../placeorder/placeorder'
				});
			}
			console.log('进行结算');
		},
		// 点击左边列表
		ontitle(item) {
			this.title = item;
		},
		// 减
		onreduce({ _id }) {
			this.algorithm(-1, _id);
		},
		// 加
		onplus({ _id }) {
			this.algorithm(1, _id);
		},
		algorithm(flag, _id) {
			const f = this.objdis.find(v => v._id === _id);
			const index = this.objdis.findIndex(v => v._id === _id);
			const i = this.Takeleng.findIndex(v => v._id === _id);
			const price = f.objdis.Discount;
			let tp = this.Takeawayprice;
			console.log(price, '价格');
			if (flag === 1) {
				f.amount++;
				tp += price;
			} else if (flag === -1) {
				if (f.amount === 0) return;
				f.amount--;
				tp -= price;
			}
			this.Takeawayprice = parseFloat(tp.toFixed(10));
			if (f.amount > 0 && i === -1) {
				this.Takeleng.push(f);
			} else if (f.amount <= 0 && i !== -1) {
				this.Takeleng.splice(i, 1);
			}
			this.isActive = this.Takeleng.length >= 1;
			this.$set(this.objdis, index, f);
		}
	},
	watch: {
		orderingdata(newV, oldV) {
			this.optidata = Array.from(new Set(newV.map(v => v.optidata)));
			this.title = this.optidata[0];
			this.objdis = [...newV];
			this.objdis.forEach(v => {
				v.amount = 0;
			});
		},
		// 商家介绍
		busidata(newvalue, oldvalue) {
			// 配送费
			this.physical = newvalue.physical;
			// 起送价
			this.delivering = newvalue.delivering;
			// 商家标识
			this.MerchantId = newvalue.openid;
			// 商家名称
			this.nameshop = newvalue.shop;
			// 商家logo
			this.logo = newvalue.logo;
		}
	},
	computed: {
		countPrice() {
			const p = parseFloat((this.delivering - this.Takeawayprice).toFixed(10));
			if (this.Takeawayprice > 0) {
				if (this.delivering > this.Takeawayprice) {
					this.difference = '还差' + p + '元';
					this.inFlag = false;
				} else {
					this.difference = '结算';
					this.inFlag = true;
				}
			}
		}
	}
};
</script>
<style scoped>
.ordering-fls {
	display: flex;
	justify-content: space-between;
}
/* 左边商品分类 */
.ordering-left {
	width: 190upx;
	background: #fafafa;
	overflow-y: auto;
	height: 100%;
}
.ordering-left text {
	color: #a8a8a8;
	display: block;
	font-size: 28upx;
	height: 80upx;
	line-height: 80upx;
	text-align: center;
}
.activeord {
	background: #ffffff !important;
	font-weight: bold !important;
}
/* 右边 */
.ordering-right {
	width: 100%;
	padding: 9upx 9upx 130upx 9upx;
	overflow: hidden;
	overflow-y: auto;
}
.activeord {
	background: #ffffff !important;
	font-weight: bold !important;
}

.ordering-right-title {
	font-size: 28upx;
	height: 60upx;
	line-height: 60upx;
}

.content-view {
	display: flex;
	justify-content: space-between;
	height: 200upx !important;
	overflow: hidden;
	margin: 30upx 0;
	color: #898989;
}
.content-img {
	width: 180rpx !important;
	height: 200rpx !important;
	overflow: hidden;
}
.content-img image {
	width: 100%;
	height: 100%;
	border-radius: 10upx;
	overflow: hidden;
}
.content-title {
	/* width: 100%; */
	padding-left: 10upx;
	font-size: 24upx;
}

.conteng-take {
	color: #333333;
	height: 50upx;
	font-size: 33upx;
	font-weight: bold;
	line-height: 50upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
.conteng-monthly {
	display: flex;
}
.conteng-monthly text {
	background: #f1f1f1;
	margin-right: 9upx;
	padding: 4upx 13upx;
	border-radius: 7upx;
	display: block;
}
.conteng-starting {
	display: flex;
	align-items: center;
	height: 50upx;
	line-height: 50upx;
}
.conteng-price image {
	width: 60upx;
	height: 60upx;
}
.conteng-price {
	display: flex;
	align-items: center;
}
.ordering-price {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
}
.ordering-price-pad {
	width: 60upx;
	height: 60upx;
}
/* 数量 */
.amounting {
	width: 50upx;
	text-align: center;
}
.conteng-hua {
	text-decoration: line-through;
}
.conteng-shi {
	color: #fb4e44;
	font-size: 33upx;
	width: 180upx;
	overflow: hidden;
}
/* 购物车 */
.Shopping {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
}
.Shopping-left {
	height: 130upx;
	background: #000000;
	flex-grow: 2;
	border-top-left-radius: 50upx;
	border-bottom-left-radius: 50upx;
}
.Shopping-right {
	height: 130upx;
	line-height: 130upx;
	font-size: 30upx;
	color: #7f7f7f;
	text-align: center;
	background: #000000;
	flex-grow: 1;
	border-top-right-radius: 50upx;
	border-bottom-right-radius: 50upx;
}
.Shopping-dis {
	display: flex;
	height: 130upx;
	margin: 0 20upx;
}
.qishou {
	width: 120upx;
	height: 150upx;
	position: fixed;
	bottom: 0upx;
	left: 50upx;
}
.qishou image {
	width: 120upx;
	height: 150upx !important;
}
/* 定位 */
.Delivery {
	color: #999999;
	font-size: 28upx;
	height: 65upx;
}
.Shopping-left text {
	display: block;
}
.Total-price {
	font-size: 40upx;
	color: #ffffff;
	height: 65upx;
	line-height: 65upx;
}
.Cost-mony {
	padding-left: 170upx;
	color: #4cd964;
	height: 130upx;
}
/* 数量 */
.Numbering {
	background: red;
	width: 40upx;
	height: 40upx;
	border-radius: 50%;
	font-size: 20upx;
	color: #ffffff;
	text-align: center;
	line-height: 40upx;
	position: fixed;
	bottom: 50upx;
	left: 130upx;
}
/* 选中菜品 */
.shoppactive {
	background: #ffd300 !important;
	color: #000000 !important;
}
</style>

<template>
	<view>
		<view class="search-cont">
			<view class="search">
				<input type="text" placeholder-class="inputclass" confirm-type="search" focus="true" placeholder="请输入关键字" v-model="searchdata" @confirm="seArch" />
			</view>
			<view class="search-code" @click="seArch">搜索</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-if="setdata.length > 0">
			<view class="search-title">
				<view>搜索历史</view>
				<view @click="removeStorage"><image src="../../static/coen/searchend.svg" mode="widthFix"></image></view>
			</view>
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item, index) in setdata" :key="index">
					<view @click="menubtn(item)">{{ item }}</view>
				</block>
			</view>
		</view>
		<!-- 内容展示 -->
		<view class="content-left">
			<block v-for="(item, index) in takeshop" :key="index">
				<view class="content-view">
					<view class="content-img"><image :src="item.logo" mode="aspectFill"></image></view>
					<view class="content-title">
						<text class="conteng-take">{{ item.shop }}</text>
						<view class="conteng-monthly">
							<text>月售200</text>
							<text>约{{ item.duration }}分钟</text>
						</view>
						<view class="conteng-starting">
							<text>起送¥{{ item.delivering }}</text>
							<text>配送¥{{ item.physical }}</text>
							<text>人均¥{{ item.capita }}</text>
						</view>
						<view class="conteng-starting">
							<image src="/static/coen/liwu.svg" mode="widthFix"></image>
							<text>{{ item.types }}</text>
						</view>
					</view>
				</view>
			</block>
			<!-- <view class="noyet" v-if="flag&&takeshop.length <= 0">暂无商品</view> -->
			<tips ref="tip"></tips>
		</view>
	</view>
</template>

<script>
import tips from '../../element/tips.vue'	
import { API } from '../../api/request.js';
const api = new API();
export default {
	components:{
		tips
	},
	data() {
		return {
			searchdata: '', //搜索
			takeshop: [], //商品
			setdata: [], //历史记录
		};
	},
	methods: {
		// 搜索
		seArch(e) {
			if(this.searchdata==='') return
			this.postsearchurl();
			this.historySeach()
		},
		// 搜索接口
		postsearchurl() {
			const param = { searchdata: this.searchdata };
			api.postsearchurl(param)
				.then(res => {
					this.setdata=[]
					console.log(res, '搜索到的商品');
					if (typeof res.data === 'string') {
						this.takeshop = [];
						this.onTips(true,"没有商品")
					} else {
						this.takeshop = res.data;
						this.onTips(false,"")
					}
				})
				.catch(err => {
					console.log('获取数据失败');
				});
		},
		// 存储历史记录
		historySeach() {
			const data =uni.getStorageSync('setdata')||[]
			data.unshift(this.searchdata);
			uni.setStorageSync('setdata', Array.from(new Set(data)));
		},
		// 清空历史记录
		removeStorage(){
			this.setdata=[]
			uni.removeStorageSync('setdata')
		},
		// 点击搜索历史记录进行搜索
		menubtn(item){
			this.searchdata=item
			this.seArch()
		},
		// 获取搜索历史记录
		getHistory(){
			this.setdata=uni.getStorageSync('setdata')||[]
		},
		onTips(bull,tips){
			// 页面渲染完后进行调用
			this.$nextTick(()=>{
				this.$refs.tip.init(bull,tips)
			})
		}
		
	},
	
	created() {
		this.getHistory()
	}
	
};
</script>

<style>
@import '../../common/meituan.css';
.content-left {
	margin: 0 20upx;
}
.search {
	height: 70upx;
	line-height: 70upx;
	width: 100%;
	display: flex;
	flex-direction: row;
	background: #f8f8f8;
	border-radius: 20upx;
	margin-left: 20upx;
}
.search input {
	height: 70upx;
	line-height: 70upx;
	width: 100%;
	font-size: 30upx;
	color: #666666;
	padding-left: 30upx;
}
.search-cont {
	display: flex;
	justify-content: space-between;
	height: 70upx;
	align-items: center;
	padding: 30upx 0;
}
.search-code {
	width: 150upx;
	height: 50upx;
	text-align: center;
	font-size: 30upx;
}
/* 搜索历史 */
.search-history {
	margin: 20upx;
}
.search-title {
	font-size: 30upx;
	font-weight: bold;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 60upx;
	line-height: 60upx;
}
.search-title image {
	width: 36upx;
	height: 36upx;
	display: block;
}
.menu-block view {
	background: #f7f8fa;
	border-radius: 6upx;
	font-size: 27upx;
	color: #292c33;
	text-align: center;
	padding: 10upx;
	margin: 20upx 20upx 0 0;
}

.menu-block {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}
</style>

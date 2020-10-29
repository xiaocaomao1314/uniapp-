<template>
	<view>
		<block v-for="(item,index) in takeshop" :key="index">
			<view class="content-view" @click="takEout(item.openid)">
				<view class="content-img">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="content-title">
					<text class="conteng-take">{{item.shop}}</text>
					<view class="conteng-monthly">
						<text>月售200</text>
						<text>约{{item.duration}}分钟</text>
					</view>
					<view class="conteng-starting">
						<text>起送¥{{item.delivering}}</text>
						<text>配送¥{{item.physical}}</text>
						<text>人均¥{{item.capita}}</text>
					</view>
					<view class="conteng-starting">
						<image src="/static/coen/liwu.svg" mode="widthFix"></image>
						<text>{{item.types}}</text>
					</view>
				</view>
			</view>
		</block>
		<tips ref="tip"></tips>
	</view>
</template>

<script>
	import tips from '../../../element/tips.vue'	
	export default{
		components:{
			tips
		},
		props:{
			takeshop:Array
		},
		data() {
			return {
				
			}
		},
		
		methods:{
			takEout(id){
				wx.navigateTo({
					url:'../takeout/takeout?id=' + id
				})
			},
			onTips(bull,tips){
				// 页面渲染完后进行调用
				this.$nextTick(()=>{
					this.$refs.tip.init(bull,tips)
				})
			}
		},
		computed:{
			count(){
				if(this.takeshop.length<=0){
					this.onTips(true,"没有商品")
				}else{
					this.onTips(false,"")
				}
			}
		}
	}
</script>

<style scoped>
	@import '../../../common/meituan.css';
</style>
<template>
	<view>
		<!-- 这个思路可以 全部进行定位直接渲染 思路很正确 -->
		<!-- 筛选区 -->
		<view class="prefer-posi">
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple">
					<text>{{ synthesize }}</text>
					<image src="/static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="saLes">销量高</view>
				<view class="delica-grow" @click="saLes">速度快</view>
				<view class="delica-grow" @click="saLes">津贴联盟</view>
				<view class="delica-list delica-right" @click="scReen">
					<text>筛选</text>
					<image src="/static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item, index) in sortlist" :key="index">
					<text :class="{ activeb: item.name === synthesize }" @click="sortClick(item)">{{ item.name }}</text>
				</block>
			</view>
			<!-- 多个筛选区 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选：商家特色 -->
				<block v-for="(item, index) in screendata" :key="index">
					<view>
						<view class="sortlist-title">{{ item.title }}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata, indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{ scractive: itemdata.show }" @click="multipleChoice(itemdata)">{{ itemdata.name }}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 单选：人均价 -->
				<block v-for="(item, index) in person" :key="index">
					<view>
						<view class="sortlist-title">{{ item.title }}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata, indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{ scractive: itemdata.show }" @click="singleChoice(itemdata)">{{ itemdata.name }}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="empty">清空</text>
					<text @click="complete">完成</text>
				</view>
			</view>
		</view>
		<!-- 透明背景 -->
		<view class="yin" v-if="ying" @click="backClic()"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			drop: false,
			sortmen: false,
			synthesize: '综合排序',
			ying: false,
			param: {},
			sortlist: [
				{
					name: '综合排序',
					screen: '_id',
					nums: 1
				},
				{
					name: '起送价最低',
					screen: 'delivering',
					nums: 1
				},
				{
					name: '配送费最低',
					screen: 'physical',
					nums: 1
				},
				{
					name: '人均高到低',
					screen: 'capita',
					nums: -1
				},
				{
					name: '人均低到高',
					screen: 'capita',
					nums: 1
				}
			],
			// 多选
			screendata: [
				{
					title: '商家特色(可多选)',
					datas: [
						{
							id: 1,
							show: false,
							sign: 'duration',
							name: '配送最快'
						},
						{
							id: 2,
							show: false,
							sign: 'deliver',
							name: '0元起送'
						},
						{
							id: 3,
							show: false,
							sign: 'physi',
							name: '免配送费'
						}
					]
				}
			],
			// 人均价筛选
			person: [
				{
					title: '人均价',
					datas: [
						{
							id: 1,
							show: false,
							name: '20元以下',
							per: {
								$lt: 20
							}
						},
						{
							id: 2,
							show: false,
							name: '20-40元',
							per: {
								$lte: 40,
								$gte: 20
							}
						},
						{
							id: 3,
							show: false,
							name: '40元以上',
							per: {
								$gt: 40
							}
						}
					]
				}
			]
		};
	},
	methods: {
		// 综合排序
		multiple() {
			this.drop = true;
			this.sortmen = false;
			this.backOne();
		},
		// 选择筛选框
		sortClick({ name, screen, nums }) {
			this.synthesize = name;
			this.backClic();
			this.$emit('poststartingurl', { screen, nums });
		},
		// 完成
		complete(){
			if(JSON.stringify(this.param)==='{}') return
			this.$emit('postmultipleurl', this.param);
			this.backClic();
		},
		// 隐藏透明背景
		backClic() {
			this.ying = false;
			this.drop = false;
			this.sortmen = false;
		},
		// 筛选
		scReen() {
			this.drop = false;
			this.sortmen = true;
			this.backOne();
		},
		// 透明背景
		backOne() {
			if (!this.ying) {
				setTimeout(() => {
					this.ying = true;
				}, 310);
			}
		},
		// 点击销售量 速度 津贴
		saLes() {
			this.backClic();
		},
		// 多选
		multipleChoice(item) {
			const find = this.screendata[0].datas.find(v => v.id === item.id);
			find.show = !find.show;
			if (find.show) {
				this.$set(this.param, find.sign, find.sign);
			} else {
				this.$delete(this.param, find.sign);
			}
			console.log(this.param)
		},
		// 单选
		singleChoice(item) {
			this.person[0].datas.forEach(v => {
				if (v.id === item.id) {
					v.show = !v.show;
					if (v.show) {
						this.$set(this.param, 'capita', v.per);
					} else {
						this.$delete(this.param, 'capita');
					}
				} else {
					v.show = false;
				}
			});
			console.log(this.param)
		},
		// 清空
		empty() {
			this.modifyShow(this.person[0].datas);
			this.modifyShow(this.screendata[0].datas);
			this.param={}
			this.backClic();
		},
		modifyShow(arr) {
			arr.forEach(v => {
				v.show = false;
			});
		}
	}
};
</script>

<style scoped>
.delica-view image {
	width: 30upx;
	height: 30upx;
	display: block;
}
.delica-view {
	font-size: 30upx;
	display: flex;
	align-items: center;
	color: #666666;
	height: 70upx;
	padding: 0 15upx;
	background: #ffffff;
}
.delica-list {
	display: flex;
	align-items: center;
}
.delica-right {
	justify-content: flex-end;
	flex-grow: 5;
}
.delica-grow {
	flex-grow: 1;
}
.prefer-posi {
	position: absolute;
	left: 0;
	right: 0;
	width: 100%;
	z-index: 99;
}
/* 排序 */
.sortlist {
	background: #ffffff;
}
.sortliteltle text {
	padding: 0 15upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	font-size: 30upx;
	height: 70upx;
	line-height: 70upx;
	border-top: 1rpx solid #ededed;
}
.activeb {
	color: #f89903 !important;
}
/* 选择 */
/*相对定位*/
.sortlist-view {
	height: 700upx;
	overflow: hidden;
	overflow-y: scroll;
	position: relative;
}
.sortlist-title {
	padding: 0 15upx;
	font-size: 30upx;
	height: 60upx;
	line-height: 60upx;
}
.Choice {
	font-size: 28upx;
	background: #f8f8f8;
	height: 55upx;
	line-height: 55upx;
	color: #666666;
	width: calc((100% / 3) - 15px) !important;
	margin: 7.5px;
	text-align: center;
	display: block;
	border-radius: 5upx;
}
.sortlist-flex {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin-bottom: 30upx;
}
.sortlist-bottom {
	background: #ffffff;
	height: 80upx;
	border-top: 1upx solid #e4e4e4;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
.sortlist-bottom text {
	flex-grow: 1;
	height: 80upx;
	line-height: 80upx;
	text-align: center;
}
.sortlist-bottom text:nth-child(1) {
	border-right: 1upx solid #e4e4e4;
}
.sortlist-bottom text:nth-child(2) {
	background: #ffd348;
}
.yin {
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
/* 商家特色加样式 */
.scractive {
	background: #fef6df !important;
	color: #f29909 !important;
}
</style>

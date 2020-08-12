<template>
	<div class="dash-board">
		<!-- v-show="refreshDash" -->
		<section class="dash-body" ref="dashBody">
			<template v-for="item in boxList">
				<!-- :ref="`box${item.index}`" -->
				<div
					:style="{
					width: item.width + 'px',
					height: item.height + 'px',
					left: item.left + 'px', 
					top: item.top + 'px',
					}"
					:key="item.index"
					class="vue-drag"
					v-if="item.show"
				>
					<template v-if="item.type != 'text' && item.type != 'numText'">
						<header class="chart-head">
							<span>{{item.title + item.index}}</span>
							<div class="head-menu head-abso" @mousedown.stop>
								<i class="el-icon-zoom-in" title="放大" @click="showBig(item)"></i>
								<i class="el-icon-download" title="下载" @click="downloadD(item)"></i>
							</div>
						</header>
						<div class="drag-box" @mousedown.stop>
							<ve-chart
								:ref="'coluChart' + item.index"
								:data="charData"
								width="100%"
								height="100%"
								:resize-delay="100"
								:judge-width="true"
								:settings="item.settings"
							></ve-chart>
						</div>
					</template>
					<template v-else-if="item.type == 'text'">
						<div class="drag-head">
							<h1 class="header-title">{{item.title + item.index}}</h1>
						</div>
					</template>
					<template v-else-if="item.type == 'numText'">
						<div class="drag-head drag-num">
							<span
								class="number"
								:style="{
                                'font-size': item.style.numFSize + 'px',
                                'color': item.style.numColor,
                                'margin-bottom': item.style.marginB + 'px'
                            }"
							>{{item.data.num | formatNum(item.numSetting)}}</span>
							<span
								class="remark"
								v-text="item.title"
								:style="{
                                'font-size': item.style.remarkFSize + 'px',
                                'color': item.style.remarkColor
                            }"
							></span>
						</div>
					</template>
				</div>
			</template>
			<div class="cvs-set">
				<div class="set-item" title="编辑" @click="$router.push('/dboard')">
					<i class="el-icon-edit-outline"></i>
				</div>
			</div>
		</section>
		<div
			:class="['big-wiew', showBigStu?'big-wiew--show':'']"
			:style="{height:hiddenHei?'0':'calc(100% - 150px)' }"
		>
			<div ref="bigShow">
				<i class="el-icon-close" @click="closeBig"></i>
				<ve-chart
					:data="charData"
					width="100%"
					height="100%"
					:resize-delay="100"
					:judge-width="true"
					:settings="currBig.settings"
				></ve-chart>
			</div>
		</div>
	</div>
</template>

<script>
	import numbro from "numbro";

	export default {
		name: "DashBoard",
		data() {
			this.typeArr = ["line", "histogram", "pie", "ring"];
			// this.activeIndex = 1;/
			return {
				charData: {
					columns: ["日期", "访问用户", "下单用户", "下单率"],
					rows: [
						{
							日期: "1/1",
							访问用户: 1393,
							下单用户: 1093,
							下单率: 0.32,
						},
						{
							日期: "1/2",
							访问用户: 3530,
							下单用户: 3230,
							下单率: 0.26,
						},
						{
							日期: "1/3",
							访问用户: 2923,
							下单用户: 2623,
							下单率: 0.76,
						},
						{
							日期: "1/4",
							访问用户: 1723,
							下单用户: 1423,
							下单率: 0.49,
						},
						{
							日期: "1/5",
							访问用户: 3792,
							下单用户: 3492,
							下单率: 0.323,
						},
						{
							日期: "1/6",
							访问用户: 4593,
							下单用户: 4293,
							下单率: 0.78,
						},
					],
				},
				activeIndex: 1,
				bodySize: {
					width: 1880,
					height: 967,
					oldWidth: 1880,
					oldHeight: 967,
				},
				boxList: [
					{
						title: "饼图",
						width: 325,
						height: 325,
						top: 50,
						left: 24,
						zIndex: 1,
						type: "pie",
						settings: { type: "pie", offsetY: "50%" },
						index: 1,
						show: true,
					},
					{
						title: "柱状图",
						width: 884,
						height: 502,
						top: 420,
						left: 24,
						zIndex: 1,
						type: "histogram",
						settings: { type: "histogram" },
						index: 2,
						show: true,
					},
					{
						title: "折线图",
						width: 884,
						height: 502,
						top: 420,
						zIndex: 1,
						left: 969,
						type: "line",
						settings: { type: "line" },
						index: 3,
						show: true,
					},
					{
						title: "这是一个好系统",
						width: 372,
						height: 102,
						top: 19,
						zIndex: 1,
						left: 754,
						type: "text",
						index: 4,
						show: true,
					},
					{
						title: "环图",
						width: 325,
						height: 325,
						top: 50,
						left: 1528,
						zIndex: 1,
						type: "ring",
						settings: {
							type: "ring",
							offsetY: "50%",
							radius: ["50%", "70%"],
						},
						index: 5,
						show: true,
					},
					{
						title: "总投资金额",
						width: 213,
						height: 116,
						top: 181.5,
						left: 390,
						zIndex: 1,
						type: "numText",
						index: 6,
						show: true,
						data: {
							num: "10000",
							remark: "总投资金额",
						},
						numSetting: {
							thousandSeparated: true,
						},
						style: {
							numColor: "#01fcff",
							remarkColor: "#000",
							numFSize: "32",
							remarkFSize: "18",
							marginB: "10",
						},
					},
					{
						title: "审减率",
						width: 213,
						height: 116,
						top: 181.5,
						left: 1276,
						zIndex: 1,
						type: "numText",
						index: 7,
						show: true,
						data: {
							num: "0.0103",
							remark: "审减率",
						},
						numSetting: {
							output: "percent",
						},
						style: {
							numColor: "#01fcff",
							remarkColor: "#000",
							numFSize: "32",
							remarkFSize: "18",
							marginB: "10",
						},
					},
					{
						title: "审定投资金额(万元)",
						width: 213,
						height: 116,
						top: 181.5,
						left: 695,
						zIndex: 1,
						type: "numText",
						index: 8,
						show: true,
						data: {
							num: "8289",
							remark: "审定投资金额(万元)",
						},
						numSetting: {
							thousandSeparated: true,
						},
						style: {
							numColor: "#01fcff",
							remarkColor: "#000",
							numFSize: "32",
							remarkFSize: "18",
							marginB: "10",
						},
					},
					{
						title: "报审投资金额(万元)",
						width: 213,
						height: 116,
						top: 181.5,
						left: 969,
						zIndex: 1,
						type: "numText",
						index: 9,
						show: true,
						data: {
							num: "8374",
							remark: "报审投资金额(万元)",
						},
						numSetting: {
							thousandSeparated: true,
						},
						style: {
							numColor: "#01fcff",
							remarkColor: "#000",
							numFSize: "32",
							remarkFSize: "18",
							marginB: "10",
						},
					},
				],
				// 编辑长宽
				editSizeStu: false,

				resizeTh: null,
				currBig: { settings: {} },
				showBigStu: false,
				hiddenHei: true,
				refreshDash: true,
				reloadTimer: null,
			};
		},
		methods: {
			// 关闭放大
			closeBig() {
				this.currBig = {};
				this.showBigStu = false;
			},
			// 放大
			showBig(item) {
				this.currBig = JSON.parse(JSON.stringify(item));
				if (this.currBig.type == "pie") {
					this.$nextTick(() => {
						Object.assign(this.currBig.settings, {
							radius: this.$refs.bigShow.clientHeight * 0.4,
						});
					});
				}
				this.showBigStu = true;
			},
			throttle(func, delay) {
				let startTime = Date.now();
				let self = this;
				let timer = null;
				return function () {
					let currTime = Date.now();
					let args = arguments;
					let diffTime = delay - currTime + startTime;
					clearInterval(timer);
					if (diffTime <= 0) {
						func.apply(self, args);
						startTime = Date.now();
					} else {
						timer = setTimeout(() => {
							func.apply(self, args);
						}, diffTime);
					}
				};
			},
			reloadSize(ev) {
				this.editSizeStu = false;
				if (this.$refs.dashBody) {
					this.bodySize.oldWidth = this.bodySize.width;
					this.bodySize.oldHeight = this.bodySize.height;
					// this.$nextTick(() => {
					this.bodySize.width = this.$refs.dashBody.clientWidth;
					this.bodySize.height = this.$refs.dashBody.clientHeight;
					let ratioW = this.bodySize.oldWidth / this.bodySize.width;
					let ratioH = this.bodySize.oldHeight / this.bodySize.height;
					clearInterval(this.reloadTimer);
					this.boxList.forEach((item) => {
						let oldWidth = item.width;
						let oldHeight = item.height;
						item.width = item.width / ratioW;
						item.height = item.height / ratioH;
						item.left = item.left / ratioW;
						item.top = item.top / ratioH;
						if (item.type == "pie") {
							let radiusW = item.width * 0.3;
							let radiusH = item.height * 0.3;
							let copyData = JSON.parse(
								JSON.stringify(
									Object.assign(item.settings, {
										radius: Math.min(radiusW, radiusH),
									})
								)
							);
							item.settings = copyData;
						}
						item.show = false;
						this.$nextTick(() => {
							item.show = true;
						});
					});
				}
			},
			// 下载
			downloadD() {},
		},
		mounted() {
			this.reloadSize();
			this.resizeTh = this.throttle(this.reloadSize, 500);
			window.addEventListener("resize", this.resizeTh);
		},
		destroyed() {
			window.removeEventListener("resize", this.resizeTh);
		},
		filters: {
			formatNum(value, setting) {
				return numbro(value).format(setting);
			},
		},
		watch: {
			showBigStu(newV) {
				if (newV) {
					this.hiddenHei = false;
				} else {
					setTimeout(() => {
						this.hiddenHei = true;
					}, 500);
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.dash-board {
		width: 100%;
		height: 100%;
		background-color: #ececec;
		// padding: 20px;
		box-sizing: border-box;
		position: relative;
	}
	.dash-body {
		position: relative;
		z-index: 0;
		height: 100%;
		background-color: #fff;
	}
	.drag-box {
		width: 100%;
		height: calc(100% - 30px);
		padding: 0 10px 10px;
		box-sizing: border-box;
	}
	.drag-head {
		position: relative;
		height: 100%;
	}
	.vue-drag {
		position: absolute;
		box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		// padding: 0 10px 10px 10px;
		box-sizing: border-box;
		background-color: #fff;
		&:hover .head-menu {
			display: flex;
		}
		background-size: 100% 100%;
		box-sizing: border-box;
	}
	.header-title {
		height: 100%;
		text-align: center;
		width: 100%;
		&::after {
			vertical-align: middle;
			content: "";
			height: 100%;
			width: 0;
			display: inline-block;
		}
	}
	.stand {
		position: absolute;
		z-index: 99999;
		&-x {
			height: 0;
			width: 100%;
			border-top: 1px dashed #6eb1eb;
		}
		&-y {
			height: 100%;
			width: 0;
			border-right: 1px dashed #6eb1eb;
		}
	}
	.chart-head {
		height: 40px;
		display: flex;
		padding: 0 10px;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.head-abso {
		position: absolute;
		right: 10px;
		top: 5px;
	}
	.head-menu {
		background-color: #fff;
		border-radius: 2em;
		border: 1px solid #44444480;
		transition: border-color 0.2s;
		cursor: auto;
		// &:hover {
		// 	border-color: #44444480;
		// }
		padding: 2px 10px;
		& i {
			cursor: pointer;
			display: inline-block;
			border-radius: 50%;
			padding: 4px;
			background-color: transparent;
			transition: all 0.4s;
			&:hover {
				background-color: rgba(0, 0, 0, 0.2);
			}
		}
		& i ~ i {
			margin-left: 10px;
		}
		&-more {
			margin-left: 10px;
			position: relative;
			z-index: 1;
			background-color: #fff;
			&:hover .menu-ul {
				height: auto;
				opacity: 1;
			}
		}
	}
	.menu-ul {
		position: absolute;
		left: 50%;
		height: 0;
		overflow: hidden;
		transform: translateX(-50%);
		// top: 30px;
		padding-top: 10px;
		background-color: #fff;
		top: 24px;
		padding: 10px 2px 2px 2px;
		& ul {
			list-style: none;
			box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		}
		& li {
			padding: 2px 5px;
		}
		// & li:nth-child(2n + 1) {
		// 	border-bottom: 1px solid #c8c8c8;
		// }
		opacity: 0;
		transition: opacity 0.2s;
	}
	.menu-li-border {
		border-bottom: 1px solid #c8c8c8;
	}
	.form-size > div + div {
		margin-top: 14px;
	}
	.form-items {
		display: flex;
		& > div {
			width: 50%;
		}
	}
	.form-inp {
		display: flex;
		align-items: center;
		font-size: 14px;
		span {
			text-align: right;
			margin-right: 10px;
			width: 70px;
			flex-shrink: 0;
		}
	}
	.form-size .el-input {
		width: 80px;
		flex-grow: 1;
	}
	.big-wiew {
		position: absolute;
		z-index: 99999;
		width: calc(100% - 150px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		transform: translate(-50%, calc(-50% - 40px));
		opacity: 0;
		transition-duration: 0.4s;
		overflow: hidden;
		transition-property: opacity, transform;
		background-color: #fff;
		border-radius: 4px;
		&--show {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
		& > div {
			height: 100%;
			padding: 10px;
			box-sizing: border-box;
			i {
				font-size: 24px;
				position: absolute;
				right: 10px;
				top: 10px;
				cursor: pointer;
				z-index: 1;
			}
		}
	}
	.mini-title {
		font-size: 14px;
	}
	@media screen {
	}
	.upimg-box {
		display: inline-block;
		margin: 0 auto;
		overflow: hidden;
		img {
			height: 100%;
			width: 100%;
		}
		vertical-align: bottom;
		margin-right: 10px;
		& .el-upload {
			border-radius: 6px;
			border: 1px dashed #efefef;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100px;
		}
	}
	::v-deep .upimg-box .el-upload {
		border-radius: 6px;
		border: 1px dashed #efefef;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		width: 100px;
		&:hover {
			border-color: #409eff;
		}
	}
	.upimg-menu {
		display: inline-block;
		// height: 100px;
	}
	.border-inp {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		& > div {
			display: flex;
			align-items: center;
			justify-content: center;
			// width: 30%;
		}
		& > div + div {
			margin-left: 10px;
		}
		& > .border-edit .el-select {
			// margin-left: 5px;
			width: 86px;
		}
		span {
			flex-shrink: 0;
			margin-right: 4px;
		}
		.el-input {
			width: 50px;
			flex-grow: 0;
			// margin-left: 5px;
		}
	}
	.drag-num {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		span {
			font-weight: bolder;
		}
	}
	.cvs-set {
		position: absolute;
		bottom: 20px;
		cursor: pointer;
		right: 20px;
		z-index: 10;
	}
	.set-item {
		border-radius: 50%;
		background-color: #fff;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: #409eff;
		display: flex;
		align-items: center;
		justify-content: center;
		// opacity: .5;
		font-size: 20px;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
		transition-property: opacity, background-color;
		transition-duration: 0.2s;
		&:hover {
			background-color: #f2f6fc;
			// opacity: 1;
		}
		& ~ div {
			margin-top: 10px;
		}
	}
</style>
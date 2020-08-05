<template>
	<div class="dash-board">
		<section class="dash-body" ref="dashBody">
			<template v-for="(item, index) in boxList">
				<VueDragResize
					:key="index"
					class="vue-drag"
					:isActive="activeIndex == index"
					:w="item.width"
					:h="item.height"
					:x="item.left"
					:y="item.top"
					v-on:resizing="val => resize(val, index)"
					v-on:dragging="val => resize(val, index)"
					@clicked="activeIndex = index"
					:parentLimitation="true"
					@deactivated="activeIndex = null"
					@resizestop="val=> resizeStop(val, index)"
					@dragstop="val=> resizeStop(val, index)"
				>
					<template v-if="item.type != 'text'">
						<header class="chart-head">
							<span>{{item.title + index}}</span>
                            
						</header>
						<div class="drag-box" @mousedown.stop>
							<ve-chart
								:ref="'coluChart' + index"
								:data="charData"
								width="100%"
								height="100%"
								:resize-delay="100"
								:judge-width="true"
								:settings="settingChar(index)"
							></ve-chart>
						</div>
					</template>
					<template v-else>
						<div class="drag-head">
							<h1 class="header-title">这是一个好系统 {{index}}</h1>
						</div>
					</template>
				</VueDragResize>
			</template>
			<div class="stand stand-x" :style="xStand"></div>
			<div class="stand stand-y" :style="yStand"></div>
		</section>
	</div>
</template>

<script>
	export default {
		name: "DashBoard",
		data() {
			this.typeArr = ["line", "histogram", "pie"];
			// this.activeIndex = 1;/
			return {
				width: 0,
				height: 0,
				top: 0,
				left: 0,
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
				chartSettings: { type: this.typeArr[this.activeIndex] },
				bodySize: {
					width: 0,
					height: 0,
				},
				boxList: [
					{
						title: "饼图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						type: "line",
					},
					{
						title: "柱状图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						type: "histogram",
					},
					{
						title: "折线图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						type: "pie",
					},
					{
						title: "这是一个好系统",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						type: "text",
					},
				],
				xStand: {
					top: 0,
					display: "none",
				},
				yStand: {
					left: 0,
					display: "none",
				},
				// 位置距离最近的
				nearIndex: null,
				// left top 距离最近的index
				nearIndObj: {
					topInd: 0,
					leftInd: 0,
					resLeftCen: 0,
					resTopCen: 0,
				},
				pagePostStu: true,
				// 需改边的left 和 top
				leftChange: "no",
				topChange: "no",
				addFuncTol: null,
				throTimer: null,
			};
		},
		methods: {
			resize(newRect, index) {
				this.boxList[index].width = newRect.width;
				this.boxList[index].height = newRect.height;
				this.boxList[index].top = newRect.top;
				this.boxList[index].left = newRect.left;
				this.judgeLoact(newRect, index);
				let ref = this.$refs[`coluChart${index}`];
				if (Array.isArray(ref)) {
					ref[0].echarts.resize();
				} else if (ref) {
					ref.echarts.resize();
				}
			},
			resizeStop(newRect, index) {
				window.clearTimeout(self.throTimer);
				if (this.topChange != "no") {
					this.boxList[index].top = this.topChange;
				}
				if (this.leftChange != "no") {
					this.boxList[index].left = this.leftChange;
				}
				// this.$nextTick(() => {
				this.topChange = "no";
				this.topChange = "no";
				this.yStand.display = "none";
				this.xStand.display = "none";
				// });
			},
			settingChar(index) {
				return { type: this.typeArr[index] };
			},
			getBodySiz() {
				this.bodySize.width = this.$refs.dashBody.clientWidth;
				this.bodySize.height = this.$refs.dashBody.clientHeight;
			},
			judgeLoact(newRect, index) {
				if (!this.addFuncTol) {
					this.addFuncTol = this.throttle(this.dealLocat, 300);
				}
				this.addFuncTol(newRect, index);
			},
			dealLocat(newRect, index) {
				this.pagePost(newRect, index);
				this.findXYEle(index);
				this.blockPost(newRect, index);
			},
			// 查找离当前移动块最近的元素索引
			findMinDis(index) {
				let option = this.boxList[index];
				let currXDis = option.left + option.width / 2;
				let currYDis = option.top + option.height / 2;
				let resArr = this.boxList.map((item, ind) => {
					if (index == ind) return 0;
					let yDis = item.top + item.height / 2;
					let xDis = item.left + item.width / 2;
					return Math.sqrt(
						Math.pow(Math.abs(currXDis - xDis), 2) +
							Math.pow(Math.abs(currYDis - yDis), 2)
					);
				});
				let resArrCp = JSON.parse(JSON.stringify(resArr)).sort(
					(a, b) => a - b
				);
				return resArr.findIndex((i) => i == resArrCp[1]);
			},
			// 找到最近的块
			findXYEle(index) {
				let obj = { topInd: null, leftInd: null };
				let resTop = this.boxList.map((it, ind) => {
					return Math.abs(it.top - this.boxList[index].top);
				});
				let resLeft = this.boxList.map((it, ind) => {
					return Math.abs(it.left - this.boxList[index].left);
				});
				let resLeftCen = this.boxList.map((it, ind) => {
					return Math.abs(
						it.left +
							it.width / 2 -
							this.boxList[index].left -
							this.boxList[index].width / 2
					);
				});
				let resTopCen = this.boxList.map((it, ind) => {
					return Math.abs(
						it.top +
							it.height / 2 -
							this.boxList[index].top -
							this.boxList[index].height / 2
					);
				});
				this.nearIndObj.topInd = resTop.findIndex(
					(i) =>
						i ==
						JSON.parse(JSON.stringify(resTop)).sort((a, b) => a - b)[1]
				);
				this.nearIndObj.leftInd = resLeft.findIndex(
					(i) =>
						i ==
						JSON.parse(JSON.stringify(resLeft)).sort((a, b) => a - b)[1]
				);
				this.nearIndObj.resLeftCen = resLeftCen.findIndex(
					(i) =>
						i ==
						JSON.parse(JSON.stringify(resLeftCen)).sort(
							(a, b) => a - b
						)[1]
				);
				this.nearIndObj.resTopCen = resTopCen.findIndex(
					(i) =>
						i ==
						JSON.parse(JSON.stringify(resTopCen)).sort(
							(a, b) => a - b
						)[1]
				);
			},
			// 页面定位
			pagePost(newRect, index) {
				let disW = newRect.width / 2 + newRect.left;
				let disH = newRect.height / 2 + newRect.top;
				let centerW = this.bodySize.width / 2;
				let centerH = this.bodySize.height / 2;
				if (
					Math.abs(disW - centerW) < 10 &&
					Math.abs(disW - centerW) != 0
				) {
					this.leftChange = centerW - newRect.width / 2;
					this.yStand.left = "50%";
					this.yStand.display = "block";
				} else {
					this.leftChange = "no";
					this.yStand.display = "none";
				}
				if (
					Math.abs(disH - centerH) < 10 &&
					Math.abs(disH - centerH) != 0
				) {
					this.xStand.top = "50%";
					this.topChange = centerH - newRect.height / 2;
					this.xStand.display = "block";
				} else {
					this.xStand.display = "none";
					this.topChange = "no";
				}
			},
			// 块定位
			blockPost(newRect, index) {
				// 边对齐
				// left right
				if (this.leftChange == "no") {
					let leftObjEle = this.boxList[this.nearIndObj.leftInd];
					let leftObjCenEle = this.boxList[this.nearIndObj.resLeftCen];
					let leftCenDis = Math.abs(
						newRect.left +
							newRect.width / 2 -
							leftObjCenEle.left -
							leftObjCenEle.width / 2
					);
					let leftDis = Math.abs(leftObjEle.left - newRect.left);
					let rightDis = Math.abs(
						leftObjEle.left +
							leftObjEle.width -
							newRect.left -
							newRect.width
					);
					if (leftCenDis < 10 && leftCenDis != 0) {
						this.yStand.left =
							leftObjEle.left + leftObjEle.width / 2 + "px";
						this.leftChange =
							leftObjEle.left +
							leftObjEle.width / 2 -
							newRect.width / 2;
						this.yStand.display = "block";
					} else if (leftDis < 10 && leftDis != 0) {
						this.leftChange = leftObjEle.left;
						this.yStand.left = this.leftChange + "px";
						this.yStand.display = "block";
					} else if (rightDis < 10 && rightDis != 0) {
						this.leftChange =
							leftObjEle.left + leftObjEle.width - newRect.width;
						this.yStand.left =
							leftObjEle.left + leftObjEle.width + "px";
						this.yStand.display = "block";
					} else {
						this.leftChange = "no";
						this.yStand.display = "none";
					}
				}
				// top bootom
				if (this.topChange == "no") {
					let topObjEle = this.boxList[this.nearIndObj.topInd];
					let topObjCenEle = this.boxList[this.nearIndObj.resTopCen];
					let topCenDis = Math.abs(
						newRect.top +
							newRect.height / 2 -
							topObjCenEle.top -
							topObjCenEle.height / 2
					);
					let topDis = Math.abs(topObjEle.top - newRect.top);
					let bootomDis = Math.abs(
						topObjEle.top +
							topObjEle.height -
							newRect.top -
							newRect.height
					);
					if (topCenDis < 10 && topCenDis != 0) {
						this.xStand.top =
							topObjEle.top + topObjEle.height / 2 + "px";
						this.topChange =
							topObjEle.top +
							topObjEle.height / 2 -
							newRect.height / 2;
						this.xStand.display = "block";
					} else if (topDis < 10 && topDis != 0) {
						this.topChange = topObjEle.top;
						this.xStand.top = this.topChange + "px";
						this.xStand.display = "block";
					} else if (bootomDis < 10 && bootomDis != 0) {
						this.topChange =
							topObjEle.top +
							topObjEle.height -
							this.boxList[index].height;
						this.xStand.top = topObjEle.top + topObjEle.height + "px";
						this.xStand.display = "block";
					} else {
						this.topChange = "no";
						this.xStand.display = "none";
					}
				}
			},
			throttle(func, delay) {
				let startTime = Date.now();
				let self = this;
				return function () {
					let currTime = Date.now();
					let args = arguments;
					if (currTime - startTime >= delay) {
						func.apply(self, args);
						startTime = Date.now();
					}
				};
			},
		},
		mounted() {
			this.getBodySiz();
		},
		computed: {},
	};
</script>

<style lang="scss" scoped>
	.dash-board {
		width: 100%;
		height: 100%;
		background-color: #ececec;
		padding: 20px;
		box-sizing: border-box;
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
	}
	.drag-head {
		height: 100%;
	}
	.vue-drag {
		box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
		background-color: #fff;
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
		height: 30px;
		line-height: 30px;
		cursor: move;
	}
</style>
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
					:z="item.zIndex"
					:parentH="bodySize.height"
					:parentW="bodySize.width"
					v-on:resizing="val => resize(val, index)"
					v-on:dragging="val => resize(val, index)"
					@clicked="activeIndex = index"
					:parentLimitation="true"
					@resizestop="val=> resizeStop(val, index)"
					@dragstop="val=> resizeStop(val, index)"
					@deactivated="activeIndex = 'no'"
				>
					<template v-if="item.type != 'text'">
						<header class="chart-head">
							<span>{{item.title + index}}</span>
							<ul class="head-menu" @mousedown.stop>
								<i class="el-icon-zoom-in" title="放大" @click="showBig(item)"></i>
								<i class="el-icon-caret-top" title="向上" @click="topEle(item)"></i>
								<i class="el-icon-caret-bottom" title="向下" @click="bottomEle(item)"></i>
								<i class="el-icon-edit" title="编辑尺寸" @click="editSize(item)"></i>
								<i class="el-icon-coin" title="编辑数据"></i>
							</ul>
						</header>
						<div class="drag-box" @mousedown.stop>
							<ve-chart
								:ref="'coluChart' + index"
								:data="charData"
								width="100%"
								height="100%"
								:resize-delay="100"
								:judge-width="true"
								:settings="item.settings"
							></ve-chart>
						</div>
					</template>
					<template v-else>
						<div class="drag-head">
							<ul class="head-abso head-menu" @mousedown.stop>
								<i class="el-icon-zoom-in" title="放大" @click="showBig(item)"></i>
								<i class="el-icon-caret-top" title="向上" @click="topEle(item)"></i>
								<i class="el-icon-caret-bottom" title="向下" @click="bottomEle(item)"></i>
								<i class="el-icon-edit" title="编辑尺寸" @click="editSize(item)"></i>
								<i class="el-icon-coin" title="编辑数据"></i>
							</ul>
							<h1 class="header-title">{{item.title + index}}</h1>
						</div>
					</template>
				</VueDragResize>
			</template>
			<div class="stand stand-x" :style="xStand"></div>
			<div class="stand stand-y" :style="yStand"></div>
		</section>
		<Popup
			:showPp="editSizeStu"
			title="编辑"
			@catchEv="cachEdit"
			@confirm="confirmEdit"
			@closeEv="cachEdit"
		>
			<div class="form-size" @keyup.enter="confirmEdit">
				<!-- <div class="form-items"> -->
				<div class="form-inp">
					<span>标题</span>
					<el-input size="small" v-model="titleE" ref="eidtTitle"></el-input>
				</div>
				<!-- </div> -->
				<div class="form-items">
					<div class="form-inp">
						<span>距左边框</span>
						<el-input size="small" v-model="leftE" type="number" :min="0"></el-input>
					</div>
					<div class="form-inp">
						<span>距上边框</span>
						<el-input size="small" v-model="topE" type="number" :min="0"></el-input>
					</div>
				</div>
				<div class="form-items">
					<div class="form-inp">
						<span>宽度</span>
						<el-input size="small" v-model="widthE" type="number" :min="100"></el-input>
					</div>
					<div class="form-inp">
						<span>高度</span>
						<el-input size="small" v-model="heightE" type="number" :min="100"></el-input>
					</div>
				</div>
			</div>
		</Popup>
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
					width: null,
					height: null,
					oldWidth: 1080,
					oldHeight: 1080,
				},
				boxList: [
					{
						title: "饼图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						zIndex: 1,
						type: "pie",
						settings: { type: "pie", offsetY: "50%" },
					},
					{
						title: "柱状图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						zIndex: 1,
						type: "histogram",
						settings: { type: "histogram" },
					},
					{
						title: "折线图",
						width: 300,
						height: 300,
						top: 0,
						zIndex: 1,
						left: 0,
						type: "line",
						settings: { type: "line" },
					},
					{
						title: "这是一个好系统",
						width: 300,
						height: 300,
						top: 0,
						zIndex: 1,
						left: 0,
						type: "text",
					},
					{
						title: "环图",
						width: 300,
						height: 300,
						top: 0,
						left: 0,
						zIndex: 1,
						type: "ring",
						settings: {
							type: "ring",
							offsetY: "50%",
							radius: ["50%", "70%"],
						},
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
				// 需改边的left 和 top
				leftChange: "no",
				topChange: "no",
				addFuncTol: null,
				throTimer: null,
				// 编辑长宽
				editSizeStu: false,
				drageStu: false,
				editSizeInfo: {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
				},
				backupData: {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
				},
				titleE: "",
				leftE: 0,
				topE: 0,
				widthE: 0,
				heightE: 0,
				currEditItem: null,
				rundType: ["pie"],
				resizeChar: null, // char图resize
				resizeTh: null,
				currBig: { settings: {} },
				showBigStu: false,
				hiddenHei: true,
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
                if(this.currBig.type == 'pie'){
                    this.$nextTick(()=>{
                        Object.assign(this.currBig.settings, {radius: this.$refs.bigShow.clientHeight*0.4})
                    })
                }
				this.showBigStu = true;
			},
			// 向上
			topEle(item) {
				let obj = this.boxList.find((i) => i.zIndex == 2);
				if (obj) obj.zIndex = 1;
				item.zIndex = 2;
			},
			// 向下
			bottomEle(item) {
				let obj = this.boxList.find((i) => i.zIndex == 0);
				if (obj) obj.zIndex = 1;
				item.zIndex = 0;
			},
			resize(newRect, index) {
				this.drageStu = true;
				this.boxList[index].top = newRect.top;
				this.boxList[index].left = newRect.left;
				this.judgeLoact(newRect, index);
				let needRe = false;
				if (newRect.width != this.boxList[index].width) {
					let copyData = null;
					if (this.boxList[index].type == "pie") {
						let copyData = JSON.parse(
							JSON.stringify(
								Object.assign(this.boxList[index].settings, {
									radius: newRect.height * 0.4,
								})
							)
						);
						this.boxList[index].settings = copyData;
					}
					this.boxList[index].width = newRect.width;
					needRe = true;
				}
				if (newRect.height != this.boxList[index].height) {
					this.boxList[index].height = newRect.height;
					needRe = true;
				}
				if (needRe) {
					if (!this.resizeChar) {
						this.resizeChar = this.throttle(this.resizeCharFun, 600);
					}
					this.resizeChar(index);
				}
			},
			resizeCharFun(index) {
				let ref = this.$refs[`coluChart${index}`];
				if (Array.isArray(ref)) {
					ref[0].echarts.resize();
				} else if (ref) {
					ref.echarts.resize();
				}
			},
			resizeStop(newRect, index) {
				this.drageStu = false;
				window.clearTimeout(self.throTimer);
				if (this.topChange != "no") {
					this.boxList[index].top = this.topChange;
				}
				if (this.leftChange != "no") {
					this.boxList[index].left = this.leftChange;
				}
				this.topChange = "no";
				this.topChange = "no";
				this.yStand.display = "none";
				this.xStand.display = "none";
			},
			getBodySiz() {
				this.bodySize.width = this.$refs.dashBody.clientWidth;
				this.bodySize.height = this.$refs.dashBody.clientHeight;
			},
			judgeLoact(newRect, index) {
				// if (!this.addFuncTol) {
				// 	this.addFuncTol = this.throttle(this.dealLocat, 500);
				// }
				this.dealLocat(newRect, index);
			},
			dealLocat(newRect, index) {
				this.pagePost(newRect, index);
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
			// 找排第二
			findTwo(arr) {
				return arr.findIndex(
					(i) =>
						i ==
						JSON.parse(JSON.stringify(arr)).sort((a, b) => a - b)[1]
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
				let resTopArr = [];
				let resLeftArr = [];
				let resBotmArr = [];
				let resRightArr = [];
				let resLevArr = [];
				let resVerArr = [];
				this.boxList.forEach((it, ind) => {
					resTopArr.push(Math.abs(it.top - this.boxList[index].top));
					resLeftArr.push(Math.abs(it.left - this.boxList[index].left));
					resRightArr.push(
						Math.abs(
							it.left +
								it.width -
								this.boxList[index].left -
								this.boxList[index].width
						)
					);
					resBotmArr.push(
						Math.abs(
							it.top +
								it.height -
								this.boxList[index].top -
								this.boxList[index].height
						)
					);
					resLevArr.push(
						Math.abs(
							it.left +
								it.width / 2 -
								this.boxList[index].left -
								this.boxList[index].width / 2
						)
					);
					resVerArr.push(
						Math.abs(
							it.top +
								it.height / 2 -
								this.boxList[index].top -
								this.boxList[index].height / 2
						)
					);
				});
				let topInd = this.findTwo(resTopArr);
				let leftInd = this.findTwo(resLeftArr);
				let botmInd = this.findTwo(resBotmArr);
				let rightInd = this.findTwo(resRightArr);
				let levInd = this.findTwo(resLevArr); //水平
				let verInd = this.findTwo(resVerArr); //垂直
				// 边对齐
				// left right
				if (this.leftChange == "no") {
					let leftObjEle = this.boxList[leftInd];
					let leftObjCenEle = this.boxList[levInd];
					let rightObjEle = this.boxList[rightInd];
					let leftCenDis = Math.abs(
						newRect.left +
							newRect.width / 2 -
							leftObjCenEle.left -
							leftObjCenEle.width / 2
					);
					let leftDis = Math.abs(leftObjEle.left - newRect.left);
					let rightDis = Math.abs(
						rightObjEle.left +
							rightObjEle.width -
							newRect.left -
							newRect.width
					);
					if (leftCenDis < 10 && leftCenDis != 0) {
						this.yStand.left =
							leftObjCenEle.left + leftObjCenEle.width / 2 + "px";
						this.leftChange =
							leftObjCenEle.left +
							leftObjCenEle.width / 2 -
							newRect.width / 2;
						this.yStand.display = "block";
					} else if (leftDis < 10 && leftDis != 0) {
						this.leftChange = leftObjEle.left;
						this.yStand.left = this.leftChange + "px";
						this.yStand.display = "block";
					} else if (rightDis < 10 && rightDis != 0) {
						this.leftChange =
							rightObjEle.left +
							rightObjEle.width -
							newRect.width;
						this.yStand.left =
							rightObjEle.left + rightObjEle.width + "px";
						this.yStand.display = "block";
					} else {
						this.leftChange = "no";
						this.yStand.display = "none";
					}
				}
				// top bootom
				if (this.topChange == "no") {
					let topObjEle = this.boxList[topInd];
					let topObjCenEle = this.boxList[verInd];
					let bootomObjCenEle = this.boxList[botmInd];
					let topCenDis = Math.abs(
						newRect.top +
							newRect.height / 2 -
							topObjCenEle.top -
							topObjCenEle.height / 2
					);
					let topDis = Math.abs(topObjEle.top - newRect.top);
					let bootomDis = Math.abs(
						bootomObjCenEle.top +
							bootomObjCenEle.height -
							newRect.top -
							newRect.height
					);
					if (topCenDis < 10 && topCenDis != 0) {
						this.xStand.top =
							topObjCenEle.top + topObjCenEle.height / 2 + "px";
						this.topChange =
							topObjCenEle.top +
							topObjCenEle.height / 2 -
							newRect.height / 2;
						this.xStand.display = "block";
					} else if (topDis < 10 && topDis != 0) {
						this.topChange = topObjEle.top;
						this.xStand.top = this.topChange + "px";
						this.xStand.display = "block";
					} else if (bootomDis < 10 && bootomDis != 0) {
						this.topChange =
							bootomObjCenEle.top +
							bootomObjCenEle.height -
							this.boxList[index].height;
						this.xStand.top =
							bootomObjCenEle.top + bootomObjCenEle.height + "px";
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
			// 编辑尺寸
			editSize(obj) {
				this.backupData = JSON.parse(JSON.stringify(obj));
				this.titleE = obj.title;
				this.heightE = obj.height;
				this.widthE = obj.width;
				this.leftE = obj.left;
				this.topE = obj.top;
				this.currEditItem = obj;
				this.editSizeStu = true;
				this.$refs.eidtTitle.focus();
			},
			cachEdit() {
				this.editSizeStu = false;
				this.currEditItem.top = this.backupData.top;
				this.currEditItem.left = this.backupData.left;
				this.currEditItem.width = this.backupData.width;
				this.currEditItem.height = this.backupData.height;
				this.currEditItem.title = this.backupData.title;
			},
			confirmEdit() {
				this.editSizeStu = false;
				this.currEditItem = null;
			},
			reloadSize() {
				this.bodySize.oldWidth = this.bodySize.width;
				this.bodySize.oldHeight = this.bodySize.height;
				if (this.$refs.dashBody) {
					this.bodySize.width = this.$refs.dashBody.clientWidth;
					this.bodySize.height = this.$refs.dashBody.clientHeight;
					let ratioW = this.bodySize.oldWidth / this.bodySize.width;
					let ratioH = this.bodySize.oldHeight / this.bodySize.height;
					this.boxList.forEach((item) => {
						item.width = item.width / ratioW;
						item.left = item.left / ratioW;
						item.height = item.height / ratioH;
						item.top = item.top / ratioH;
					});
				}
			},
		},
		mounted() {
			this.getBodySiz();
			this.resizeTh = this.throttle(this.reloadSize, 500);
			window.addEventListener("resize", this.resizeTh);
		},
		components: {
			Popup: () => import("./Popup.vue"),
		},
		watch: {
			heightE: {
				handler(newV, oldV) {
					if (!this.drageStu) {
						if (newV >= 0) {
							this.currEditItem.height = Number.isNaN(
								parseFloat(newV)
							)
								? 0
								: parseFloat(newV);
						}
					}
				},
			},
			widthE: {
				handler(newV) {
					if (!this.drageStu) {
						if (newV >= 0) {
							this.currEditItem.width = Number.isNaN(parseFloat(newV))
								? 0
								: parseFloat(newV);
						}
					}
				},
			},
			leftE: {
				handler(newV) {
					if (!this.drageStu) {
						if (newV >= 0) {
							this.currEditItem.left = Number.isNaN(parseFloat(newV))
								? 0
								: parseFloat(newV);
						}
					}
				},
			},
			topE: {
				handler(newV) {
					if (!this.drageStu) {
						this.currEditItem.top = Number.isNaN(parseFloat(newV))
							? 0
							: parseFloat(newV);
					}
				},
			},
			titleE: {
				handler(newV) {
					if (!this.drageStu) {
						this.currEditItem.title = newV;
					}
				},
			},
			currEditItem: {
				handler(newv, oldv) {
					if (this.drageStu) {
						this.heightE = newv.height;
						this.widthE = newv.width;
						this.leftE = newv.left;
						this.topE = newv.top;
						this.titleE = newv.title;
					}
				},
				deep: true,
			},
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
		destroyed() {
			window.removeEventListener("resize", this.resizeTh);
		},
	};
</script>

<style lang="scss" scoped>
	.dash-board {
		width: 100%;
		height: 100%;
		background-color: #ececec;
		padding: 20px;
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
		box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		// padding: 0 10px 10px 10px;
		box-sizing: border-box;
		background-color: #fff;
		&:hover .head-menu {
			display: block;
		}
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
		cursor: move;
		justify-content: space-between;
	}
	.head-abso {
		position: absolute;
		right: 10px;
		top: 5px;
	}
	.head-menu {
		display: none;
		border-radius: 2em;
		border: 1px solid transparent;
		transition: border-color 0.2s;
		cursor: auto;
		&:hover {
			border-color: #44444480;
		}
		padding: 2px 10px;
		& > i {
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
		& > i + i {
			margin-left: 10px;
		}
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

	// ::v-deep .form-size input:invalid {
	// 	border-color: #f56c6c;
	// }
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
</style>
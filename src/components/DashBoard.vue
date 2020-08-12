<template>
	<div class="dash-board">
		<!-- v-show="refreshDash" -->
		<section
			class="dash-body"
			ref="dashBody"
			:style="{
            backgroundColor: bodyStyle.backgroundColor,
            backgroundImage: `url(${bodyStyle.backgroundImage})`
        }"
		>
			<template v-for="item in boxList">
				<!-- :ref="`box${item.index}`" -->
				<VueDragResize
					:key="item.index"
					class="vue-drag"
					:isActive="activeIndex == item.index"
					:w="item.width"
					:h="item.height"
					:x="item.left"
					:y="item.top"
					:z="item.zIndex"
					:parentH="bodySize.height"
					:parentW="bodySize.width"
					v-on:resizing="val => resize(val, item)"
					v-on:dragging="val => resize(val, item)"
					@clicked="activeIndex = item.index"
					:parentLimitation="true"
					@resizestop="val=> resizeStop(val,item)"
					@dragstop="val=> resizeStop(val,item)"
					@deactivated="activeIndex = 'no'"
					v-if="item.show"
					:minw="150"
					:style="item.style"
				>
					<template v-if="item.type != 'text' && item.type != 'numText'">
						<header class="chart-head">
							<span
								:style="{
                                color: item.style.headFColor,
                                fontSize: item.style.headFSize + 'px',
                                fontWeight: item.style.headWeight && 'bolder' || 'normal',
                                }"
							>{{item.title + item.index}}</span>
							<ul class="head-menu head-abso" @mousedown.stop>
								<i class="el-icon-edit" title="编辑样式" @click="editSize(item)"></i>
								<i class="el-icon-coin" title="编辑数据" @click="addDataTo(item)"></i>
								<div class="head-menu-more">
									<i class="el-icon-menu" title="更多"></i>
									<div class="menu-ul">
										<ul>
											<li class="menu-li-border">
												<i class="el-icon-link" @click="bindLink(item)" title="绑定链接"></i>
											</li>
											<li class="menu-li-border">
												<i class="iconfont icon-jianzhujianju" @click="blockInterval(item)" title="间距"></i>
											</li>
											<li class="menu-li-border">
												<i class="el-icon-zoom-in" title="放大" @click="showBig(item)"></i>
											</li>
											<li>
												<i class="el-icon-caret-top" title="向上" @click="topEle(item)"></i>
											</li>
											<li>
												<i class="el-icon-caret-bottom" title="向下" @click="bottomEle(item)"></i>
											</li>
										</ul>
									</div>
								</div>
								<i class="el-icon-delete-solid" title="删除" @click="deleteBox(item)"></i>
							</ul>
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
							<div class="head-abso head-menu" @mousedown.stop>
								<i class="el-icon-edit" title="编辑样式" @click="editSize(item)"></i>
								<i class="el-icon-coin" title="编辑数据" @click="addDataTo(item)"></i>
								<div class="head-menu-more">
									<i class="el-icon-menu" title="更多"></i>
									<div class="menu-ul">
										<ul>
											<li class="menu-li-border">
												<i class="el-icon-link" @click="bindLink(item)" title="绑定链接"></i>
											</li>
											<li class="menu-li-border">
												<i class="iconfont icon-jianzhujianju" @click="blockInterval(item)" title="间距"></i>
											</li>
											<li>
												<i class="el-icon-caret-top" title="向上" @click="topEle(item)"></i>
											</li>
											<li>
												<i class="el-icon-caret-bottom" title="向下" @click="bottomEle(item)"></i>
											</li>
										</ul>
									</div>
								</div>
								<i class="el-icon-delete-solid" title="删除" @click="deleteBox(item)"></i>
							</div>
							<h1
								class="header-title"
								:style="{
                                color: item.style.headFColor
                                }"
							>{{item.title + item.index}}</h1>
						</div>
					</template>
					<template v-else-if="item.type == 'numText'">
						<div class="drag-head drag-num">
							<div class="head-abso head-menu" @mousedown.stop>
								<i class="el-icon-edit" title="编辑样式" @click="editSize(item)"></i>
								<i class="el-icon-coin" title="编辑数据" @click="addDataTo(item)"></i>
								<div class="head-menu-more">
									<i class="el-icon-menu" title="更多"></i>
									<div class="menu-ul">
										<ul>
											<li class="menu-li-border">
												<i class="el-icon-link" @click="bindLink(item)" title="绑定链接"></i>
											</li>
											<li class="menu-li-border">
												<i class="iconfont icon-jianzhujianju" @click="blockInterval(item)" title="间距"></i>
											</li>
											<li>
												<i class="el-icon-caret-top" title="向上" @click="topEle(item)"></i>
											</li>
											<li>
												<i class="el-icon-caret-bottom" title="向下" @click="bottomEle(item)"></i>
											</li>

											<!-- <li>
												<i class="iconfont icon-beijingtu" title="添加背景图" @click="addBgcBox(item)"></i>
											</li>-->
										</ul>
									</div>
								</div>
								<i class="el-icon-delete-solid" title="删除" @click="deleteBox(item)"></i>
							</div>
							<span
								class="number"
								:style="{
                                'font-size': item.style.numFSize + 'px',
                                'color': item.style.numColor,
                                'font-weight': item.style.numWeight && 'bolder' || '',
                                'margin-bottom': item.style.marginB + 'px'
                            }"
							>{{item.data.num | formatNum(item.numSetting)}}</span>
							<span
								class="remark"
								v-text="item.title"
								:style="{
                                'font-size': item.style.headFSize + 'px',
                                'color': item.style.headFColor,
                                'font-weight': item.style.headWeight && 'bolder' || '',
                            }"
							></span>
						</div>
					</template>
				</VueDragResize>
			</template>
			<div class="stand stand-x" :style="xStand"></div>
			<div class="stand stand-y" :style="yStand"></div>
			<div
				v-for="item in blockInterArr"
				:key="item.type"
				:class="['stand', item.height == 0?'stand-x':'stand-y']"
				:style="{
                width: item.width + 'px',
                height: item.height + 'px',
                left: item.left + 'px',
                top: item.top + 'px',
            }"
			></div>
			<div class="cvs-set">
				<div class="set-item" title="预览" @click="$router.push('/dboardShow')">
					<i class="el-icon-view"></i>
				</div>
				<div class="set-item" title="新建" @click="dialogVisible = true">
					<i class="el-icon-circle-plus-outline"></i>
				</div>
				<!-- <div class="set-item" title="间距">
					<i class="el-icon-crop"></i>
				</div>-->
				<div class="set-item" title="全局设置" @click="editGlobalS">
					<i class="el-icon-monitor"></i>
				</div>
				<div class="set-item" title="画布设置" @click="editBodyS">
					<i class="el-icon-s-tools"></i>
				</div>
			</div>
			<div class="shade" v-show="showShadeStu" @click="closeShadow">
				<Popup
					:showPp="editGlobal"
					title="全局设置"
					@catchEv="cachEditGlobal"
					@confirm="confirmEditGlobal"
					@closeEv="cachEditGlobal"
					@click.native.stop
				>
					<div class="form-size" @keyup.enter="confirmEditGlobal">
						<div class="mini-title">标题</div>
						<div class="border-inp inp-padding">
							<div>
								<span>大小</span>
								<el-input size="mini" type="number" v-model="globalData.headFSize"></el-input>
							</div>
							<div>
								<span>颜色</span>
								<el-input size="mini" type="color" v-model="globalData.headFColor"></el-input>
							</div>
							<div>
								<span>加粗</span>
								<el-checkbox size="mini" v-model="globalData.headWeight"></el-checkbox>
							</div>
						</div>
						<div class="mini-title">块边框</div>
						<div class="border-inp inp-padding">
							<div>
								<span>宽度</span>
								<el-input size="mini" type="number" v-model="globalData.borderWidth"></el-input>
							</div>
							<div>
								<span>颜色</span>
								<el-input size="mini" type="color" v-model="globalData.borderColor"></el-input>
							</div>
							<div class="border-edit">
								<span>样式</span>
								<el-select v-model="globalData.borderStyle" placeholder="请选择" size="mini">
									<el-option
										v-for="item in borderStyle"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</div>
						</div>
						<div class="mini-title">边框圆角</div>
						<div class="inp-padding">
							<el-input size="mini" type="number" v-model="globalData.borderRadius"></el-input>
						</div>
						<div class="mini-title">背景图片</div>
						<div class="inp-padding">
							<el-upload
								class="upimg-box"
								:show-file-list="false"
								:before-upload="(val) => beforUpImage(val, 'globalData')"
								:http-request="()=>{}"
								accept="image/*"
								action="#"
							>
								<img v-if="globalData.backgroundImage" :src="globalData.backgroundImage" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<div class="upimg-menu">
								<el-button plain size="small" type="danger" @click="globalData.backgroundImage = ''">移除</el-button>
							</div>
						</div>
						<div class="mini-title">背景颜色</div>
						<div class="border-inp inp-padding">
							<div>
								<span>透明</span>
								<el-checkbox size="mini" v-model="globalData.backgroundColorTran"></el-checkbox>
							</div>
							<div>
								<span>颜色</span>
								<el-input size="mini" type="color" v-model="globalData.backgroundColor"></el-input>
							</div>
						</div>
					</div>
				</Popup>
			</div>
			<div class="shade" v-show="interShadeStu" @click="closeInterShadow">
				<Popup
					:showPp="editInter"
					title="间距调整"
					@catchEv="cachEditInter"
					@confirm="confirmEditInter"
					@closeEv="cachEditInter"
					@click.native.stop
				>
					<div class="form-size" @keyup.enter="confirmEditInter">
						<div class="two-item">
							<div v-for="(item, index) in blockInterValue" :key="index">
								<span>{{item.type | changeCh}}</span>
								<el-input
									size="mini"
									type="number"
									@input="val => blurValue(val, item)"
									v-model="item.value"
									:ref="`interO${index}`"
								></el-input>
							</div>
						</div>
					</div>
				</Popup>
			</div>
			<Popup
				:showPp="editSizeStu"
				title="编辑"
				@catchEv="cachEdit"
				@confirm="confirmEdit"
				@closeEv="cachEdit"
			>
				<div class="form-size" @keyup.enter="confirmEdit">
					<div class="mini-title">标题</div>
					<div class="inp-title inp-padding">
						<el-input size="small" v-model="titleE" ref="eidtTitle"></el-input>
					</div>
					<div class="mini-title">标题样式</div>
					<div class="border-inp inp-padding">
						<div>
							<span>大小</span>
							<el-input size="mini" type="number" v-model="currStyle.headFSize"></el-input>
						</div>
						<div>
							<span>颜色</span>
							<el-input size="mini" type="color" v-model="currStyle.headFColor"></el-input>
						</div>
						<div>
							<span>加粗</span>
							<el-checkbox size="mini" v-model="currStyle.headWeight"></el-checkbox>
						</div>
					</div>
					<div class="mini-title">位置信息</div>
					<div class="form-items inp-padding">
						<div class="form-inp">
							<span>距左边框</span>
							<el-input size="small" v-model="leftE" type="number" :min="0"></el-input>
						</div>
						<div class="form-inp">
							<span>距上边框</span>
							<el-input size="small" v-model="topE" type="number" :min="0"></el-input>
						</div>
					</div>
					<div class="form-items inp-padding">
						<div class="form-inp">
							<span>宽度</span>
							<el-input size="small" v-model="widthE" type="number" :min="100"></el-input>
						</div>
						<div class="form-inp">
							<span>高度</span>
							<el-input size="small" v-model="heightE" type="number" :min="100"></el-input>
						</div>
					</div>
					<div class="mini-title">块背景图片</div>
					<div class="inp-padding">
						<el-upload
							class="upimg-box"
							:show-file-list="false"
							:before-upload="beforUpImage"
							:http-request="()=>{}"
							accept="image/*"
							action="#"
						>
							<img v-if="currStyle.backgroundImage" :src="currStyle.backgroundImage" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="upimg-menu">
							<el-button plain size="small" type="danger" @click="currStyle.backgroundImage = ''">移除</el-button>
						</div>
					</div>
					<div class="mini-title">块背景颜色</div>
					<div class="border-inp inp-padding">
						<div>
							<span>透明</span>
							<el-checkbox size="mini" v-model="currStyle.backgroundColorTran"></el-checkbox>
						</div>
						<div>
							<span>颜色</span>
							<el-input size="mini" type="color" v-model="currStyle.backgroundColor"></el-input>
						</div>
					</div>
					<div class="mini-title">块边框</div>
					<div class="border-inp inp-padding">
						<div>
							<span>宽度</span>
							<el-input size="mini" type="number" v-model="currStyle.borderWidth"></el-input>
						</div>
						<div>
							<span>颜色</span>
							<el-input size="mini" type="color" v-model="currStyle.borderColor"></el-input>
						</div>
						<div class="border-edit">
							<span>样式</span>
							<el-select v-model="currStyle.borderStyle" placeholder="请选择" size="mini">
								<el-option
									v-for="item in borderStyle"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</div>
					</div>
					<div v-if="currEditItem.type == 'numText'">
						<div class="mini-title">文本格式</div>
						<div class="border-inp inp-padding maring-t14">
							<div>
								<span>大小</span>
								<el-input size="mini" type="number" v-model="currStyle.numFSize"></el-input>
							</div>
							<div>
								<span>颜色</span>
								<el-input size="mini" type="color" v-model="currStyle.numColor"></el-input>
							</div>
							<div>
								<span>加粗</span>
								<el-checkbox size="mini" v-model="currStyle.numWeight"></el-checkbox>
							</div>
						</div>
						<div class="title-two maring-t14">上下间距</div>
						<div class="inp-padding maring-t14">
							<el-input size="mini" type="number" v-model="currStyle.marginB"></el-input>
						</div>
					</div>
				</div>
			</Popup>
			<Popup
				:showPp="editSizeStuCanv"
				title="画布设置"
				@catchEv="cachEditCanv"
				@confirm="confirmEditCanv"
				@closeEv="cachEditCanv"
			>
				<div class="form-size" @keyup.enter="confirmEditCanv">
					<!-- <div class="form-items"> -->
					<div class="mini-title">背景图片</div>
					<div class="inp-padding">
						<el-upload
							class="upimg-box"
							:show-file-list="false"
							:before-upload="(val) => beforUpImage(val, 'body')"
							:http-request="()=>{}"
							accept="image/*"
							action="#"
						>
							<img v-if="bodyStyle.backgroundImage" :src="bodyStyle.backgroundImage" class="avatar" />
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="upimg-menu">
							<el-button plain size="small" type="danger" @click="bodyStyle.backgroundImage = ''">移除</el-button>
							<!-- <el-button plain size="small" type="primary">应用所有</el-button> -->
						</div>
					</div>
					<div class="mini-title">背景颜色</div>
					<div>
						<el-input size="mini" type="color" v-model="bodyStyle.backgroundColor"></el-input>
					</div>
				</div>
			</Popup>
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
		<div class="inter-x"></div>
		<div class="inter-y"></div>
		<el-dialog title="添加盒子" :visible.sync="dialogVisible" width="20%">
			<div class="box-option box-option--one" @click="addBlock('text')">
				<span>文本</span>
				<div>
					<i class="iconfont icon-wenben"></i>
				</div>
			</div>
			<div class="box-option box-option--two" @click="addBlock('numText')">
				<span>数字</span>
				<div>
					<i class="iconfont icon-shuzi"></i>
				</div>
			</div>
			<div class="box-option box-option--three" @click="addBlock('picTable')">
				<span>图表格</span>
				<div>
					<i class="iconfont icon-zizengbiaoge"></i>
					<i class="iconfont icon-tubiao1"></i>
					<i class="iconfont icon-tubiao"></i>
				</div>
			</div>
		</el-dialog>
		<el-dialog title="选择数据" :visible.sync="dialogData" width="30%">
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogData = false" size="small">取 消</el-button>
				<el-button type="primary" @click="dialogData = false" size="small">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="绑定链接" :visible.sync="digLink" width="30%" @close="addLinkValue = ''">
			<el-input size="small" clearable v-model="addLinkValue"></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="digLink = false; addLinkValue = ''" size="small">取 消</el-button>
				<el-button type="primary" @click="comfirmAddL" size="small">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import numbro from "numbro";

	export default {
		name: "DashBoard",
		data() {
			this.typeArr = ["line", "histogram", "pie", "ring"];
			let img = require("@/assets/logo.png");
			return {
				// 图表数据
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
				// 画布大小
				bodySize: {
					width: 1880,
					height: 967,
					oldWidth: 1880,
					oldHeight: 967,
					backgroundImage: "",
					backgroundColor: "#ffffff",
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
						style: {
							headFColor: "#000", // 标题颜色
							headWeight: false,
							headFSize: "16",
							backgroundImage: "",
							backgroundColor: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
						},
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
						style: {
							headFColor: "#000", // 标题颜色
							headWeight: false,
							headFSize: "16",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							backgroundColor: "",
						},
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
						style: {
							headFColor: "#000", // 标题颜色
							headWeight: false,
							headFSize: "16",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							backgroundColor: "",
						},
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
						style: {
							headFColor: "#000", // 标题颜色
							headWeight: false,
							headFSize: "16",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							backgroundColor: "",
						},
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
						style: {
							headFColor: "#000", // 标题颜色
							headWeight: false,
							headFSize: "16",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							backgroundColor: "",
						},
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
							headFColor: "#000", // 标题颜色
							headWeight: true,
							headFSize: "18",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							numColor: "#01fcff",
							numWeight: true,
							// remarkColor: "#000",
							numFSize: "32",
							// remarkFSize: "18",
							// remarkWeight: true,
							marginB: "10",
							backgroundColor: "",
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
							headFColor: "#000", // 标题颜色
							headWeight: true,
							headFSize: "18",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							numColor: "#01fcff",
							numWeight: true,
							// remarkColor: "#000",
							numFSize: "32",
							// remarkFSize: "18",
							// remarkWeight: true,
							marginB: "10",
							backgroundColor: "",
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
							headFColor: "#000", // 标题颜色
							headWeight: true,
							headFSize: "18",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							numColor: "#01fcff",
							numWeight: true,
							// remarkColor: "#000",
							numFSize: "32",
							// remarkFSize: "18",
							// remarkWeight: true,
							marginB: "10",
							backgroundColor: "",
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
							headFColor: "#000", // 标题颜色
							headWeight: true,
							headFSize: "18",
							backgroundImage: "",
							borderWidth: "0",
							borderColor: "#000",
							borderStyle: "solid",
							numColor: "#01fcff",
							numWeight: true,
							// remarkColor: "#000",
							numFSize: "32",
							// remarkFSize: "18",
							// remarkWeight: true,
							marginB: "10",
							backgroundColor: "",
						},
					},
				],
				// x、y轴定位虚线
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
				// throTimer: null,
				// 编辑长宽
				editSizeStu: false,
				drageStu: false,

				// 数据编辑备份
				backupData: {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
				},
				// 当前编辑信息
				titleE: "",
				leftE: 0,
				topE: 0,
				widthE: 0,
				heightE: 0,
				borderSE: "solid",
				currStyle: {
					headWeight: false,
					headFSize: "16",
					headFColor: "#ffffff",
					backgroundImage: "",
					borderWidth: "0",
					borderColor: "#000",
					borderStyle: "solid",
					numColor: "#01fcff",
					numWeight: true,
					// remarkColor: "#000",
					numFSize: "32",
					// remarkFSize: "18",
					// remarkWeight: true,
					marginB: "10",
					backgroundColor: "#ffffff",
					backgroundColorTran: true,
				},
				// 当前编辑对象
				currEditItem: {},
				// echar图重绘
				resizeChar: null, // char图resize

				// resize回调函数
				resizeTh: null,

				// 放大临时对象
				currBig: { settings: {} },

				showBigStu: false,
				hiddenHei: true,
				reloadTimer: null,
				upImageData: null, // 上传图片
				borderStyle: [
					{
						label: "无边",
						value: "none",
					},
					{
						label: "点状",
						value: "dotted",
					},
					{
						label: "虚线",
						value: "dashed",
					},
					{
						label: "实线",
						value: "solid",
					},
					{
						label: "双线",
						value: "double",
					},
				],
				// 画布设置
				editSizeStuCanv: false,
				bodyStyle: {
					backgroundImage: "",
					backgroundColor: "#ffffff",
				},
				bodyStyleCp: {
					backgroundImage: "",
					backgroundColor: "#ffffff",
				},

				// 全局设置
				editGlobal: false,
				globalData: {
					headWeight: false,
					headFSize: "16",
					headFColor: "#000",
					borderWidth: "0",
					borderColor: "#000",
					borderStyle: "solid",
					backgroundColor: "#ffffff",
					backgroundColorTran: true,
					borderRadius: "4",
					backgroundImage: "",
				},
				// 遮罩打开状态
				showShadeStu: false,
				// 块间距列表
				blockInterArr: [],

				blockInterValue: [
					{
						type: "top",
						value: 0,
						oldValue: 0,
					},
					{
						type: "bottom",
						value: 0,
						oldValue: 0,
					},
					{
						type: "left",
						value: 0,
						oldValue: 0,
					},
					{
						type: "right",
						value: 0,
						oldValue: 0,
					},
				],

				editInter: false,
				interShadeStu: false,
				currInterObj: null,

				// 快间距对比
				equalInterArr: [],

				dialogVisible: false, // 添加盒子
				dialogData: false, // 添加数据
				currAddItem: null,
				digLink: false, // 添加链接
				addLinkValue: "", // 链接
			};
		},
		methods: {
			beforUpImage(file, type) {
				this.statusEdit = true;
				let filteDa = file;
				var fileReader = new FileReader();
				fileReader.readAsDataURL(filteDa);
				// 读取操作完成触发
				fileReader.onload = (e) => {
					if (type) {
						this[type].backgroundImage = e.target.result;
					} else {
						this.currStyle.backgroundImage = e.target.result;
					}
				};
			},
			// 添加背景图
			addBgcBox() {},
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
			resize(newRect, itemObj) {
				this.drageStu = true;
				itemObj.top = newRect.top;
				itemObj.left = newRect.left;
				this.judgeLoact(newRect, itemObj);
				let needRe = false;
				if (newRect.width != itemObj.width) {
					let copyData = null;
					if (itemObj.type == "pie") {
						let radiusW = newRect.width * 0.3;
						let radiusH = newRect.height * 0.3;
						let copyData = JSON.parse(
							JSON.stringify(
								Object.assign(itemObj.settings, {
									radius: Math.min(radiusW, radiusH),
								})
							)
						);
						itemObj.settings = copyData;
					}
					itemObj.width = newRect.width;
					needRe = true;
				}
				if (newRect.height != itemObj.height) {
					itemObj.height = newRect.height;
					needRe = true;
				}
				if (needRe) {
					this.resizeChar(itemObj);
				}
			},
			resizeCharFun(itemObj) {
				let ref = this.$refs[`coluChart${itemObj.index}`];
				if (Array.isArray(ref)) {
					ref[0].echarts.resize();
				} else if (ref) {
					ref.echarts.resize();
				}
			},
			resizeStop(newRect, itemObj) {
				this.drageStu = false;
				// window.clearTimeout(self.throTimer);
				if (this.topChange != "no") {
					itemObj.top = this.topChange;
				}
				if (this.leftChange != "no") {
					itemObj.left = this.leftChange;
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
			judgeLoact(newRect) {
				// if (!this.addFuncTol) {
				// 	this.addFuncTol = this.throttle(this.dealLocat, 500);
				// }
				this.dealLocat(newRect);
			},
			dealLocat(newRect) {
				this.pagePost(newRect);
				this.blockPost(newRect);
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
			pagePost(newRect) {
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
				} else if (
					Math.abs(newRect.left - centerW) < 10 &&
					Math.abs(newRect.left - centerW) != 0
				) {
					this.leftChange = centerW;
					this.yStand.left = "50%";
					this.yStand.display = "block";
				} else if (
					Math.abs(newRect.left + newRect.width - centerW) < 10 &&
					Math.abs(newRect.left + newRect.width - centerW) != 0
				) {
					this.leftChange = centerW - newRect.width;
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
				} else if (
					Math.abs(newRect.top - centerH) < 10 &&
					Math.abs(newRect.top - centerH) != 0
				) {
					this.xStand.top = "50%";
					this.topChange = centerH;
					this.xStand.display = "block";
				} else if (
					Math.abs(newRect.top + newRect.height - centerH) < 10 &&
					Math.abs(newRect.top + newRect.height - centerH) != 0
				) {
					this.xStand.top = "50%";
					this.topChange = centerH - newRect.height;
					this.xStand.display = "block";
				} else {
					this.xStand.display = "none";
					this.topChange = "no";
				}
			},
			// 块定位
			blockPost(newRect) {
				let resTopArr = [];
				let resLeftArr = [];
				let resBotmArr = [];
				let resRightArr = [];
				let resLevArr = [];
				let resVerArr = [];
				this.boxList.forEach((it, ind) => {
					resTopArr.push(Math.abs(it.top - newRect.top));
					resLeftArr.push(Math.abs(it.left - newRect.left));
					resRightArr.push(
						Math.abs(it.left + it.width - newRect.left - newRect.width)
					);
					resBotmArr.push(
						Math.abs(it.top + it.height - newRect.top - newRect.height)
					);
					resLevArr.push(
						Math.abs(
							it.left +
								it.width / 2 -
								newRect.left -
								newRect.width / 2
						)
					);
					resVerArr.push(
						Math.abs(
							it.top +
								it.height / 2 -
								newRect.top -
								newRect.height / 2
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
							rightObjEle.left + rightObjEle.width - newRect.width;
						this.yStand.left =
							rightObjEle.left + rightObjEle.width + "px";
						this.yStand.display = "block";
					} else {
						this.leftChange = "no";
						this.yStand.display = "none";
					}
				}
				// top bottom
				if (this.topChange == "no") {
					let topObjEle = this.boxList[topInd];
					let topObjCenEle = this.boxList[verInd];
					let bottomObjCenEle = this.boxList[botmInd];
					let topCenDis = Math.abs(
						newRect.top +
							newRect.height / 2 -
							topObjCenEle.top -
							topObjCenEle.height / 2
					);
					let topDis = Math.abs(topObjEle.top - newRect.top);
					let bottomDis = Math.abs(
						bottomObjCenEle.top +
							bottomObjCenEle.height -
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
					} else if (bottomDis < 10 && bottomDis != 0) {
						this.topChange =
							bottomObjCenEle.top +
							bottomObjCenEle.height -
							newRect.height;
						this.xStand.top =
							bottomObjCenEle.top + bottomObjCenEle.height + "px";
						this.xStand.display = "block";
					} else {
						this.topChange = "no";
						this.xStand.display = "none";
					}
				}
			},
			// 块间距定位
			blockInterval(objItem) {
				this.currInterObj = objItem;
				let topV = objItem.top;
				let leftV = objItem.left;
				let bottomV = objItem.top + objItem.height;
				let rightV = objItem.left + objItem.width;
				let resTopArr = [];
				let resbottomArr = [];
				let resLeftArr = [];
				let resRightArr = [];
				for (let item of this.boxList) {
					if (item.index != objItem.index) {
						let bottomI = item.top + item.height;
						let rightI = item.left + item.width;
						let isbottom = item.top > bottomV;
						let isTop = bottomI < topV;
						if (
							!(item.left > rightV || rightI < leftV) &&
							(isbottom || isTop)
						) {
							let objA = {
								obj: item,
								left: 0,
								top: isbottom ? bottomV : bottomI,
								height: isbottom
									? item.top - bottomV
									: topV - bottomI,
								width: 0,
								type: isbottom ? "bottom" : "top",
							};

							if (item.left >= leftV && rightI <= rightV) {
								objA.left = item.left + item.width / 2;
							} else if (item.left < leftV && rightI <= rightV) {
								objA.left = (rightI - leftV) / 2 + leftV;
							} else if (rightI > rightV && item.left >= leftV) {
								objA.left = (rightV - item.left) / 2 + item.left;
							} else {
								objA.left = leftV + objItem.width / 2;
							}
							if (isTop) {
								resTopArr.push(objA);
							} else {
								resbottomArr.push(objA);
							}
							continue;
						}
						let isRight = item.left > rightV;
						let isLeft = rightI < leftV;
						if (
							!(item.top > bottomV || bottomI < topV) &&
							(isRight || isLeft)
						) {
							let objA = {
								obj: item,
								left: isRight ? rightV : rightI,
								top: 0,
								height: 0,
								width: isRight
									? item.left - rightV
									: leftV - rightI,
								isLeft,
								type: isRight ? "right" : "left",
							};
							if (item.top >= topV && bottomI <= bottomV) {
								objA.top = item.top + item.height / 2;
							} else if (item.top < topV && bottomI <= bottomV) {
								objA.top = (bottomI - topV) / 2 + topV;
							} else if (item.top >= topV && bottomI > bottomV) {
								objA.top = (bottomV - item.top) / 2 + item.top;
							} else {
								objA.top = topV + objItem.height / 2;
							}
							if (isLeft) {
								resLeftArr.push(objA);
							} else {
								resRightArr.push(objA);
							}
							continue;
						}
					}
				}
				resLeftArr.sort((a, b) => a.width - b.width);
				resRightArr.sort((a, b) => a.width - b.width);
				resTopArr.sort((a, b) => a.height - b.height);
				resbottomArr.sort((a, b) => a.height - b.height);

				let topObj = resTopArr[0];
				let bottomObj = resbottomArr[0];
				let rightObj = resRightArr[0];
				let leftObj = resLeftArr[0];
				if (!topObj) {
					topObj = {
						width: 0,
						top: 0,
						left: objItem.width / 2 + leftV,
						height: topV,
						type: "top",
					};
				}
				if (!bottomObj) {
					bottomObj = {
						width: 0,
						top: topV + objItem.height,
						left: objItem.width / 2 + leftV,
						height: this.bodySize.height - topV - objItem.height,
						type: "bottom",
					};
				}
				if (!rightObj) {
					rightObj = {
						width: this.bodySize.width - leftV - objItem.width,
						top: topV + objItem.height / 2,
						left: leftV + objItem.width,
						height: 0,
						type: "right",
					};
				}
				if (!leftObj) {
					leftObj = {
						width: leftV,
						top: topV + objItem.height / 2,
						left: 0,
						height: 0,
						type: "left",
					};
				}
				this.blockInterArr = [];
				this.blockInterValue[0].value = topObj.height;
				this.blockInterValue[0].oldValue = topObj.height;

				this.blockInterValue[1].value = bottomObj.height;
				this.blockInterValue[1].oldValue = bottomObj.height;

				this.blockInterValue[2].value = leftObj.width;
				this.blockInterValue[2].oldValue = leftObj.width;

				this.blockInterValue[3].value = rightObj.width;
				this.blockInterValue[3].oldValue = rightObj.width;

				this.blockInterArr.push(topObj);
				this.blockInterArr.push(bottomObj);
				this.blockInterArr.push(leftObj);
				this.blockInterArr.push(rightObj);
				this.editInterS();
				// return { topObj, bottomObj, rightObj, leftObj };
			},
			blurValue(val, item) {
				val = parseFloat(val);
				if (!isNaN(val) && val >= 0) {
					let obj = this.findInterObj(item.type);
					let diff = item.oldValue - val;
					item.oldValue = val;
					obj.oldValue = obj.value;
					obj.value = parseFloat(obj.value) + diff;
				}
			},
			getValueToView() {
				this.currInterObj.top =
					parseFloat(this.blockInterValue[0].value) +
					this.blockInterArr[0].top;
				this.currInterObj.left =
					parseFloat(this.blockInterValue[2].value) +
					this.blockInterArr[2].left;
			},
			findInterObj(type) {
				switch (type) {
					case "top":
						return this.blockInterValue.find(
							(it) => it.type == "bottom"
						);
					case "bottom":
						return this.blockInterValue.find((it) => it.type == "top");
					case "left":
						return this.blockInterValue.find(
							(it) => it.type == "right"
						);
					case "right":
						return this.blockInterValue.find((it) => it.type == "left");
				}
			},
			// 计算块间距相等的位置
			findEqualInter(newRect) {
				// 纵向
				let xResArr = [];
				this.findXEqual(newRect, xResArr);
				// 横向
			},
			findXEqual(newRect, resArr) {
				let xArr = [];
				let yArr = [];
				this.boxList.forEach((item) => {
					if (item.index != newRect.index) {
						if (
							item.left >= newRect.left + newRect.width ||
							item.left + item.width <= newRect.left
						) {
							xArr.push(item);
						}
						if (
							item.top >= newRect.top + newRect.height ||
							item.top + item.height <= newRect.top
						) {
							yArr.push(item);
						}
					}
				});
			},
			interDatumLine(obj) {},
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
			// 编辑样式
			editSize(obj) {
				this.backupData = JSON.parse(JSON.stringify(obj));
				this.titleE = obj.title;
				this.heightE = obj.height;
				this.widthE = obj.width;
				this.leftE = obj.left;
				this.topE = obj.top;
				Object.assign(this.currStyle, obj.style);
				this.currStyle.borderWidth = parseFloat(this.currStyle.borderWidth);
				let url = /^url\((.+)\)$/g.exec(this.currStyle.backgroundImage);
				this.currStyle.backgroundImage = (url && url[1]) || "";
				this.currStyle.backgroundColor = this.currStyle.backgroundColor;
				if (this.currStyle.backgroundColor != "transparent") {
					this.currStyle.backgroundColorTran = false;
				} else {
					this.currStyle.backgroundColorTran = true;
				}
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
				let cpData = JSON.parse(JSON.stringify(this.currStyle));
				cpData.borderWidth += "px";
				cpData.backgroundImage = `url(${cpData.backgroundImage})`;
				if (cpData.backgroundColorTran) {
					cpData.backgroundColor = "transparent";
				}
				delete cpData.backgroundColorTran;
				this.currEditItem.style = cpData;
				this.resizeCharFun(this.currEditItem);
				this.currStyle = {
					headWeight: false,
					headFSize: "16",
					headFColor: "#ffffff",
					backgroundImage: "",
					borderWidth: "0",
					borderColor: "#000",
					borderStyle: "solid",
					numColor: "#01fcff",
					// remarkColor: "#000",
					numFSize: "32",
					// remarkFSize: "18",
					marginB: "10",
					numWeight: true,
					// remarkWeight: true,
					backgroundColorTran: true,
					backgroundColor: "",
					headFColor: "#000",
				};
				this.currEditItem = {};
			},
			dealStyleIn(obj) {},
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
						item.show = false;
						this.$nextTick(() => {
							item.show = true;
						});
					});
				}
			},
			// 画布设置
			cachEditCanv() {
				this.editSizeStuCanv = false;
				this.bodyStyle = JSON.parse(this.bodyStyleCp);
				this.bodyStyleCp = "";
			},
			confirmEditCanv() {
				this.editSizeStuCanv = false;
				this.bodyStyleCp = "";
			},
			editBodyS() {
				this.editSizeStuCanv = true;
				this.bodyStyleCp = JSON.stringify(this.bodyStyle);
			},
			// 全局设置
			cachEditGlobal() {
				this.editGlobal = false;
			},
			confirmEditGlobal() {
				this.boxList.forEach((item) => {
					item.style.headFColor = this.globalData.headFColor;
					item.style.headWeight = this.globalData.headWeight;
					item.style.headFSize = this.globalData.headFSize;

					item.style.backgroundImage = `url(${this.globalData.backgroundImage})`;
					item.style.backgroundColor = this.globalData.backgroundColorTran
						? "transparent"
						: this.globalData.backgroundColor;
					item.style.borderWidth = this.globalData.borderWidth + "px";
					item.style.borderColor = this.globalData.borderColor;
					item.style.borderStyle = this.globalData.borderStyle;
					item.style.borderRadius = this.globalData.borderRadius + "px";
				});
				this.editGlobal = false;
			},
			editGlobalS() {
				this.editSizeStu = false;
				this.showShadeStu = true;
				setTimeout(() => {
					this.editGlobal = true;
				}, 0);
			},
			closeShadow() {
				this.editGlobal = false;
			},
			// 间距调整
			cachEditInter() {
				this.editInter = false;
				this.blockInterArr = [];
			},
			confirmEditInter() {
				this.currInterObj.top =
					parseFloat(this.blockInterValue[0].value) +
					this.blockInterArr[0].top;
				this.currInterObj.left =
					parseFloat(this.blockInterValue[2].value) +
					this.blockInterArr[2].left;
				this.blockInterArr = [];
				this.editInter = false;
			},
			editInterS() {
				this.editInter = false;
				this.interShadeStu = true;
				setTimeout(() => {
					this.editInter = true;
					this.$refs.interO0[0].focus();
				}, 0);
			},
			closeInterShadow() {
				this.editInter = false;
				this.blockInterArr = [];
			},
			newBlock() {
				this.dialogVisible = true;
			},
			// 添加盒子
			addBlock(type) {
				let maxId = Math.max.apply(
					null,
					this.boxList.map((it) => it.index)
				);
				let obj = {
					title: "编辑",
					width: 325,
					height: 325,
					top: 50,
					left: 24,
					zIndex: 1,
					type,
					index: ++maxId,
					show: true,
					style: {
						headFColor: "#000", // 标题颜色
						headWeight: false,
						headFSize: "16",
						backgroundImage: "",
						backgroundColor: "#fff",
						borderWidth: "0",
						borderColor: "#000",
						borderStyle: "solid",
					},
					data: {},
				};
				if (type == "numText") {
					obj.width = 213;
					obj.height = 116;
				}
				if (type == "text") {
					obj.width = 370;
					obj.height = 100;
				}
				this.boxList.push(obj);
				this.dialogVisible = false;
			},
			// 删除盒子
			deleteBox(item) {
				this.boxList.splice(
					this.boxList.findIndex((it) => it.index == item.index),
					1
				);
			},
			// 编辑数据
			addDataTo(item) {
				this.dialogData = true;
				this.currAddItem = item;
			},
			comfrimAddDataTo() {
				this.dialogData = false;
				this.currAddItem = null;
			},
			// 绑定链接
			bindLink(item) {
				this.addLinkValue = "";
				this.digLink = true;
			},
			comfirmAddL() {
				this.addLinkValue = "";
				this.digLink = false;
			},
		},
		mounted() {
			this.reloadSize();
			this.resizeTh = this.throttle(this.reloadSize, 500);
			this.resizeChar = this.throttle(this.resizeCharFun, 300);
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
							this.resizeChar(
								this.boxList.find(
									(i) => i.index == this.currEditItem.index
								)
							);
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
							this.resizeChar(
								this.boxList.find(
									(i) => i.index == this.currEditItem.index
								)
							);
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
			editGlobal(newV) {
				if (!newV) {
					setTimeout(() => {
						this.showShadeStu = false;
					}, 400);
				}
			},
			editInter(newV) {
				if (!newV) {
					setTimeout(() => {
						this.interShadeStu = false;
					}, 400);
				}
			},
		},
		destroyed() {
			window.removeEventListener("resize", this.resizeTh);
		},
		filters: {
			formatNum(value, setting) {
				return numbro(value).format(setting);
			},
			changeCh(type) {
				switch (type) {
					case "left":
						return "左";
					case "right":
						return "右";
					case "top":
						return "上";
					case "bottom":
						return "下";
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
		padding: 20px;
		box-sizing: border-box;
		position: relative;
	}
	.dash-body {
		position: relative;
		z-index: 0;
		height: 100%;
		background-color: #ffffff;
		background-repeat: no-repeat;
		background-size: 100% 100%;
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
		// background-color: #ffffff;
		&:hover .head-menu {
			display: flex;
		}
		background-size: 100% 100%;
		box-sizing: border-box;
		background-repeat: no-repeat;
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
		z-index: 99;
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
		position: relative;
	}
	.head-abso {
		position: absolute;
		right: 10px;
		top: 5px;
	}
	.head-menu {
		background-color: #ffffff;
		display: none;
		border-radius: 2em;
		border-top: 1px solid transparent;
		transition: border-color 0.2s;
		cursor: auto;
		&:hover {
			border-top-color: #44444480;
		}
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
			background-color: #ffffff;
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
		background-color: #ffffff;
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
	.form-size .inp-title .el-input {
		width: auto;
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
		background-color: #ffffff;
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
		// justify-content: center;
		font-size: 14px;
		& > div {
			display: flex;
			align-items: center;
			// justify-content: center;
			// width: 30%;
			width: 30%;
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
		background-color: #ffffff;
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
		}
		& ~ div {
			margin-top: 10px;
		}
	}
	.inp-padding {
		padding: 0 10px;
	}
	.title-two {
		font-size: 14px;
		// margin-left: 10px;
		margin-top: 6px;
	}
	.maring-t14 {
		margin-top: 14px;
	}
	.inp-title {
		display: flex;
		align-items: center;
		& > div.el-input {
			flex-grow: 0;
		}
		&--color {
			width: 50px !important;
			margin-left: 10px;
		}
	}
	.shade {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		background-color: transparent;
		z-index: 100;
	}
	.two-item {
		display: flex;
		& > div {
			width: 50%;
			span {
				margin-right: 10px;
			}
		}
		& > div:first-child {
			margin-bottom: 15px;
		}
		flex-wrap: wrap;
	}
	// 添加盒子
	// ::v-deep .el-drawer.rtl:focus {
	// 	outline: none;
	// }
	// .dra-big-title {
	// 	line-height: 60px;
	// 	height: 60px;
	// 	margin: 0;
	// 	font-size: 18px;
	// 	color: #262626;
	// 	vertical-align: middle;
	// 	color: #373d41;
	// 	border-bottom: 1px solid #efefef;
	// }
	// .drawer__body,
	// .drawer__footer,
	// .dra-big-title {
	// 	padding: 0 24px;
	// }
	// .dra-box {
	// 	& > header {
	// 		font-size: 14px;
	// 		padding: 10px 0;
	// 	}
	// }
	// .drawer__footer {
	// 	border-top: 1px solid #efefef;
	// 	height: 60px;
	// 	line-height: 60px;
	// }
	// .drawer__body {
	// 	height: calc(100% - 120px);
	// }
	// .drag-inp-item {
	// 	span {
	// 		font-size: 14px;
	// 		margin-bottom: 15px;
	// 		display: inline-block;
	// 	}
	// }
	// .drag-inp-item ~ div {
	// 	margin-top: 15px;
	// }
	.box-option {
		color: #fff;
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
		height: 60px;
		align-items: center;
		cursor: pointer;
		& span {
			font-size: 14px;
		}
		& + div {
			margin-top: 15px;
		}
		& > div > i + i {
			margin-left: 10px;
		}
		transition: box-shadow 0.2s;
		&--one {
			background-color: skyblue;
			&:hover {
				box-shadow: 0px 0px 6px 0px rgba(135, 206, 235, 0.8);
			}
		}
		&--two {
			background-color: skyblue;
			&:hover {
				box-shadow: 0px 0px 6px 0px rgba(135, 206, 235, 0.8);
			}
		}
		&--three {
			background-color: skyblue;
			&:hover {
				box-shadow: 0px 0px 6px 0px rgba(135, 206, 235, 0.8);
			}
		}
	}
</style>
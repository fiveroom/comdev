<template>
	<div
		:class="['propup', showPp?'propup--show':'']"
		:style="{height: hidden?'0':'auto'}"
		@keydown.esc="$emit('closeEv')"
	>
		<div class="propup-cont">
			<header class="propup-head">
				<span>{{title}}</span>
				<i class="el-icon-close" @click="$emit('closeEv')"></i>
			</header>
			<main class="propup-body">
				<slot></slot>
			</main>
			<footer class="propup-foot">
				<el-button size="small" type="primary" @click="$emit('confirm')">确认</el-button>
				<el-button size="small" @click="$emit('catchEv')">取消</el-button>
			</footer>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
			},
			showPp: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				hidden: true,
			};
		},
		watch: {
			showPp(newV, oldV) {
				if (newV) {
					this.hidden = false;
				} else {
					setTimeout(() => {
						this.hidden = true;
					}, 400);
				}
			},
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	@keyframes showPp {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		80% {
			opacity: 0.5;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.propup {
		z-index: 99;
		position: absolute;
		box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.4);
		background-color: #fff;
		top: 20px;
		right: 20px;
		width: 400px;
		background-color: #fff;
		transform: translateY(-20px);
		border-radius: 4px;
		transition: all 0.4s;
		opacity: 0;
		background-color: #fff;
		transition-duration: 0.4s;
		transition-property: opacity, transform;
		max-height: calc(100% - 40px);
		overflow: auto;
		&-cont {
			height: 100%;
			overflow: auto;
		}
		&--show {
			opacity: 1;
			transform: translateY(0);
		}
		&-foot {
			text-align: right;
			padding: 0 20px;
		}
		// &-body,
		// &-foot {
		// 	padding: 0 20px;
		// }
		&-head,
		&-body {
			color: #373d41;
			border-bottom: 1px solid #efefef;
			// padding: 20px;
		}
		&-body,
		&-head,
		&-foot {
			padding: 20px;
		}
		&-foot {
			padding: 15px;
		}
		&-head i {
			float: right;
			cursor: pointer;
			&:hover {
				color: #000;
			}
		}
	}
</style>
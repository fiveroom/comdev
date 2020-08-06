<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: "App",
		components: {},
	};
</script>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}
	// html{
	//   height: 100%;
	// }
	// body{
	//   height: 100%;
	// }
	#app {
		height: 100vh;
	}

	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
		margin: 0;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>

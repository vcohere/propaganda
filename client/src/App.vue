<style lang="scss">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

#app {
	font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<template lang="pug">
	#app
		router-view
</template>

<script>
	export default {
		name: 'app'
	}
</script>

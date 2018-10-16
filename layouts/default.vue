<template>
	<div class="defaultContainer">
		<div>
			<headers __style__="system"></headers>
		</div>
		<div class="mainContainer">
			<nuxt/>
		</div>
	</div>
</template>

<script>
export default {
	components: {
	}
}
</script>

<style scoped>
.defaultContainer {
	height: 100%;
}

.headerContainer {
}

.mainContainer {
	margin-top:1px;
	position: absolute;
	left: 0px;
	right: 0px;
	top:60px;
	bottom: 0px;
}
</style>

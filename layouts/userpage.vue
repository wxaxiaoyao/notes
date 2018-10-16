<template>
	<div class="userpage-layout-container">
		<div>
			<headers __style__="userpage"></headers>
		</div>
		<div style="flex:1">
			<nuxt></nuxt>
		</div>
		<div>
			<footers __style__="system"></footers>
		</div>
	</div>
</template>

<script>
export default {
	components: {
	}
}
</script>

<style>
.el-container, .el-main {
	height:100%;
}
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
.userpage-layout-container {
	display:flex;
	height:100%;
	flex-direction:column;
}
</style>

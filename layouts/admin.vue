<template>
	<div style="display:flex; height:100%; flex-direction:column;">
		<div>
			<headers __style__="system"></headers>
		</div>
		<div style="flex:1; display:flex">
			<div class="left-container">
				<menus :__default_data__="menusOpts"></menus>
			</div>
			<div class="main-container">
				<nuxt></nuxt>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
	},

	data: function() {
		return {
			menusOpts: {
				activeIndex:"",
				menus:[
				{
					label:"用户",
					index:"/admin/users",
				},
				{
					label:"站点",
					index:"/admin/sites",
				},
				{
					label:"页面",
					index:"/admin/pages",
				},
				],
			}
		}
	}
}
</script>

<style scoped>
.left-container {
	min-width: 100px;
}
.main-container {
	flex:1;
}
</style>

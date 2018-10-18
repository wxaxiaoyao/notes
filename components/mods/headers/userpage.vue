<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div>
					<a class="iconfont icon-home" href="/" data-toggle="tooltip" title="首页"></a>
					<a class="iconfont icon-edit" href="/note/simple-editor" data-toggle="tooltip" title="简易编辑器"></a>
				</div>
				<pagenavs __style__="index"></pagenavs>
				<userlinks __style__="system"></userlinks>
			</div>
		</div>
	</div>
</template>

<script>
import common from "./common.js";

export default {
	mixins: [common],

	components: {
	},

	data: function() {
		return {
		}
	},

	methods: {
	},

	mounted() {
	}
}
</script>

<style scoped>
.headerContainer {
	border-bottom: 1px solid rgb(221,221,221);
	height:60px;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.flex-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 10px;
}
.icon-home, .icon-edit {
	font-size:30px;
	text-decoration: none;
}
</style>

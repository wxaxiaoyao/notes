
<template>
	<div class="footer-cellphone-menu-container">
		<div class="item-container" @click="clickItem('index')">
			<span>首页</span>
		</div>
		<div class="item-container" @click="clickItem('entry')">
			<span>功能</span>
		</div>
		<div class="item-container" @click="clickItem('me')">
			<span>我</span>
		</div>
	</div>
</template>

<script>
import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],
	data: function() {
		return {

		}
	},

	methods: {
		clickItem(cmd) {
			this.push(`/note/views/${cmd}`);
		}
	}

}
</script>

<style scoped>
.footer-cellphone-menu-container {
	height: 60px;
	display: flex;
    justify-content: space-between;
	border-top: solid 1px gray;
}
.item-container {
	flex:1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>

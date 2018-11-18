
<template>
	<div class="footer-sm-index-container">
		<mt-tabbar v-model="selected">
			<mt-tab-item v-for="(x,i) in items" :key="i" :id="x.url">
				<i slot="icon" :class="x.icon"></i>
				{{x.label}}
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],
	data: function() {
		return {
			selected:"",
			items: [
			{label:"首页", url:"/note/cellphones/index", icon:"iconfont icon-home"},
			{label:"功能", url:"/note/cellphones/entry", icon:"iconfont icon-entry"},
			{label:"我", url:"/note/cellphones/me", icon:"iconfont icon-me"},
			]
		}
	},
	watch: {
		selected: function(cmd) {
			this.push(cmd);
		}
	},

	methods: {
	},

	beforeMount() {
		const pathname = window.location.pathname;
		if (_.findIndex(this.items, x => x.url == pathname) >= 0) this.selected = pathname;
	}
}
</script>

<style scoped>
.footer-sm-index-container {
}
</style>

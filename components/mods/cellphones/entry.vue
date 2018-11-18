
<template>
	<div class="cellphones-entry-container">
		<mt-header title="功能"></mt-header>
		<mt-cell v-for="(x, i) in entrys" :key="i" 
			:title="x.label" 
			:label="x.description" 
			:to="x.url"
			is-link>
		</mt-cell>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function() {
		return {
			entrys: [
			{
				label:"日报",
				url: "/note/dailies/smIndex",
			}
			]
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		clickEntry(x) {
			this.push(x.value);
		}
	},

}
</script>

<style>
</style>

<style scoped>
</style>
